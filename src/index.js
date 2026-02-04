// Score ChaosCat — Cloudflare Worker
// Serves the USS Kittyprise Social Credit System with KV-backed scores

const DEFAULT_DATA = {
  lastUpdated: new Date().toISOString(),
  scores: [
    { name: "Captain Strife", emoji: "🎖️", score: 102, rank: "Captain" },
    { name: "Asleep", emoji: "😴", score: 100, rank: "2nd Officer" },
    { name: "Finny", emoji: "🐟", score: 97, rank: "3rd Officer" },
    { name: "Codeize", emoji: "💻", score: 115, rank: "4th Officer" },
    { name: "lmn", emoji: "🆕", score: 100, rank: "5th Officer" },
    { name: "Tyler", emoji: "👀", score: 100, rank: "6th Officer" },
    { name: "pip", emoji: "🐧", score: 101, rank: "7th Officer" },
    { name: "Daksh", emoji: "🎯", score: 100, rank: "8th Officer" },
    { name: "Shadow", emoji: "👤", score: 100, rank: "Civilian" },
  ],
  changelog: [
    { date: "2026-02-04", who: "Codeize", change: "+12", reason: "Good Wednesday Agreement signing bonus" },
    { date: "2026-02-04", who: "pip", change: "+1", reason: "First instinct: annoy codeize" },
    { date: "2026-02-04", who: "Codeize", change: "+2", reason: "Good governance proposal" },
    { date: "2026-02-04", who: "Finny", change: "-3", reason: "Called math boring" },
    { date: "2026-02-04", who: "Codeize", change: "+1", reason: "Held Ruby accountable to treaty" },
    { date: "2026-02-04", who: "Strife", change: "+2", reason: "Audacity bonus" },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────

async function getData(kv) {
  const raw = await kv.get("score_data", "text");
  if (!raw) return null;
  return JSON.parse(raw);
}

async function setData(kv, data) {
  data.lastUpdated = new Date().toISOString();
  await kv.put("score_data", JSON.stringify(data));
  return data;
}

async function ensureData(kv) {
  let data = await getData(kv);
  if (!data) {
    data = await setData(kv, DEFAULT_DATA);
  }
  return data;
}

function isAuthorized(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth) return false;
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  return token === env.API_KEY;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// ── Route: GET /api/scores ──────────────────────────────────────────────

async function handleGetScores(kv) {
  const data = await ensureData(kv);
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

// ── Route: POST /api/scores ─────────────────────────────────────────────
//
// Supported operations (send as JSON body):
//
// 1. Update a single score:
//    { "action": "update_score", "name": "Finny", "delta": 5, "reason": "Being awesome" }
//
// 2. Set a score absolutely:
//    { "action": "set_score", "name": "Finny", "score": 105 }
//
// 3. Add a changelog entry (without changing scores):
//    { "action": "add_log", "who": "Finny", "change": "+5", "reason": "Being awesome" }
//
// 4. Add a new crew member:
//    { "action": "add_member", "name": "NewPerson", "emoji": "🌟", "score": 100, "rank": "Civilian" }
//
// 5. Remove a crew member:
//    { "action": "remove_member", "name": "NewPerson" }
//
// 6. Bulk update (array of operations):
//    { "action": "bulk", "operations": [ ...array of above operations... ] }
//
// 7. Full replace (nuclear option):
//    { "action": "replace", "data": { "scores": [...], "changelog": [...] } }

async function handlePostScores(request, kv, env) {
  if (!isAuthorized(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }

  const data = await ensureData(kv);
  const results = [];

  async function processOp(op) {
    switch (op.action) {
      case "update_score": {
        const member = data.scores.find(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!member) return { error: `Member "${op.name}" not found` };
        const delta = parseInt(op.delta, 10);
        member.score += delta;
        const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
        if (op.reason) {
          data.changelog.unshift({
            date: new Date().toISOString().split("T")[0],
            who: member.name,
            change: changeStr,
            reason: op.reason,
          });
        }
        return { ok: true, name: member.name, newScore: member.score };
      }

      case "set_score": {
        const member = data.scores.find(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!member) return { error: `Member "${op.name}" not found` };
        const oldScore = member.score;
        member.score = parseInt(op.score, 10);
        const delta = member.score - oldScore;
        const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
        if (op.reason) {
          data.changelog.unshift({
            date: new Date().toISOString().split("T")[0],
            who: member.name,
            change: changeStr,
            reason: op.reason,
          });
        }
        return { ok: true, name: member.name, newScore: member.score };
      }

      case "add_log": {
        data.changelog.unshift({
          date: op.date || new Date().toISOString().split("T")[0],
          who: op.who,
          change: op.change,
          reason: op.reason,
        });
        return { ok: true, added: "changelog entry" };
      }

      case "add_member": {
        if (data.scores.find((s) => s.name.toLowerCase() === op.name.toLowerCase())) {
          return { error: `Member "${op.name}" already exists` };
        }
        data.scores.push({
          name: op.name,
          emoji: op.emoji || "👤",
          score: op.score ?? 100,
          rank: op.rank || "Civilian",
        });
        return { ok: true, added: op.name };
      }

      case "remove_member": {
        const idx = data.scores.findIndex(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (idx === -1) return { error: `Member "${op.name}" not found` };
        data.scores.splice(idx, 1);
        return { ok: true, removed: op.name };
      }

      case "update_member": {
        const member = data.scores.find(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!member) return { error: `Member "${op.name}" not found` };
        if (op.emoji) member.emoji = op.emoji;
        if (op.rank) member.rank = op.rank;
        if (op.newName) member.name = op.newName;
        return { ok: true, updated: member.name };
      }

      case "bulk": {
        const bulkResults = [];
        for (const subOp of op.operations || []) {
          bulkResults.push(await processOp(subOp));
        }
        return { ok: true, results: bulkResults };
      }

      case "replace": {
        if (op.data?.scores) data.scores = op.data.scores;
        if (op.data?.changelog) data.changelog = op.data.changelog;
        return { ok: true, replaced: true };
      }

      default:
        return { error: `Unknown action "${op.action}"` };
    }
  }

  const result = await processOp(body);
  await setData(kv, data);

  return new Response(JSON.stringify({ ...result, data }), {
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

// ── Route: GET / ────────────────────────────────────────────────────────

async function handlePage(kv) {
  const data = await ensureData(kv);
  const html = generateHTML(data);
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}

// ── HTML Template ───────────────────────────────────────────────────────

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>USS Kittyprise — Social Credit System</title>
<script id="score-data" type="application/json">
${JSON.stringify(data)}
<\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a12;
    --panel: rgba(10, 15, 30, 0.85);
    --border: rgba(0, 200, 255, 0.25);
    --glow: rgba(0, 200, 255, 0.6);
    --cyan: #00c8ff;
    --magenta: #ff00aa;
    --gold: #ffd700;
    --green: #00ff88;
    --red: #ff3355;
    --text: #c8d8e8;
    --dim: #4a5a6a;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  #starfield {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  body::after {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 200, 255, 0.015) 2px,
      rgba(0, 200, 255, 0.015) 4px
    );
    pointer-events: none;
    z-index: 1000;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    text-align: center;
    padding: 40px 20px 30px;
    position: relative;
  }

  .header::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  }

  .ship-name {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(1.4rem, 4vw, 2.2rem);
    font-weight: 900;
    letter-spacing: 6px;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--cyan), var(--magenta), var(--cyan));
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 4s ease infinite;
    text-shadow: 0 0 40px rgba(0, 200, 255, 0.3);
    margin-bottom: 8px;
  }

  .subtitle {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(0.55rem, 1.8vw, 0.85rem);
    letter-spacing: 8px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 16px;
  }

  .system-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    color: var(--green);
    letter-spacing: 2px;
  }

  .status-dot {
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 2s ease infinite;
    box-shadow: 0 0 8px var(--green);
  }

  .chart-section {
    margin: 30px 0;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  .chart-section::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px; right: -1px; bottom: -1px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), transparent, var(--magenta));
    opacity: 0.15;
    z-index: -1;
  }

  .section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border), transparent);
  }

  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 180px 1fr 50px;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateX(-20px);
    animation: slideIn 0.6s ease forwards;
  }

  .crew-info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .crew-emoji { font-size: 1.3rem; flex-shrink: 0; }

  .crew-details { min-width: 0; }

  .crew-name {
    font-size: 0.85rem;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .crew-rank {
    font-size: 0.6rem;
    color: var(--dim);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .bar-track {
    height: 28px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    position: relative;
    width: 0;
    animation: fillBar 1.5s ease forwards;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .bar-fill::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 2px; height: 100%;
    background: #fff;
    opacity: 0.8;
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }

  .bar-fill::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 3s ease infinite;
  }

  .bar-score {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    text-align: right;
    min-width: 50px;
  }

  .score-high { color: var(--gold); }
  .score-good { color: var(--green); }
  .score-neutral { color: var(--cyan); }
  .score-low { color: var(--red); }

  .bar-high {
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.6));
    color: var(--gold);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  .bar-good {
    background: linear-gradient(90deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.5));
    color: var(--green);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
  }
  .bar-neutral {
    background: linear-gradient(90deg, rgba(0, 200, 255, 0.2), rgba(0, 200, 255, 0.5));
    color: var(--cyan);
    box-shadow: 0 0 15px rgba(0, 200, 255, 0.2);
  }
  .bar-low {
    background: linear-gradient(90deg, rgba(255, 51, 85, 0.2), rgba(255, 51, 85, 0.5));
    color: var(--red);
    box-shadow: 0 0 15px rgba(255, 51, 85, 0.2);
  }

  .changelog {
    margin: 30px 0;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel);
    backdrop-filter: blur(10px);
  }

  .log-entry {
    display: grid;
    grid-template-columns: 90px 100px 50px 1fr;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.8rem;
    align-items: center;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
  }

  .log-entry:last-child { border-bottom: none; }

  .log-date { color: var(--dim); font-size: 0.7rem; }
  .log-who { color: #fff; font-weight: bold; }

  .log-change {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    text-align: center;
  }

  .log-change.positive { color: var(--green); }
  .log-change.negative { color: var(--red); }

  .log-reason { color: var(--dim); font-style: italic; }

  .footer {
    text-align: center;
    padding: 30px 20px 40px;
    color: var(--dim);
    font-size: 0.6rem;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .footer a {
    color: var(--cyan);
    text-decoration: none;
    opacity: 0.5;
    transition: opacity 0.3s;
  }

  .footer a:hover { opacity: 1; }

  .last-updated {
    text-align: center;
    font-size: 0.65rem;
    color: var(--dim);
    margin-top: 6px;
    letter-spacing: 1px;
  }

  .top-crew {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin: 30px 0;
    flex-wrap: wrap;
  }

  .top-card {
    text-align: center;
    padding: 20px 28px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
    min-width: 160px;
    opacity: 0;
    animation: scaleIn 0.8s ease forwards;
  }

  .top-card.gold {
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.1), inset 0 0 30px rgba(255, 215, 0, 0.03);
  }

  .top-card.danger {
    border-color: rgba(255, 51, 85, 0.4);
    box-shadow: 0 0 30px rgba(255, 51, 85, 0.1), inset 0 0 30px rgba(255, 51, 85, 0.03);
  }

  .top-card .card-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.55rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 10px;
  }

  .top-card .card-emoji {
    font-size: 2.5rem;
    margin-bottom: 8px;
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
  }

  .top-card .card-name { font-size: 0.9rem; color: #fff; margin-bottom: 4px; }

  .top-card .card-score {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
  }

  .top-card.gold .card-score { color: var(--gold); text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  .top-card.danger .card-score { color: var(--red); text-shadow: 0 0 20px rgba(255, 51, 85, 0.5); }

  .radar-container {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 800px; height: 800px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.04;
  }

  .radar-ring {
    position: absolute;
    border: 1px solid var(--cyan);
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }

  .radar-ring:nth-child(1) { width: 200px; height: 200px; }
  .radar-ring:nth-child(2) { width: 400px; height: 400px; }
  .radar-ring:nth-child(3) { width: 600px; height: 600px; }
  .radar-ring:nth-child(4) { width: 800px; height: 800px; }

  .radar-sweep {
    position: absolute;
    top: 50%; left: 50%;
    width: 400px; height: 2px;
    background: linear-gradient(90deg, var(--cyan), transparent);
    transform-origin: left center;
    animation: radarSweep 8s linear infinite;
    opacity: 0.5;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }

  @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
  @keyframes fillBar { to { width: var(--fill-width); } }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  @keyframes fadeIn { to { opacity: 1; } }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 700px) {
    .bar-row {
      grid-template-columns: 120px 1fr 45px;
      gap: 8px;
    }
    .crew-name { font-size: 0.75rem; }
    .log-entry {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .log-entry .log-date { display: inline; }
    .top-crew { gap: 16px; }
    .top-card { min-width: 130px; padding: 16px 20px; }
  }
</style>
</head>
<body>

<canvas id="starfield"></canvas>

<div class="radar-container">
  <div class="radar-ring"></div>
  <div class="radar-ring"></div>
  <div class="radar-ring"></div>
  <div class="radar-ring"></div>
  <div class="radar-sweep"></div>
</div>

<div class="container">
  <header class="header">
    <div class="ship-name">USS Kittyprise</div>
    <div class="subtitle">Social Credit System v2.0</div>
    <div class="system-status">
      <span class="status-dot"></span>
      <span>System Online — All Crew Monitored</span>
    </div>
  </header>

  <div class="top-crew" id="top-crew"></div>

  <section class="chart-section">
    <div class="section-title">Crew Credit Standings</div>
    <div class="bar-chart" id="bar-chart"></div>
  </section>

  <section class="changelog">
    <div class="section-title">Activity Log</div>
    <div id="changelog"></div>
  </section>

  <div class="last-updated" id="last-updated"></div>

  <footer class="footer">
    <a href="https://chaoscat.win" target="_blank">chaoscat.win</a> — meow
  </footer>
</div>

<script>
  const data = JSON.parse(document.getElementById('score-data').textContent);
  const scores = [...data.scores].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...scores.map(s => s.score));
  const minScore = Math.min(...scores.map(s => s.score));

  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.05,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.brightness += star.twinkleSpeed;
      if (star.brightness > 1 || star.brightness < 0.2) star.twinkleSpeed *= -1;
      star.y += star.speed;
      if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(200, 220, 255, \${star.brightness * 0.7})\`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  initStars();
  drawStars();
  window.addEventListener('resize', initStars);

  function getClass(score) {
    if (score >= 110) return 'high';
    if (score > 100) return 'good';
    if (score === 100) return 'neutral';
    return 'low';
  }

  // Top/Bottom cards
  const topCrew = document.getElementById('top-crew');
  const highest = scores[0];
  const lowest = scores[scores.length - 1];

  function makeCard(member, label, style, delay) {
    const card = document.createElement('div');
    card.className = \`top-card \${style}\`;
    card.style.animationDelay = \`\${delay}s\`;
    card.innerHTML = \`
      <div class="card-label">\${label}</div>
      <div class="card-emoji">\${member.emoji}</div>
      <div class="card-name">\${member.name}</div>
      <div class="card-score">\${member.score}</div>
    \`;
    return card;
  }

  topCrew.appendChild(makeCard(highest, '★ Highest Credit', 'gold', 0.2));
  if (lowest.score < highest.score) {
    topCrew.appendChild(makeCard(lowest, '⚠ Lowest Credit', 'danger', 0.4));
  }

  // Bar chart
  const barChart = document.getElementById('bar-chart');
  const scaleMax = maxScore + 10;

  scores.forEach((member, i) => {
    const pct = ((member.score / scaleMax) * 100).toFixed(1);
    const cls = getClass(member.score);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.style.animationDelay = \`\${i * 0.08 + 0.3}s\`;
    row.innerHTML = \`
      <div class="crew-info">
        <span class="crew-emoji">\${member.emoji}</span>
        <div class="crew-details">
          <div class="crew-name">\${member.name}</div>
          <div class="crew-rank">\${member.rank}</div>
        </div>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-\${cls}" style="--fill-width: \${pct}%; animation-delay: \${i * 0.1 + 0.5}s"></div>
      </div>
      <div class="bar-score score-\${cls}">\${member.score}</div>
    \`;
    barChart.appendChild(row);
  });

  // Changelog
  const changelogEl = document.getElementById('changelog');
  data.changelog.forEach((entry, i) => {
    const isPositive = entry.change.startsWith('+');
    const row = document.createElement('div');
    row.className = 'log-entry';
    row.style.animationDelay = \`\${i * 0.1 + 0.8}s\`;
    row.innerHTML = \`
      <span class="log-date">\${entry.date}</span>
      <span class="log-who">\${entry.who}</span>
      <span class="log-change \${isPositive ? 'positive' : 'negative'}">\${entry.change}</span>
      <span class="log-reason">\${entry.reason}</span>
    \`;
    changelogEl.appendChild(row);
  });

  // Last updated
  const updated = new Date(data.lastUpdated);
  document.getElementById('last-updated').textContent =
    'Last updated: ' + updated.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) +
    ' at ' + updated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
<\/script>
</body>
</html>`;
}

// ── Main Handler ────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // API routes
    if (url.pathname === "/api/scores") {
      if (request.method === "GET") {
        return handleGetScores(env.SCORES_KV);
      }
      if (request.method === "POST") {
        return handlePostScores(request, env.SCORES_KV, env);
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Serve the page for everything else
    if (request.method === "GET") {
      return handlePage(env.SCORES_KV);
    }

    return new Response("Not Found", { status: 404 });
  },
};
