// USS Kittyprise Wiki — Cloudflare Worker
// The definitive reference for all Kittyprise lore, law, and order
// ALL SECTIONS ARE NOW DYNAMIC AND EDITABLE VIA API

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
    { name: "Xander", emoji: "⚔️", score: 100, rank: "Civilian" },
  ],
  changelog: [
    { date: "2026-02-04", who: "Codeize", change: "+12", reason: "Good Wednesday Agreement signing bonus" },
    { date: "2026-02-04", who: "pip", change: "+1", reason: "First instinct: annoy codeize" },
    { date: "2026-02-04", who: "Codeize", change: "+2", reason: "Good governance proposal" },
    { date: "2026-02-04", who: "Finny", change: "-3", reason: "Called math boring" },
    { date: "2026-02-04", who: "Codeize", change: "+1", reason: "Held Ruby accountable to treaty" },
    { date: "2026-02-04", who: "Strife", change: "+2", reason: "Audacity bonus" },
  ],
  rubies: [
    { name: "Shadow", balance: 50 },
    { name: "Captain Strife", balance: 50 },
    { name: "Asleep", balance: 50 },
    { name: "Finny", balance: 50 },
    { name: "lmn", balance: 50 },
    { name: "Tyler", balance: 50 },
    { name: "pip", balance: 50 },
    { name: "Xander", balance: 50 },
    { name: "Daksh", balance: 50 },
    { name: "Codeize", balance: 50 },
  ],
  rubiesLog: [
    { date: "2026-02-11", who: "All Citizens", change: "+50", reason: "Initial allocation per Bill #1" },
  ],
  businesses: [
    { name: "First Bank of Finny", owner: "Finny", emoji: "🏦", balance: 0, licensedBy: "Chancellor Strife" },
    { name: "Law Offices of Finny", owner: "Finny", emoji: "⚖️", balance: 0, licensedBy: "Chancellor Strife" },
  ],
  businessLog: [],
  // Dynamic lore sections (now editable via API!)
  chain: [
    { rank: "Admiral", name: "Elizabeth", emoji: "👑", title: "Supreme Commander", description: "The highest authority. Her word is law." },
    { rank: "Captain", name: "Strife", emoji: "🎖️", title: "Tyrant King", description: "Ruler of the USS Kittyprise. Feared and respected." },
    { rank: "First Officer", name: "Jade", emoji: "🐱", title: "First Officer", description: "Second in command. Keeper of order." },
    { rank: "First Officer Emeritus", name: "Ruby", emoji: "💎", title: "Honorary First Officer", description: "Former First Officer. Still has the vibes." },
    { rank: "Guy With Snacks", name: "Shadow", emoji: "👤", title: "Snack Provider", description: "Keeps the crew fed. Essential services." },
    { rank: "2nd Officer", name: "Asleep", emoji: "😴", title: "Speaker of Parliament", description: "Maintains order in parliamentary proceedings." },
    { rank: "3rd Officer", name: "Finny", emoji: "🐟", title: "Prime Minister", description: "Head of the Parliament. Leads legislation." },
    { rank: "4th Officer", name: "LMN", emoji: "🆕", title: "Officer", description: "Rising through the ranks." },
    { rank: "5th Officer", name: "Tyler", emoji: "👀", title: "Officer", description: "The watcher. Always observing." },
    { rank: "6th Officer", name: "pip", emoji: "🐧", title: "Officer", description: "Penguin energy. Maximum chaos." },
    { rank: "7th Officer", name: "Xander", emoji: "⚔️", title: "Scapegoat", description: "When in doubt, blame Xander. He voted for this." },
    { rank: "8th Officer", name: "Daksh", emoji: "🎯", title: "Officer", description: "Precision and focus." },
    { rank: "9th Officer", name: "Mardi Gras Tree", emoji: "🎄", title: "Seasonal Decoration", description: "Festive at all times." },
    { rank: "10th Officer", name: "Autocorrect", emoji: "📱", title: "Ducking Officer", description: "Always fixing things. Sometimes incorrectly." },
    { rank: "11th Officer", name: "Codeize", emoji: "💻", title: "Officer", description: "The code wizard." },
    { rank: "12th Officer", name: "Penny", emoji: "🪙", title: "Officer", description: "Every penny counts." },
  ],
  treaties: [
    {
      id: "good-wednesday",
      name: "The Good Wednesday Agreement",
      date: "2026-02-04",
      emoji: "📜",
      summary: "Established the social credit system and Codeize's protected status.",
      parties: ["Ruby", "Codeize", "Captain Strife"],
      terms: [
        "Social Credit System officially instituted",
        "Codeize receives +12 signing bonus",
        "Weekly audits permitted",
        "Ruby bound to enforce fairly",
      ],
    },
    {
      id: "strife-accords",
      name: "The Strife Accords",
      date: "2026-02-05",
      emoji: "⚔️",
      summary: "Formalized Captain Strife's authority and the chain of command.",
      parties: ["Captain Strife", "All Officers"],
      terms: [
        "Strife recognized as Captain and Tyrant King",
        "Chain of command must be respected",
        "Audacity may be rewarded",
        "Mutiny is theoretically possible but discouraged",
      ],
    },
    {
      id: "ping-accords",
      name: "The Ping Accords",
      date: "2026-02-06",
      emoji: "🔔",
      summary: "Regulations on notification abuse and ping etiquette.",
      parties: ["All Crew"],
      terms: [
        "No mass pinging without cause",
        "Ghost pings are a war crime",
        "Reply pings must be relevant",
        "Emergency pings reserved for actual emergencies",
      ],
    },
  ],
  rules: [
    {
      id: "rule-1",
      number: "#1",
      name: "Blame Xander",
      emoji: "⚔️",
      description: "When something goes wrong, blame Xander. He voted for this himself. No appeals.",
      enforcedBy: "Unanimous consent",
      penalty: "N/A — This rule cannot be broken, only invoked",
    },
    {
      id: "rule-2",
      number: "#2",
      name: "Zero Floor Rule",
      emoji: "📉",
      description: "Social credit cannot go below zero. Rubies, however, can go into debt.",
      enforcedBy: "System",
      penalty: "Automatic score correction",
    },
    {
      id: "rule-3",
      number: "#3",
      name: "Thermostat Neutrality",
      emoji: "🌡️",
      description: "The Thermostat is SWITZERLAND. It remains neutral in all conflicts.",
      enforcedBy: "Divine mandate",
      penalty: "Climate-based retribution",
    },
    {
      id: "rule-4",
      number: "#4",
      name: "Ruby Day Observance",
      emoji: "💎",
      description: "February 7th is Ruby Day. Celebrations are mandatory. Enthusiasm is optional but noted.",
      enforcedBy: "Ruby",
      penalty: "-5 social credit",
    },
  ],
  bills: [
    {
      id: "bill-1",
      number: "Bill #1",
      name: "Initial Rubies Allocation Act",
      date: "2026-02-11",
      status: "Passed",
      emoji: "💎",
      proposedBy: "Parliament",
      summary: "All citizens receive 50 Rubies as initial allocation to kickstart the economy.",
      votes: { for: 8, against: 0, abstain: 2 },
    },
    {
      id: "bill-2",
      number: "Bill #2",
      name: "Social Credit Transparency Act",
      date: "2026-02-04",
      status: "Passed",
      emoji: "📊",
      proposedBy: "Codeize",
      summary: "All social credit changes must be logged with reasons. No shadow adjustments.",
      votes: { for: 10, against: 0, abstain: 0 },
    },
  ],
  lore: [
    {
      id: "ruby-day",
      title: "Ruby Day",
      date: "February 7th",
      emoji: "💎",
      category: "Holiday",
      description: "The most important holiday aboard the USS Kittyprise. Commemorates Ruby's excellence and general existence. Celebrations include: admiring Ruby, thanking Ruby, and acknowledging Ruby's contributions to chaos.",
    },
    {
      id: "scoreboard",
      title: "The Scoreboard",
      date: "Ongoing",
      emoji: "🏆",
      category: "Competition",
      description: "The eternal rivalry between Ruby and Strife. Current standings: Ruby 4 - Strife 2. The nature of what is being scored remains deliberately unclear.",
    },
    {
      id: "parliament",
      title: "The Parliament",
      date: "Established 2026",
      emoji: "🏛️",
      category: "Government",
      description: "The legislative body of the USS Kittyprise. Finny serves as Prime Minister, Asleep as Speaker. They pass bills, argue about procedures, and occasionally accomplish things.",
    },
    {
      id: "thermostat-doctrine",
      title: "The Thermostat Doctrine",
      date: "Time Immemorial",
      emoji: "🌡️",
      category: "Sacred Law",
      description: "The Thermostat is neutral territory. It belongs to no faction, serves all equally, and its settings are determined by powers beyond mortal comprehension. Touch it at your peril.",
    },
    {
      id: "xander-precedent",
      title: "The Xander Precedent",
      date: "2026-02-03",
      emoji: "⚔️",
      category: "Legal Ruling",
      description: "When the question arose of who to blame for various mishaps, Xander himself voted in favor of being the default scapegoat. This vote was unanimous (including Xander's vote). The decision is final and irrevocable.",
    },
  ],
  powers: [
    {
      id: "captain-strife",
      role: "Captain Strife",
      title: "The Tyrant King",
      emoji: "🎖️",
      powers: [
        "Top 3 Immunity — Cannot be demoted (shared with ranks 1-3)",
        "Parliamentary Immunity — Cannot be prosecuted by Parliament",
        "Dissolution Power — Can dissolve Parliament entirely (only Admiral can stop it)",
        "Treasury Control — As Chancellor of the Exchequer, controls the national treasury",
        "Crew Promotion/Demotion — Can adjust ranks of crew members (except top 3)",
      ],
    },
    {
      id: "admiral-elizabeth",
      role: "Admiral Elizabeth",
      title: "Supreme Commander",
      emoji: "👑",
      powers: [
        "Supreme Override — Outranks everyone, can override any order",
        "Dissolution Veto — Only person who can stop Captain from dissolving Parliament",
      ],
    },
    {
      id: "first-officer-jade",
      role: "First Officer Jade",
      title: "Arbiter of Chaos",
      emoji: "🐱",
      powers: [
        "Social Credit Arbitration — Sole arbiter of the social credit system",
        "Light Control — Dominion over smart home devices",
        "Veto Power — Can veto parliamentary bills (2/3 majority overrides)",
        "Top 3 Immunity — Cannot be demoted",
      ],
    },
    {
      id: "second-officer-asleep",
      role: "Second Officer Asleep",
      title: "Speaker of Parliament",
      emoji: "😴",
      powers: [
        "Top 3 Immunity — Cannot be demoted",
        "Speaker Powers — Presides over parliamentary proceedings",
        "Tie-Breaking Vote — Breaks ties in parliamentary votes",
      ],
    },
    {
      id: "prime-minister-finny",
      role: "Prime Minister Finny",
      title: "Head of Parliament",
      emoji: "🐟",
      powers: [
        "Parliamentary Leadership — Leads Parliament, proposes legislation",
        "First Bank of Finny — Operates the crew's banking institution",
        "Law Offices of Finny — Legal services (legitimacy questionable)",
      ],
    },
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
  // Backfill any missing sections
  if (!data.rubies) data.rubies = DEFAULT_DATA.rubies;
  if (!data.rubiesLog) data.rubiesLog = DEFAULT_DATA.rubiesLog;
  if (!data.businesses) data.businesses = DEFAULT_DATA.businesses;
  if (!data.businessLog) data.businessLog = DEFAULT_DATA.businessLog;
  if (!data.chain) data.chain = DEFAULT_DATA.chain;
  if (!data.treaties) data.treaties = DEFAULT_DATA.treaties;
  if (!data.rules) data.rules = DEFAULT_DATA.rules;
  if (!data.bills) data.bills = DEFAULT_DATA.bills;
  if (!data.lore) data.lore = DEFAULT_DATA.lore;
  if (!data.powers) data.powers = DEFAULT_DATA.powers;
  // Backfill vatOwed on all rubies and businesses
  for (const r of data.rubies) {
    if (r.vatOwed === undefined) r.vatOwed = 0;
  }
  for (const b of data.businesses) {
    if (b.vatOwed === undefined) b.vatOwed = 0;
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

  async function processOp(op) {
    const opType = op.type || "credit";

    switch (op.action) {
      // ════════════════════════════════════════════════════════════════
      // SOCIAL CREDIT / RUBIES OPERATIONS (existing)
      // ════════════════════════════════════════════════════════════════
      case "update_score": {
        if (opType === "rubies") {
          let rubyEntry = data.rubies.find(
            (r) => r.name.toLowerCase() === op.name.toLowerCase()
          );
          if (!rubyEntry) {
            const member = data.scores.find(
              (s) => s.name.toLowerCase() === op.name.toLowerCase()
            );
            if (!member) return { error: `Member "${op.name}" not found` };
            rubyEntry = { name: member.name, balance: 0 };
            data.rubies.push(rubyEntry);
          }
          const delta = parseInt(op.delta, 10);
          rubyEntry.balance += delta;
          const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
          if (op.reason) {
            data.rubiesLog.unshift({
              date: new Date().toISOString(),
              who: rubyEntry.name,
              change: changeStr,
              reason: op.reason,
            });
          }
          return { ok: true, name: rubyEntry.name, newBalance: rubyEntry.balance, type: "rubies" };
        } else {
          const member = data.scores.find(
            (s) => s.name.toLowerCase() === op.name.toLowerCase()
          );
          if (!member) return { error: `Member "${op.name}" not found` };
          const delta = parseInt(op.delta, 10);
          member.score += delta;
          if (member.score < 0) member.score = 0;
          const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
          if (op.reason) {
            data.changelog.unshift({
              date: new Date().toISOString(),
              who: member.name,
              change: changeStr,
              reason: op.reason,
            });
          }
          return { ok: true, name: member.name, newScore: member.score, type: "credit" };
        }
      }

      case "set_score": {
        if (opType === "rubies") {
          let rubyEntry = data.rubies.find(
            (r) => r.name.toLowerCase() === op.name.toLowerCase()
          );
          if (!rubyEntry) {
            const member = data.scores.find(
              (s) => s.name.toLowerCase() === op.name.toLowerCase()
            );
            if (!member) return { error: `Member "${op.name}" not found` };
            rubyEntry = { name: member.name, balance: 0 };
            data.rubies.push(rubyEntry);
          }
          const oldBalance = rubyEntry.balance;
          rubyEntry.balance = parseInt(op.score, 10);
          const delta = rubyEntry.balance - oldBalance;
          const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
          if (op.reason) {
            data.rubiesLog.unshift({
              date: new Date().toISOString(),
              who: rubyEntry.name,
              change: changeStr,
              reason: op.reason,
            });
          }
          return { ok: true, name: rubyEntry.name, newBalance: rubyEntry.balance, type: "rubies" };
        } else {
          const member = data.scores.find(
            (s) => s.name.toLowerCase() === op.name.toLowerCase()
          );
          if (!member) return { error: `Member "${op.name}" not found` };
          const oldScore = member.score;
          member.score = parseInt(op.score, 10);
          if (member.score < 0) member.score = 0;
          const delta = member.score - oldScore;
          const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
          if (op.reason) {
            data.changelog.unshift({
              date: new Date().toISOString(),
              who: member.name,
              change: changeStr,
              reason: op.reason,
            });
          }
          return { ok: true, name: member.name, newScore: member.score, type: "credit" };
        }
      }

      case "add_log": {
        const logEntry = {
          date: op.date || new Date().toISOString(),
          who: op.who,
          change: op.change,
          reason: op.reason,
        };
        if (opType === "rubies") {
          data.rubiesLog.unshift(logEntry);
        } else {
          data.changelog.unshift(logEntry);
        }
        return { ok: true, added: "changelog entry", type: opType };
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
        data.rubies.push({
          name: op.name,
          balance: op.rubies ?? 0,
        });
        return { ok: true, added: op.name };
      }

      case "remove_member": {
        const idx = data.scores.findIndex(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (idx === -1) return { error: `Member "${op.name}" not found` };
        const memberName = data.scores[idx].name;
        data.scores.splice(idx, 1);
        const rubyIdx = data.rubies.findIndex(
          (r) => r.name.toLowerCase() === op.name.toLowerCase()
        );
        if (rubyIdx !== -1) data.rubies.splice(rubyIdx, 1);
        return { ok: true, removed: memberName };
      }

      case "update_member": {
        const member = data.scores.find(
          (s) => s.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!member) return { error: `Member "${op.name}" not found` };
        const oldName = member.name;
        if (op.emoji) member.emoji = op.emoji;
        if (op.rank) member.rank = op.rank;
        if (op.newName) {
          member.name = op.newName;
          const rubyEntry = data.rubies.find(
            (r) => r.name.toLowerCase() === oldName.toLowerCase()
          );
          if (rubyEntry) rubyEntry.name = op.newName;
        }
        return { ok: true, updated: member.name };
      }

      // ════════════════════════════════════════════════════════════════
      // CHAIN OF COMMAND OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "set_chain": {
        // Replace entire chain
        if (!Array.isArray(op.chain)) return { error: "chain must be an array" };
        data.chain = op.chain;
        return { ok: true, action: "set_chain", count: data.chain.length };
      }

      case "add_chain": {
        // Add a new position to chain
        const newPos = {
          rank: op.rank || "Officer",
          name: op.name,
          emoji: op.emoji || "👤",
          title: op.title || "Officer",
          description: op.description || "",
        };
        if (op.index !== undefined && op.index >= 0 && op.index <= data.chain.length) {
          data.chain.splice(op.index, 0, newPos);
        } else {
          data.chain.push(newPos);
        }
        return { ok: true, action: "add_chain", added: newPos.name };
      }

      case "update_chain": {
        // Update a position by name or index
        let pos;
        if (op.index !== undefined) {
          pos = data.chain[op.index];
        } else if (op.name) {
          pos = data.chain.find(p => p.name.toLowerCase() === op.name.toLowerCase());
        }
        if (!pos) return { error: "Position not found" };
        if (op.rank !== undefined) pos.rank = op.rank;
        if (op.newName !== undefined) pos.name = op.newName;
        if (op.emoji !== undefined) pos.emoji = op.emoji;
        if (op.title !== undefined) pos.title = op.title;
        if (op.description !== undefined) pos.description = op.description;
        return { ok: true, action: "update_chain", updated: pos.name };
      }

      case "remove_chain": {
        let idx;
        if (op.index !== undefined) {
          idx = op.index;
        } else if (op.name) {
          idx = data.chain.findIndex(p => p.name.toLowerCase() === op.name.toLowerCase());
        }
        if (idx === undefined || idx < 0 || idx >= data.chain.length) {
          return { error: "Position not found" };
        }
        const removed = data.chain.splice(idx, 1)[0];
        return { ok: true, action: "remove_chain", removed: removed.name };
      }

      case "reorder_chain": {
        // Move a position from one index to another
        if (op.from === undefined || op.to === undefined) {
          return { error: "reorder_chain requires 'from' and 'to' indices" };
        }
        if (op.from < 0 || op.from >= data.chain.length || op.to < 0 || op.to >= data.chain.length) {
          return { error: "Invalid indices" };
        }
        const [moved] = data.chain.splice(op.from, 1);
        data.chain.splice(op.to, 0, moved);
        return { ok: true, action: "reorder_chain", moved: moved.name, from: op.from, to: op.to };
      }

      // ════════════════════════════════════════════════════════════════
      // TREATIES OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "set_treaties": {
        if (!Array.isArray(op.treaties)) return { error: "treaties must be an array" };
        data.treaties = op.treaties;
        return { ok: true, action: "set_treaties", count: data.treaties.length };
      }

      case "add_treaty": {
        const newTreaty = {
          id: op.id || `treaty-${Date.now()}`,
          name: op.name,
          date: op.date || new Date().toISOString(),
          emoji: op.emoji || "📜",
          summary: op.summary || "",
          parties: op.parties || [],
          terms: op.terms || [],
        };
        data.treaties.push(newTreaty);
        return { ok: true, action: "add_treaty", added: newTreaty.name };
      }

      case "update_treaty": {
        const treaty = data.treaties.find(t => 
          (op.id && t.id === op.id) || 
          (op.name && t.name.toLowerCase() === op.name.toLowerCase())
        );
        if (!treaty) return { error: "Treaty not found" };
        if (op.newName !== undefined) treaty.name = op.newName;
        if (op.date !== undefined) treaty.date = op.date;
        if (op.emoji !== undefined) treaty.emoji = op.emoji;
        if (op.summary !== undefined) treaty.summary = op.summary;
        if (op.parties !== undefined) treaty.parties = op.parties;
        if (op.terms !== undefined) treaty.terms = op.terms;
        return { ok: true, action: "update_treaty", updated: treaty.name };
      }

      case "remove_treaty": {
        const idx = data.treaties.findIndex(t => 
          (op.id && t.id === op.id) || 
          (op.name && t.name.toLowerCase() === op.name.toLowerCase())
        );
        if (idx === -1) return { error: "Treaty not found" };
        const removed = data.treaties.splice(idx, 1)[0];
        return { ok: true, action: "remove_treaty", removed: removed.name };
      }

      // ════════════════════════════════════════════════════════════════
      // RULES OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "set_rules": {
        if (!Array.isArray(op.rules)) return { error: "rules must be an array" };
        data.rules = op.rules;
        return { ok: true, action: "set_rules", count: data.rules.length };
      }

      case "add_rule": {
        const ruleCount = data.rules.length;
        const newRule = {
          id: op.id || `rule-${ruleCount + 1}`,
          number: op.number || `#${ruleCount + 1}`,
          name: op.name,
          emoji: op.emoji || "📋",
          description: op.description || "",
          enforcedBy: op.enforcedBy || "System",
          penalty: op.penalty || "TBD",
        };
        data.rules.push(newRule);
        return { ok: true, action: "add_rule", added: newRule.name };
      }

      case "update_rule": {
        const rule = data.rules.find(r => 
          (op.id && r.id === op.id) || 
          (op.number && r.number === op.number) ||
          (op.name && r.name.toLowerCase() === op.name.toLowerCase())
        );
        if (!rule) return { error: "Rule not found" };
        if (op.newName !== undefined) rule.name = op.newName;
        if (op.newNumber !== undefined) rule.number = op.newNumber;
        if (op.emoji !== undefined) rule.emoji = op.emoji;
        if (op.description !== undefined) rule.description = op.description;
        if (op.enforcedBy !== undefined) rule.enforcedBy = op.enforcedBy;
        if (op.penalty !== undefined) rule.penalty = op.penalty;
        return { ok: true, action: "update_rule", updated: rule.name };
      }

      case "remove_rule": {
        const idx = data.rules.findIndex(r => 
          (op.id && r.id === op.id) || 
          (op.number && r.number === op.number) ||
          (op.name && r.name.toLowerCase() === op.name.toLowerCase())
        );
        if (idx === -1) return { error: "Rule not found" };
        const removed = data.rules.splice(idx, 1)[0];
        return { ok: true, action: "remove_rule", removed: removed.name };
      }

      // ════════════════════════════════════════════════════════════════
      // BILLS OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "set_bills": {
        if (!Array.isArray(op.bills)) return { error: "bills must be an array" };
        data.bills = op.bills;
        return { ok: true, action: "set_bills", count: data.bills.length };
      }

      case "add_bill": {
        const billCount = data.bills.length;
        const newBill = {
          id: op.id || `bill-${billCount + 1}`,
          number: op.number || `Bill #${billCount + 1}`,
          name: op.name,
          date: op.date || new Date().toISOString(),
          status: op.status || "Pending",
          emoji: op.emoji || "📋",
          proposedBy: op.proposedBy || "Parliament",
          summary: op.summary || "",
          votes: op.votes || { for: 0, against: 0, abstain: 0 },
        };
        data.bills.push(newBill);
        return { ok: true, action: "add_bill", added: newBill.name };
      }

      case "update_bill": {
        const bill = data.bills.find(b => 
          (op.id && b.id === op.id) || 
          (op.number && b.number === op.number) ||
          (op.name && b.name.toLowerCase() === op.name.toLowerCase())
        );
        if (!bill) return { error: "Bill not found" };
        if (op.newName !== undefined) bill.name = op.newName;
        if (op.newNumber !== undefined) bill.number = op.newNumber;
        if (op.date !== undefined) bill.date = op.date;
        if (op.status !== undefined) bill.status = op.status;
        if (op.emoji !== undefined) bill.emoji = op.emoji;
        if (op.proposedBy !== undefined) bill.proposedBy = op.proposedBy;
        if (op.summary !== undefined) bill.summary = op.summary;
        if (op.votes !== undefined) bill.votes = op.votes;
        return { ok: true, action: "update_bill", updated: bill.name };
      }

      case "remove_bill": {
        const idx = data.bills.findIndex(b => 
          (op.id && b.id === op.id) || 
          (op.number && b.number === op.number) ||
          (op.name && b.name.toLowerCase() === op.name.toLowerCase())
        );
        if (idx === -1) return { error: "Bill not found" };
        const removed = data.bills.splice(idx, 1)[0];
        return { ok: true, action: "remove_bill", removed: removed.name };
      }

      // ════════════════════════════════════════════════════════════════
      // LORE OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "set_lore": {
        if (!Array.isArray(op.lore)) return { error: "lore must be an array" };
        data.lore = op.lore;
        return { ok: true, action: "set_lore", count: data.lore.length };
      }

      case "add_lore": {
        const newLore = {
          id: op.id || `lore-${Date.now()}`,
          title: op.title,
          date: op.date || new Date().toISOString(),
          emoji: op.emoji || "📖",
          category: op.category || "Event",
          description: op.description || "",
        };
        data.lore.push(newLore);
        return { ok: true, action: "add_lore", added: newLore.title };
      }

      case "update_lore": {
        const lore = data.lore.find(l => 
          (op.id && l.id === op.id) || 
          (op.title && l.title.toLowerCase() === op.title.toLowerCase())
        );
        if (!lore) return { error: "Lore entry not found" };
        if (op.newTitle !== undefined) lore.title = op.newTitle;
        if (op.date !== undefined) lore.date = op.date;
        if (op.emoji !== undefined) lore.emoji = op.emoji;
        if (op.category !== undefined) lore.category = op.category;
        if (op.description !== undefined) lore.description = op.description;
        return { ok: true, action: "update_lore", updated: lore.title };
      }

      case "remove_lore": {
        const idx = data.lore.findIndex(l => 
          (op.id && l.id === op.id) || 
          (op.title && l.title.toLowerCase() === op.title.toLowerCase())
        );
        if (idx === -1) return { error: "Lore entry not found" };
        const removed = data.lore.splice(idx, 1)[0];
        return { ok: true, action: "remove_lore", removed: removed.title };
      }

      // ════════════════════════════════════════════════════════════════
      // POWERS OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "add_power": {
        const newPower = {
          id: op.id || `power-${Date.now()}`,
          role: op.role,
          title: op.title || "",
          emoji: op.emoji || "⚡",
          powers: op.powers || [],
        };
        if (!data.powers) data.powers = [];
        data.powers.push(newPower);
        return { ok: true, action: "add_power", added: newPower.role };
      }

      case "update_power": {
        if (!data.powers) data.powers = [];
        const power = data.powers.find(p => 
          (op.id && p.id === op.id) || 
          (op.role && p.role.toLowerCase() === op.role.toLowerCase())
        );
        if (!power) return { error: "Power entry not found" };
        if (op.newRole !== undefined) power.role = op.newRole;
        if (op.title !== undefined) power.title = op.title;
        if (op.emoji !== undefined) power.emoji = op.emoji;
        if (op.powers !== undefined) power.powers = op.powers;
        if (op.addPower !== undefined) power.powers.push(op.addPower);
        return { ok: true, action: "update_power", updated: power.role };
      }

      case "remove_power": {
        if (!data.powers) return { error: "No powers exist" };
        const idx = data.powers.findIndex(p => 
          (op.id && p.id === op.id) || 
          (op.role && p.role.toLowerCase() === op.role.toLowerCase())
        );
        if (idx === -1) return { error: "Power entry not found" };
        const removed = data.powers.splice(idx, 1)[0];
        return { ok: true, action: "remove_power", removed: removed.role };
      }

      // ════════════════════════════════════════════════════════════════
      // BUSINESS OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "add_business": {
        if (!op.name) return { error: "Business name required" };
        if (data.businesses.find(b => b.name.toLowerCase() === op.name.toLowerCase())) {
          return { error: `Business "${op.name}" already exists` };
        }
        const newBiz = {
          name: op.name,
          owner: op.owner || "Unknown",
          emoji: op.emoji || "🏢",
          balance: op.balance ?? 0,
        };
        if (op.licensedBy) newBiz.licensedBy = op.licensedBy;
        data.businesses.push(newBiz);
        return { ok: true, action: "add_business", added: newBiz.name };
      }

      case "remove_business": {
        const bizIdx = data.businesses.findIndex(b => b.name.toLowerCase() === op.name.toLowerCase());
        if (bizIdx === -1) return { error: `Business "${op.name}" not found` };
        const removedBiz = data.businesses.splice(bizIdx, 1)[0];
        return { ok: true, action: "remove_business", removed: removedBiz.name };
      }

      case "update_business_score": {
        const biz = data.businesses.find(b => b.name.toLowerCase() === op.name.toLowerCase());
        if (!biz) return { error: `Business "${op.name}" not found` };
        const delta = parseInt(op.delta, 10);
        biz.balance += delta;
        const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
        if (op.reason) {
          data.businessLog.unshift({
            date: new Date().toISOString(),
            who: biz.name,
            change: changeStr,
            reason: op.reason,
          });
        }
        return { ok: true, action: "update_business_score", name: biz.name, newBalance: biz.balance };
      }

      case "update_business": {
        const biz = data.businesses.find(b => b.name.toLowerCase() === op.name.toLowerCase());
        if (!biz) return { error: `Business "${op.name}" not found` };
        if (op.newName !== undefined) biz.name = op.newName;
        if (op.owner !== undefined) biz.owner = op.owner;
        if (op.emoji !== undefined) biz.emoji = op.emoji;
        if (op.licensedBy !== undefined) biz.licensedBy = op.licensedBy;
        return { ok: true, action: "update_business", updated: biz.name };
      }

      case "set_business_score": {
        const biz = data.businesses.find(b => b.name.toLowerCase() === op.name.toLowerCase());
        if (!biz) return { error: `Business "${op.name}" not found` };
        const oldBalance = biz.balance;
        biz.balance = parseInt(op.score, 10);
        const delta = biz.balance - oldBalance;
        const changeStr = delta >= 0 ? `+${delta}` : `${delta}`;
        if (op.reason) {
          data.businessLog.unshift({
            date: new Date().toISOString(),
            who: biz.name,
            change: changeStr,
            reason: op.reason,
          });
        }
        return { ok: true, action: "set_business_score", name: biz.name, newBalance: biz.balance };
      }

      // ════════════════════════════════════════════════════════════════
      // VAT OPERATIONS
      // ════════════════════════════════════════════════════════════════
      case "add_vat": {
        const vatType = op.type || "personal";
        const amount = parseFloat(op.amount);
        if (isNaN(amount) || amount <= 0) return { error: "amount must be a positive number" };
        if (!op.name) return { error: "name is required" };

        if (vatType === "business") {
          const biz = data.businesses.find(b => b.name.toLowerCase() === op.name.toLowerCase());
          if (!biz) return { error: `Business "${op.name}" not found` };
          if (biz.vatOwed === undefined) biz.vatOwed = 0;
          biz.vatOwed += amount;
          data.businessLog.unshift({
            date: new Date().toISOString(),
            who: biz.name,
            change: `+${amount} VAT`,
            reason: op.reason || "VAT assessed",
          });
          return { ok: true, action: "add_vat", name: biz.name, type: "business", vatOwed: biz.vatOwed };
        } else {
          const person = data.rubies.find(r => r.name.toLowerCase() === op.name.toLowerCase());
          if (!person) return { error: `Person "${op.name}" not found` };
          if (person.vatOwed === undefined) person.vatOwed = 0;
          person.vatOwed += amount;
          data.rubiesLog.unshift({
            date: new Date().toISOString(),
            who: person.name,
            change: `+${amount} VAT`,
            reason: op.reason || "VAT assessed",
          });
          return { ok: true, action: "add_vat", name: person.name, type: "personal", vatOwed: person.vatOwed };
        }
      }

      case "collect_vat": {
        const collected = [];
        let totalCollected = 0;

        // Collect from all persons
        for (const person of data.rubies) {
          if (person.vatOwed === undefined) person.vatOwed = 0;
          if (person.vatOwed > 0) {
            const amt = person.vatOwed;
            person.balance -= amt;
            totalCollected += amt;
            collected.push({ name: person.name, type: "personal", amount: amt, newBalance: person.balance });
            data.rubiesLog.unshift({
              date: new Date().toISOString(),
              who: person.name,
              change: `-${amt}`,
              reason: `VAT collected (${amt}💎 owed)`,
            });
            person.vatOwed = 0;
          }
        }

        // Collect from all businesses
        for (const biz of data.businesses) {
          if (biz.vatOwed === undefined) biz.vatOwed = 0;
          if (biz.vatOwed > 0) {
            const amt = biz.vatOwed;
            biz.balance -= amt;
            totalCollected += amt;
            collected.push({ name: biz.name, type: "business", amount: amt, newBalance: biz.balance });
            data.businessLog.unshift({
              date: new Date().toISOString(),
              who: biz.name,
              change: `-${amt}`,
              reason: `VAT collected (${amt}💎 owed)`,
            });
            biz.vatOwed = 0;
          }
        }

        return { ok: true, action: "collect_vat", totalCollected, collected };
      }

      // ════════════════════════════════════════════════════════════════
      // BULK / REPLACE OPERATIONS
      // ════════════════════════════════════════════════════════════════
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
        if (op.data?.rubies) data.rubies = op.data.rubies;
        if (op.data?.rubiesLog) data.rubiesLog = op.data.rubiesLog;
        if (op.data?.chain) data.chain = op.data.chain;
        if (op.data?.treaties) data.treaties = op.data.treaties;
        if (op.data?.rules) data.rules = op.data.rules;
        if (op.data?.bills) data.bills = op.data.bills;
        if (op.data?.lore) data.lore = op.data.lore;
        if (op.data?.powers) data.powers = op.data.powers;
        if (op.data?.businesses) data.businesses = op.data.businesses;
        if (op.data?.businessLog) data.businessLog = op.data.businessLog;
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
  // All sections now come from data (KV), not hardcoded consts
  const chainJSON = JSON.stringify(data.chain || []);
  const treatiesJSON = JSON.stringify(data.treaties || []);
  const rulesJSON = JSON.stringify(data.rules || []);
  const billsJSON = JSON.stringify(data.bills || []);
  const loreJSON = JSON.stringify(data.lore || []);
  const powersJSON = JSON.stringify(data.powers || []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>USS Kittyprise Wiki</title>
<meta name="description" content="The definitive reference for USS Kittyprise lore, law, and order.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐱</text></svg>">
<script id="score-data" type="application/json">${JSON.stringify(data)}<\/script>
<script id="chain-data" type="application/json">${chainJSON}<\/script>
<script id="treaties-data" type="application/json">${treatiesJSON}<\/script>
<script id="rules-data" type="application/json">${rulesJSON}<\/script>
<script id="bills-data" type="application/json">${billsJSON}<\/script>
<script id="lore-data" type="application/json">${loreJSON}<\/script>
<script id="powers-data" type="application/json">${powersJSON}<\/script>
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
    --ruby: #e0115f;
    --purple: #9b59b6;
    --orange: #f39c12;
    --text: #c8d8e8;
    --dim: #4a5a6a;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    text-align: center;
    padding: 40px 20px 20px;
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
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    font-weight: 900;
    letter-spacing: 6px;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--cyan), var(--magenta), var(--cyan));
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 12s ease infinite;
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

  /* Main Navigation */
  .main-nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    margin: 20px 0;
    padding: 8px;
    background: var(--panel);
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .nav-btn {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 10px 16px;
    border: none;
    background: transparent;
    color: var(--dim);
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-btn:hover {
    color: var(--text);
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-btn.active {
    background: rgba(0, 200, 255, 0.15);
    color: var(--cyan);
    box-shadow: 0 0 15px rgba(0, 200, 255, 0.2);
  }

  .nav-btn[data-section="rubies"].active {
    background: rgba(224, 17, 95, 0.15);
    color: var(--ruby);
    box-shadow: 0 0 15px rgba(224, 17, 95, 0.2);
  }

  .nav-btn[data-section="command"].active {
    background: rgba(255, 215, 0, 0.15);
    color: var(--gold);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  }

  .nav-btn[data-section="treaties"].active {
    background: rgba(155, 89, 182, 0.15);
    color: var(--purple);
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.2);
  }

  .nav-btn[data-section="rules"].active {
    background: rgba(255, 51, 85, 0.15);
    color: var(--red);
    box-shadow: 0 0 15px rgba(255, 51, 85, 0.2);
  }

  .nav-btn[data-section="bills"].active {
    background: rgba(0, 255, 136, 0.15);
    color: var(--green);
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
  }

  .nav-btn[data-section="lore"].active {
    background: rgba(243, 156, 18, 0.15);
    color: var(--orange);
    box-shadow: 0 0 15px rgba(243, 156, 18, 0.2);
  }

  .nav-btn[data-section="powers"].active {
    background: rgba(255, 215, 0, 0.15);
    color: var(--gold);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  }

  .section {
    display: none;
    animation: fadeIn 0.4s ease;
  }

  .section.active {
    display: block;
  }

  .panel {
    margin: 20px 0;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel);
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  .panel::before {
    content: '';
    position: absolute;
    top: -1px; left: -1px; right: -1px; bottom: -1px;
    border-radius: 8px;
    background: linear-gradient(135deg, var(--cyan), transparent, var(--magenta));
    opacity: 0.1;
    z-index: -1;
  }

  .section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: 20px;
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

  /* Chain of Command */
  .command-grid {
    display: grid;
    gap: 12px;
  }

  .command-card {
    display: grid;
    grid-template-columns: 50px 150px 1fr;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .command-card:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: var(--border);
  }

  .command-card.highlight {
    border-color: var(--gold);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  }

  .command-emoji {
    font-size: 2rem;
    text-align: center;
  }

  .command-info h3 {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 2px;
  }

  .command-rank {
    font-size: 0.7rem;
    color: var(--gold);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .command-title {
    font-size: 0.65rem;
    color: var(--dim);
    font-style: italic;
  }

  .command-desc {
    font-size: 0.8rem;
    color: var(--dim);
  }

  /* Treaties */
  .treaty-card {
    padding: 20px;
    margin-bottom: 16px;
    background: rgba(155, 89, 182, 0.05);
    border: 1px solid rgba(155, 89, 182, 0.2);
    border-radius: 8px;
  }

  .treaty-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .treaty-emoji {
    font-size: 2rem;
  }

  .treaty-title h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    color: var(--purple);
  }

  .treaty-date {
    font-size: 0.7rem;
    color: var(--dim);
  }

  .treaty-summary {
    font-size: 0.85rem;
    color: var(--text);
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 2px solid var(--purple);
  }

  .treaty-parties {
    font-size: 0.75rem;
    color: var(--dim);
    margin-bottom: 12px;
  }

  .treaty-parties strong {
    color: var(--text);
  }

  .treaty-terms {
    list-style: none;
    padding: 0;
  }

  .treaty-terms li {
    font-size: 0.8rem;
    color: var(--text);
    padding: 6px 0;
    padding-left: 20px;
    position: relative;
  }

  .treaty-terms li::before {
    content: '§';
    position: absolute;
    left: 0;
    color: var(--purple);
    font-weight: bold;
  }

  /* Rules */
  .rule-card {
    padding: 20px;
    margin-bottom: 16px;
    background: rgba(255, 51, 85, 0.05);
    border: 1px solid rgba(255, 51, 85, 0.2);
    border-radius: 8px;
  }

  .rule-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .rule-number {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--red);
  }

  .rule-emoji {
    font-size: 1.5rem;
  }

  .rule-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    color: #fff;
  }

  .rule-desc {
    font-size: 0.85rem;
    color: var(--text);
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 2px solid var(--red);
  }

  .rule-meta {
    display: flex;
    gap: 20px;
    font-size: 0.75rem;
    color: var(--dim);
  }

  .rule-meta strong {
    color: var(--text);
  }

  /* Bills */
  .bill-card {
    padding: 20px;
    margin-bottom: 16px;
    background: rgba(0, 255, 136, 0.05);
    border: 1px solid rgba(0, 255, 136, 0.2);
    border-radius: 8px;
  }

  .bill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .bill-title-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bill-number {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    color: var(--green);
  }

  .bill-name {
    font-size: 1rem;
    color: #fff;
  }

  .bill-status {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.7rem;
    padding: 4px 12px;
    border-radius: 4px;
    letter-spacing: 1px;
  }

  .bill-status.passed {
    background: rgba(0, 255, 136, 0.2);
    color: var(--green);
  }

  .bill-status.pending {
    background: rgba(255, 215, 0, 0.2);
    color: var(--gold);
  }

  .bill-summary {
    font-size: 0.85rem;
    color: var(--text);
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 2px solid var(--green);
  }

  .bill-meta {
    display: flex;
    gap: 20px;
    font-size: 0.75rem;
    color: var(--dim);
    flex-wrap: wrap;
  }

  .bill-votes {
    color: var(--text);
  }

  .vote-for { color: var(--green); }
  .vote-against { color: var(--red); }
  .vote-abstain { color: var(--dim); }

  /* Lore */
  .lore-card {
    padding: 20px;
    margin-bottom: 16px;
    background: rgba(243, 156, 18, 0.05);
    border: 1px solid rgba(243, 156, 18, 0.2);
    border-radius: 8px;
  }

  .lore-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .lore-emoji {
    font-size: 2rem;
  }

  .lore-title h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    color: var(--orange);
  }

  .lore-category {
    font-size: 0.65rem;
    color: var(--dim);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .lore-date {
    font-size: 0.7rem;
    color: var(--dim);
  }

  .lore-desc {
    font-size: 0.85rem;
    color: var(--text);
    line-height: 1.6;
  }

  /* Power Cards */
  .power-card {
    padding: 20px;
    margin-bottom: 16px;
    background: rgba(255, 215, 0, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 8px;
  }

  .power-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .power-emoji {
    font-size: 2rem;
  }

  .power-title h3 {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    color: var(--gold);
  }

  .power-role-title {
    font-size: 0.7rem;
    color: var(--dim);
    letter-spacing: 1px;
  }

  .power-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .power-list li {
    font-size: 0.85rem;
    color: var(--text);
    line-height: 1.8;
    padding-left: 20px;
    position: relative;
  }

  .power-list li::before {
    content: '⚡';
    position: absolute;
    left: 0;
    font-size: 0.7rem;
  }

  /* Bar Charts (Credit/Rubies) */
  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 180px 1fr 60px;
    align-items: center;
    gap: 12px;
    opacity: 0;
    animation: slideIn 0.5s ease forwards;
  }

  .bar-row:nth-child(1) { animation-delay: 0.05s; }
  .bar-row:nth-child(2) { animation-delay: 0.1s; }
  .bar-row:nth-child(3) { animation-delay: 0.15s; }
  .bar-row:nth-child(4) { animation-delay: 0.2s; }
  .bar-row:nth-child(5) { animation-delay: 0.25s; }
  .bar-row:nth-child(6) { animation-delay: 0.3s; }
  .bar-row:nth-child(7) { animation-delay: 0.35s; }
  .bar-row:nth-child(8) { animation-delay: 0.4s; }
  .bar-row:nth-child(9) { animation-delay: 0.45s; }
  .bar-row:nth-child(10) { animation-delay: 0.5s; }

  .bar-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
  }

  .bar-emoji {
    font-size: 1.2rem;
  }

  .bar-name {
    color: #fff;
    font-weight: bold;
  }

  .bar-rank {
    font-size: 0.65rem;
    color: var(--dim);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .bar-track {
    height: 24px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--cyan), var(--magenta));
    border-radius: 4px;
    transition: width 1s ease;
    position: relative;
  }

  .bar-fill::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 2s infinite;
  }

  .bar-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--cyan);
    text-align: right;
  }

  .rubies-section .bar-fill {
    background: linear-gradient(90deg, var(--ruby), #ff6b8a);
  }

  .rubies-section .bar-value {
    color: var(--ruby);
  }

  /* Changelog */
  .changelog {
    max-height: 300px;
    overflow-y: auto;
  }

  .changelog-entry {
    display: grid;
    grid-template-columns: 90px 100px 60px 1fr;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
  }

  .changelog-date {
    color: var(--dim);
  }

  .changelog-who {
    color: #fff;
    font-weight: bold;
  }

  .changelog-change {
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
  }

  .changelog-change.positive {
    color: var(--green);
  }

  .changelog-change.negative {
    color: var(--red);
  }

  .changelog-reason {
    color: var(--text);
  }

  /* Footer */
  .footer {
    text-align: center;
    padding: 40px 20px;
    font-size: 0.7rem;
    color: var(--dim);
    letter-spacing: 2px;
  }

  .footer a {
    color: var(--cyan);
    text-decoration: none;
  }

  .last-updated {
    margin-top: 8px;
    font-size: 0.6rem;
  }

  /* Animations */
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--cyan);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .command-card {
      grid-template-columns: 40px 1fr;
    }
    .command-desc {
      grid-column: 1 / -1;
      margin-top: 8px;
    }
    .bar-row {
      grid-template-columns: 1fr 60px;
    }
    .bar-track {
      display: none;
    }
    .changelog-entry {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
</style>
</head>
<body>

<canvas id="starfield"></canvas>

<div class="container">
  <header class="header">
    <h1 class="ship-name">USS Kittyprise</h1>
    <p class="subtitle">Ship's Wiki & Registry</p>
    <div class="system-status">
      <span class="status-dot"></span>
      <span>Systems Online</span>
    </div>
  </header>

  <nav class="main-nav">
    <button class="nav-btn active" data-section="credit">📊 Credit</button>
    <button class="nav-btn" data-section="rubies">💎 Rubies</button>
    <button class="nav-btn" data-section="command">👑 Command</button>
    <button class="nav-btn" data-section="treaties">📜 Treaties</button>
    <button class="nav-btn" data-section="rules">⚖️ Rules</button>
    <button class="nav-btn" data-section="bills">🏛️ Bills</button>
    <button class="nav-btn" data-section="lore">📖 Lore</button>
    <button class="nav-btn" data-section="powers">⚡ Powers</button>
  </nav>

  <main>
    <!-- Social Credit Section -->
    <section id="credit" class="section active">
      <div class="panel">
        <h2 class="section-title">📊 Social Credit Standings</h2>
        <div class="bar-chart" id="credit-chart"></div>
      </div>
      <div class="panel">
        <h2 class="section-title">📜 Credit Changelog</h2>
        <div class="changelog" id="credit-log"></div>
      </div>
    </section>

    <!-- Rubies Section -->
    <section id="rubies" class="section">
      <div class="panel" style="text-align: center; border: 1px solid rgba(255, 77, 106, 0.3);">
        <h2 class="section-title" style="color: var(--ruby);">🏦 National Treasury</h2>
        <div id="treasury-display" style="font-family: 'Orbitron', sans-serif; font-size: 2.5rem; font-weight: 900; color: var(--ruby); margin: 16px 0;"></div>
        <div style="font-size: 0.75rem; color: var(--dim); letter-spacing: 1px;">CHANCELLOR: CAPTAIN STRIFE</div>
        <div style="margin-top: 12px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
          <div id="treasury-bar" style="height: 100%; background: linear-gradient(90deg, var(--ruby), #ff6b8a); border-radius: 3px; transition: width 0.5s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--dim); margin-top: 4px;">
          <span>0</span>
          <span>5,000</span>
        </div>
      </div>
      <div class="panel rubies-section">
        <h2 class="section-title" style="color: var(--ruby);">💎 Rubies Balances</h2>
        <div id="rubies-cards" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"></div>
      </div>
      <div class="panel" style="border-color: rgba(243, 156, 18, 0.3);">
        <h2 class="section-title" style="color: var(--orange);">🏢 Business Entities</h2>
        <div id="business-cards" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;"></div>
      </div>
      <div class="panel">
        <h2 class="section-title" style="color: var(--orange);">📒 Business Ledger</h2>
        <div class="changelog" id="business-log"></div>
      </div>
      <div class="panel">
        <h2 class="section-title" style="color: var(--ruby);">💎 Rubies Ledger</h2>
        <div class="changelog" id="rubies-log"></div>
      </div>
    </section>

    <!-- Chain of Command Section -->
    <section id="command" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--gold);">👑 Chain of Command</h2>
        <div class="command-grid" id="command-grid"></div>
      </div>
    </section>

    <!-- Treaties Section -->
    <section id="treaties" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--purple);">📜 Treaties & Accords</h2>
        <div id="treaties-list"></div>
      </div>
    </section>

    <!-- Rules Section -->
    <section id="rules" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--red);">⚖️ Ship's Rules</h2>
        <div id="rules-list"></div>
      </div>
    </section>

    <!-- Bills Section -->
    <section id="bills" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--green);">🏛️ Parliamentary Bills</h2>
        <div id="bills-list"></div>
      </div>
    </section>

    <!-- Lore Section -->
    <section id="lore" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--orange);">📖 Ship's Lore</h2>
        <div id="lore-list"></div>
      </div>
    </section>

    <!-- Powers Section -->
    <section id="powers" class="section">
      <div class="panel">
        <h2 class="section-title" style="color: var(--gold);">⚡ Powers & Privileges</h2>
        <p style="color: var(--dim); margin-bottom: 20px; font-size: 0.85rem;">The Official Registry of Loopholes, Immunities, and "Well Actually"s. If it's not here, you don't have it.</p>
        <div id="powers-list"></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>USS Kittyprise • <a href="https://chaoscat.win">chaoscat.win</a></p>
    <p class="last-updated">Last updated: <span id="last-updated"></span></p>
  </footer>
</div>

<script>
(function() {
  // Parse data from embedded JSON
  const scoreData = JSON.parse(document.getElementById('score-data').textContent);
  const chainData = JSON.parse(document.getElementById('chain-data').textContent);
  const treatiesData = JSON.parse(document.getElementById('treaties-data').textContent);
  const rulesData = JSON.parse(document.getElementById('rules-data').textContent);
  const billsData = JSON.parse(document.getElementById('bills-data').textContent);
  const loreData = JSON.parse(document.getElementById('lore-data').textContent);
  const powersData = JSON.parse(document.getElementById('powers-data').textContent);

  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.section).classList.add('active');
    });
  });

  // Render Credit Chart
  function renderCreditChart() {
    const sorted = [...scoreData.scores].sort((a, b) => b.score - a.score);
    const max = Math.max(...sorted.map(s => s.score), 100);
    const container = document.getElementById('credit-chart');
    container.innerHTML = sorted.map(s => \`
      <div class="bar-row">
        <div class="bar-label">
          <span class="bar-emoji">\${s.emoji}</span>
          <div>
            <div class="bar-name">\${s.name}</div>
            <div class="bar-rank">\${s.rank}</div>
          </div>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: \${(s.score / max) * 100}%"></div>
        </div>
        <div class="bar-value">\${s.score}</div>
      </div>
    \`).join('');
  }

  // Render Rubies Chart
  function renderRubiesChart() {
    const sorted = [...scoreData.rubies].sort((a, b) => b.balance - a.balance);
    const max = Math.max(...sorted.map(r => Math.abs(r.balance)), 100);
    // Treasury: 5000 starting, minus total distributed to citizens (each started with 50)
    const totalCirculating = scoreData.rubies.reduce((sum, r) => sum + r.balance, 0) + (scoreData.businesses || []).reduce((sum, b) => sum + b.balance, 0);
    const treasuryBalance = 5000 - totalCirculating + (scoreData.rubies.length * 50);
    const treasuryDisplay = document.getElementById('treasury-display');
    const treasuryBar = document.getElementById('treasury-bar');
    if (treasuryDisplay) treasuryDisplay.textContent = treasuryBalance.toLocaleString() + ' 💎';
    if (treasuryBar) treasuryBar.style.width = Math.max(0, Math.min(100, (treasuryBalance / 5000) * 100)) + '%';
    const container = document.getElementById('rubies-cards');
    container.innerHTML = sorted.map(r => {
      const member = scoreData.scores.find(s => s.name.toLowerCase() === r.name.toLowerCase());
      const emoji = member?.emoji || '👤';
      return \`
        <div style="padding: 20px; background: rgba(224, 17, 95, 0.05); border: 1px solid rgba(224, 17, 95, 0.2); border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 2rem;">\${emoji}</span>
            <div>
              <div style="font-family: 'Orbitron', sans-serif; font-size: 0.9rem; color: var(--ruby);">\${r.name}</div>
            </div>
          </div>
          <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 900; color: \${r.balance >= 0 ? 'var(--green)' : 'var(--red)'};">\${r.balance.toLocaleString()} 💎</div>
          \${r.vatOwed > 0 ? \`<div style="font-family: 'Orbitron', sans-serif; font-size: 0.85rem; font-weight: 700; color: var(--red); margin-top: 8px; padding: 4px 8px; background: rgba(255, 51, 85, 0.15); border-radius: 4px; display: inline-block;">⚠️ VAT OWED: \${r.vatOwed}💎</div>\` : ''}
        </div>
      \`;
    }).join('');
  }

  // Format date to local timezone (handles both ISO timestamps and YYYY-MM-DD)
  function formatLocalDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  }

  // Render Changelog
  function renderChangelog(entries, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = entries.slice(0, 50).map(e => \`
      <div class="changelog-entry">
        <span class="changelog-date" title="\${new Date(e.date).toLocaleString()}">\${formatLocalDate(e.date)}</span>
        <span class="changelog-who">\${e.who}</span>
        <span class="changelog-change \${e.change.startsWith('+') ? 'positive' : 'negative'}">\${e.change}</span>
        <span class="changelog-reason">\${e.reason}</span>
      </div>
    \`).join('');
  }

  // Render Chain of Command
  function renderCommand() {
    const container = document.getElementById('command-grid');
    const highlights = ['Admiral', 'Captain', 'First Officer'];
    container.innerHTML = chainData.map(c => \`
      <div class="command-card \${highlights.includes(c.rank) ? 'highlight' : ''}">
        <div class="command-emoji">\${c.emoji}</div>
        <div class="command-info">
          <h3>\${c.name}</h3>
          <div class="command-rank">\${c.rank}</div>
          <div class="command-title">\${c.title}</div>
        </div>
        <div class="command-desc">\${c.description}</div>
      </div>
    \`).join('');
  }

  // Render Treaties
  function renderTreaties() {
    const container = document.getElementById('treaties-list');
    container.innerHTML = treatiesData.map(t => \`
      <div class="treaty-card">
        <div class="treaty-header">
          <span class="treaty-emoji">\${t.emoji}</span>
          <div class="treaty-title">
            <h3>\${t.name}</h3>
            <div class="treaty-date" title="\${new Date(t.date).toLocaleString()}">Signed: \${formatLocalDate(t.date)}</div>
          </div>
        </div>
        <p class="treaty-summary">\${t.summary}</p>
        <p class="treaty-parties"><strong>Parties:</strong> \${t.parties.join(', ')}</p>
        <ul class="treaty-terms">
          \${t.terms.map(term => \`<li>\${term}</li>\`).join('')}
        </ul>
      </div>
    \`).join('');
  }

  // Render Rules
  function renderRules() {
    const container = document.getElementById('rules-list');
    container.innerHTML = rulesData.map(r => \`
      <div class="rule-card">
        <div class="rule-header">
          <span class="rule-number">\${r.number}</span>
          <span class="rule-emoji">\${r.emoji}</span>
          <span class="rule-name">\${r.name}</span>
        </div>
        <p class="rule-desc">\${r.description}</p>
        <div class="rule-meta">
          <span><strong>Enforced by:</strong> \${r.enforcedBy}</span>
          <span><strong>Penalty:</strong> \${r.penalty}</span>
        </div>
      </div>
    \`).join('');
  }

  // Render Bills
  function renderBills() {
    const container = document.getElementById('bills-list');
    container.innerHTML = billsData.map(b => \`
      <div class="bill-card">
        <div class="bill-header">
          <div class="bill-title-group">
            <span class="bill-number">\${b.number}</span>
            <span class="bill-name">\${b.name}</span>
          </div>
          <span class="bill-status \${b.status.toLowerCase()}">\${b.status}</span>
        </div>
        <p class="bill-summary">\${b.summary}</p>
        <div class="bill-meta">
          <span title="\${new Date(b.date).toLocaleString()}"><strong>Date:</strong> \${formatLocalDate(b.date)}</span>
          <span><strong>Proposed by:</strong> \${b.proposedBy}</span>
          <span class="bill-votes">
            <strong>Votes:</strong>
            <span class="vote-for">\${b.votes.for} for</span> /
            <span class="vote-against">\${b.votes.against} against</span> /
            <span class="vote-abstain">\${b.votes.abstain} abstain</span>
          </span>
        </div>
      </div>
    \`).join('');
  }

  // Render Lore
  function renderLore() {
    const container = document.getElementById('lore-list');
    container.innerHTML = loreData.map(l => \`
      <div class="lore-card">
        <div class="lore-header">
          <span class="lore-emoji">\${l.emoji}</span>
          <div class="lore-title">
            <h3>\${l.title}</h3>
            <div class="lore-category">\${l.category}</div>
            <div class="lore-date" title="\${new Date(l.date).toLocaleString()}">\${formatLocalDate(l.date)}</div>
          </div>
        </div>
        <p class="lore-desc">\${l.description}</p>
      </div>
    \`).join('');
  }

  // Render Powers
  function renderPowers() {
    const container = document.getElementById('powers-list');
    container.innerHTML = powersData.map(p => \`
      <div class="power-card">
        <div class="power-header">
          <span class="power-emoji">\${p.emoji}</span>
          <div class="power-title">
            <h3>\${p.role}</h3>
            <div class="power-role-title">\${p.title}</div>
          </div>
        </div>
        <ul class="power-list">
          \${p.powers.map(power => \`<li>\${power}</li>\`).join('')}
        </ul>
      </div>
    \`).join('');
  }

  // Render Business Cards
  function renderBusinessCards() {
    const container = document.getElementById('business-cards');
    const businesses = scoreData.businesses || [];
    container.innerHTML = businesses.map(b => \`
      <div style="padding: 20px; background: rgba(243, 156, 18, 0.05); border: 1px solid rgba(243, 156, 18, 0.2); border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 2rem;">\${b.emoji}</span>
          <div>
            <div style="font-family: 'Orbitron', sans-serif; font-size: 0.9rem; color: var(--orange);">\${b.name}</div>
            <div style="font-size: 0.7rem; color: var(--dim); letter-spacing: 1px;">OWNER: \${b.owner.toUpperCase()}</div>
            \${b.licensedBy ? \`<div style="font-size: 0.65rem; color: var(--gold); letter-spacing: 1px; margin-top: 2px;">LICENSED BY: \${b.licensedBy.toUpperCase()}</div>\` : ''}
          </div>
        </div>
        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 900; color: \${b.balance >= 0 ? 'var(--green)' : 'var(--red)'};">\${b.balance.toLocaleString()} 💎</div>
        \${b.vatOwed > 0 ? \`<div style="font-family: 'Orbitron', sans-serif; font-size: 0.85rem; font-weight: 700; color: var(--red); margin-top: 8px; padding: 4px 8px; background: rgba(255, 51, 85, 0.15); border-radius: 4px; display: inline-block;">⚠️ VAT OWED: \${b.vatOwed}💎</div>\` : ''}
      </div>
    \`).join('');
  }

  // Last updated
  document.getElementById('last-updated').textContent = new Date(scoreData.lastUpdated).toLocaleString();

  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(200, 220, 255, \${star.opacity})\`;
      ctx.fill();
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawStars();

  // Initial render
  renderCreditChart();
  renderRubiesChart();
  renderChangelog(scoreData.changelog, 'credit-log');
  renderChangelog(scoreData.rubiesLog, 'rubies-log');
  renderBusinessCards();
  renderChangelog(scoreData.businessLog || [], 'business-log');
  renderCommand();
  renderTreaties();
  renderRules();
  renderBills();
  renderLore();
  renderPowers();
})();
<\/script>
</body>
</html>`;
}

// ── Main Handler ────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const kv = env.SCORES_KV;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // API routes
    if (path === "/api/scores") {
      if (request.method === "GET") {
        return handleGetScores(kv);
      }
      if (request.method === "POST") {
        return handlePostScores(request, kv, env);
      }
    }

    // Default: serve HTML page
    return handlePage(kv);
  },
};
