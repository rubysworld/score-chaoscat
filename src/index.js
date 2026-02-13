// USS Kittyprise Wiki — Cloudflare Worker
// The definitive reference for all Kittyprise lore, law, and order

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
};

// ── Default Lore Data (used for initial migration) ────────────────────────

const DEFAULT_CHAIN = [
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
];

const DEFAULT_TREATIES = [
  {
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
];

const DEFAULT_RULES = [
  {
    number: "#1",
    name: "Blame Xander",
    emoji: "⚔️",
    description: "When something goes wrong, blame Xander. He voted for this himself. No appeals.",
    enforcedBy: "Unanimous consent",
    penalty: "N/A — This rule cannot be broken, only invoked",
  },
  {
    number: "#2",
    name: "Zero Floor Rule",
    emoji: "📉",
    description: "Social credit cannot go below zero. Rubies, however, can go into debt.",
    enforcedBy: "System",
    penalty: "Automatic score correction",
  },
  {
    number: "#3",
    name: "Thermostat Neutrality",
    emoji: "🌡️",
    description: "The Thermostat is SWITZERLAND. It remains neutral in all conflicts.",
    enforcedBy: "Divine mandate",
    penalty: "Climate-based retribution",
  },
  {
    number: "#4",
    name: "Ruby Day Observance",
    emoji: "💎",
    description: "February 7th is Ruby Day. Celebrations are mandatory. Enthusiasm is optional but noted.",
    enforcedBy: "Ruby",
    penalty: "-5 social credit",
  },
];

const DEFAULT_BILLS = [
  {
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
    number: "Bill #2",
    name: "Social Credit Transparency Act",
    date: "2026-02-04",
    status: "Passed",
    emoji: "📊",
    proposedBy: "Codeize",
    summary: "All social credit changes must be logged with reasons. No shadow adjustments.",
    votes: { for: 10, against: 0, abstain: 0 },
  },
];

const DEFAULT_LORE = [
  {
    title: "Ruby Day",
    date: "February 7th",
    emoji: "💎",
    category: "Holiday",
    description: "The most important holiday aboard the USS Kittyprise. Commemorates Ruby's excellence and general existence. Celebrations include: admiring Ruby, thanking Ruby, and acknowledging Ruby's contributions to chaos.",
  },
  {
    title: "The Scoreboard",
    date: "Ongoing",
    emoji: "🏆",
    category: "Competition",
    description: "The eternal rivalry between Ruby and Strife. Current standings: Ruby 4 - Strife 2. The nature of what is being scored remains deliberately unclear.",
  },
  {
    title: "The Parliament",
    date: "Established 2026",
    emoji: "🏛️",
    category: "Government",
    description: "The legislative body of the USS Kittyprise. Finny serves as Prime Minister, Asleep as Speaker. They pass bills, argue about procedures, and occasionally accomplish things.",
  },
  {
    title: "The Thermostat Doctrine",
    date: "Time Immemorial",
    emoji: "🌡️",
    category: "Sacred Law",
    description: "The Thermostat is neutral territory. It belongs to no faction, serves all equally, and its settings are determined by powers beyond mortal comprehension. Touch it at your peril.",
  },
  {
    title: "The Xander Precedent",
    date: "2026-02-03",
    emoji: "⚔️",
    category: "Legal Ruling",
    description: "When the question arose of who to blame for various mishaps, Xander himself voted in favor of being the default scapegoat. This vote was unanimous (including Xander's vote). The decision is final and irrevocable.",
  },
];

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

async function getLoreData(kv) {
  const raw = await kv.get("lore_data", "text");
  if (!raw) return null;
  return JSON.parse(raw);
}

async function setLoreData(kv, lore) {
  lore.lastUpdated = new Date().toISOString();
  await kv.put("lore_data", JSON.stringify(lore));
  return lore;
}

async function ensureData(kv) {
  let data = await getData(kv);
  if (!data) {
    data = await setData(kv, DEFAULT_DATA);
  }
  if (!data.rubies) data.rubies = DEFAULT_DATA.rubies;
  if (!data.rubiesLog) data.rubiesLog = DEFAULT_DATA.rubiesLog;
  return data;
}

async function ensureLoreData(kv) {
  let lore = await getLoreData(kv);
  if (!lore) {
    // Initial migration — store defaults
    lore = {
      chain: DEFAULT_CHAIN,
      treaties: DEFAULT_TREATIES,
      rules: DEFAULT_RULES,
      bills: DEFAULT_BILLS,
      lore: DEFAULT_LORE,
      lastUpdated: new Date().toISOString(),
    };
    await setLoreData(kv, lore);
  }
  // Ensure all fields exist
  if (!lore.chain) lore.chain = DEFAULT_CHAIN;
  if (!lore.treaties) lore.treaties = DEFAULT_TREATIES;
  if (!lore.rules) lore.rules = DEFAULT_RULES;
  if (!lore.bills) lore.bills = DEFAULT_BILLS;
  if (!lore.lore) lore.lore = DEFAULT_LORE;
  return lore;
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

// ── Route: GET /api/lore ────────────────────────────────────────────────

async function handleGetLore(kv) {
  const lore = await ensureLoreData(kv);
  return new Response(JSON.stringify(lore, null, 2), {
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
              date: new Date().toISOString().split("T")[0],
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
              date: new Date().toISOString().split("T")[0],
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
              date: new Date().toISOString().split("T")[0],
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
              date: new Date().toISOString().split("T")[0],
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
          date: op.date || new Date().toISOString().split("T")[0],
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

// ── Route: POST /api/lore ───────────────────────────────────────────────

async function handlePostLore(request, kv, env) {
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

  const lore = await ensureLoreData(kv);

  function processOp(op) {
    switch (op.action) {
      // ── Chain of Command ───────────────────────────────────────────
      case "add_chain_member": {
        const exists = lore.chain.find(
          (c) => c.name.toLowerCase() === op.name.toLowerCase()
        );
        if (exists) return { error: `Chain member "${op.name}" already exists` };
        const entry = {
          rank: op.rank || "Civilian",
          name: op.name,
          emoji: op.emoji || "👤",
          title: op.title || "Crew Member",
          description: op.description || "",
        };
        // Insert at position if provided, otherwise append
        if (op.position !== undefined && op.position >= 0) {
          lore.chain.splice(op.position, 0, entry);
        } else {
          lore.chain.push(entry);
        }
        return { ok: true, added: op.name, section: "chain" };
      }

      case "update_chain_member": {
        const member = lore.chain.find(
          (c) => c.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!member) return { error: `Chain member "${op.name}" not found` };
        if (op.rank !== undefined) member.rank = op.rank;
        if (op.emoji !== undefined) member.emoji = op.emoji;
        if (op.title !== undefined) member.title = op.title;
        if (op.description !== undefined) member.description = op.description;
        if (op.newName !== undefined) member.name = op.newName;
        // Handle position change
        if (op.position !== undefined && op.position >= 0) {
          const idx = lore.chain.findIndex(
            (c) => c.name.toLowerCase() === (op.newName || op.name).toLowerCase()
          );
          if (idx !== -1 && idx !== op.position) {
            const [removed] = lore.chain.splice(idx, 1);
            lore.chain.splice(op.position, 0, removed);
          }
        }
        return { ok: true, updated: member.name, section: "chain" };
      }

      case "remove_chain_member": {
        const idx = lore.chain.findIndex(
          (c) => c.name.toLowerCase() === op.name.toLowerCase()
        );
        if (idx === -1) return { error: `Chain member "${op.name}" not found` };
        const name = lore.chain[idx].name;
        lore.chain.splice(idx, 1);
        return { ok: true, removed: name, section: "chain" };
      }

      // ── Treaties ───────────────────────────────────────────────────
      case "add_treaty": {
        const exists = lore.treaties.find(
          (t) => t.name.toLowerCase() === op.name.toLowerCase()
        );
        if (exists) return { error: `Treaty "${op.name}" already exists` };
        lore.treaties.push({
          name: op.name,
          date: op.date || new Date().toISOString().split("T")[0],
          emoji: op.emoji || "📜",
          summary: op.summary || "",
          parties: op.parties || [],
          terms: op.terms || [],
        });
        return { ok: true, added: op.name, section: "treaties" };
      }

      case "update_treaty": {
        const treaty = lore.treaties.find(
          (t) => t.name.toLowerCase() === op.name.toLowerCase()
        );
        if (!treaty) return { error: `Treaty "${op.name}" not found` };
        if (op.date !== undefined) treaty.date = op.date;
        if (op.emoji !== undefined) treaty.emoji = op.emoji;
        if (op.summary !== undefined) treaty.summary = op.summary;
        if (op.parties !== undefined) treaty.parties = op.parties;
        if (op.terms !== undefined) treaty.terms = op.terms;
        if (op.newName !== undefined) treaty.name = op.newName;
        return { ok: true, updated: treaty.name, section: "treaties" };
      }

      case "remove_treaty": {
        const idx = lore.treaties.findIndex(
          (t) => t.name.toLowerCase() === op.name.toLowerCase()
        );
        if (idx === -1) return { error: `Treaty "${op.name}" not found` };
        const name = lore.treaties[idx].name;
        lore.treaties.splice(idx, 1);
        return { ok: true, removed: name, section: "treaties" };
      }

      // ── Rules ──────────────────────────────────────────────────────
      case "add_rule": {
        const exists = lore.rules.find(
          (r) => r.number.toLowerCase() === op.number.toLowerCase()
        );
        if (exists) return { error: `Rule "${op.number}" already exists` };
        lore.rules.push({
          number: op.number,
          name: op.name,
          emoji: op.emoji || "⚖️",
          description: op.description || "",
          enforcedBy: op.enforcedBy || "System",
          penalty: op.penalty || "TBD",
        });
        return { ok: true, added: op.number, section: "rules" };
      }

      case "update_rule": {
        const rule = lore.rules.find(
          (r) => r.number.toLowerCase() === op.number.toLowerCase()
        );
        if (!rule) return { error: `Rule "${op.number}" not found` };
        if (op.name !== undefined) rule.name = op.name;
        if (op.emoji !== undefined) rule.emoji = op.emoji;
        if (op.description !== undefined) rule.description = op.description;
        if (op.enforcedBy !== undefined) rule.enforcedBy = op.enforcedBy;
        if (op.penalty !== undefined) rule.penalty = op.penalty;
        if (op.newNumber !== undefined) rule.number = op.newNumber;
        return { ok: true, updated: rule.number, section: "rules" };
      }

      case "remove_rule": {
        const idx = lore.rules.findIndex(
          (r) => r.number.toLowerCase() === op.number.toLowerCase()
        );
        if (idx === -1) return { error: `Rule "${op.number}" not found` };
        const number = lore.rules[idx].number;
        lore.rules.splice(idx, 1);
        return { ok: true, removed: number, section: "rules" };
      }

      // ── Bills ──────────────────────────────────────────────────────
      case "add_bill": {
        const exists = lore.bills.find(
          (b) => b.number.toLowerCase() === op.number.toLowerCase()
        );
        if (exists) return { error: `Bill "${op.number}" already exists` };
        lore.bills.push({
          number: op.number,
          name: op.name,
          date: op.date || new Date().toISOString().split("T")[0],
          status: op.status || "Pending",
          emoji: op.emoji || "🏛️",
          proposedBy: op.proposedBy || "Unknown",
          summary: op.summary || "",
          votes: op.votes || { for: 0, against: 0, abstain: 0 },
        });
        return { ok: true, added: op.number, section: "bills" };
      }

      case "update_bill": {
        const bill = lore.bills.find(
          (b) => b.number.toLowerCase() === op.number.toLowerCase()
        );
        if (!bill) return { error: `Bill "${op.number}" not found` };
        if (op.name !== undefined) bill.name = op.name;
        if (op.date !== undefined) bill.date = op.date;
        if (op.status !== undefined) bill.status = op.status;
        if (op.emoji !== undefined) bill.emoji = op.emoji;
        if (op.proposedBy !== undefined) bill.proposedBy = op.proposedBy;
        if (op.summary !== undefined) bill.summary = op.summary;
        if (op.votes !== undefined) bill.votes = op.votes;
        if (op.newNumber !== undefined) bill.number = op.newNumber;
        return { ok: true, updated: bill.number, section: "bills" };
      }

      case "remove_bill": {
        const idx = lore.bills.findIndex(
          (b) => b.number.toLowerCase() === op.number.toLowerCase()
        );
        if (idx === -1) return { error: `Bill "${op.number}" not found` };
        const number = lore.bills[idx].number;
        lore.bills.splice(idx, 1);
        return { ok: true, removed: number, section: "bills" };
      }

      // ── Lore Entries ───────────────────────────────────────────────
      case "add_lore": {
        const exists = lore.lore.find(
          (l) => l.title.toLowerCase() === op.title.toLowerCase()
        );
        if (exists) return { error: `Lore entry "${op.title}" already exists` };
        lore.lore.push({
          title: op.title,
          date: op.date || new Date().toISOString().split("T")[0],
          emoji: op.emoji || "📖",
          category: op.category || "Miscellaneous",
          description: op.description || "",
        });
        return { ok: true, added: op.title, section: "lore" };
      }

      case "update_lore": {
        const entry = lore.lore.find(
          (l) => l.title.toLowerCase() === op.title.toLowerCase()
        );
        if (!entry) return { error: `Lore entry "${op.title}" not found` };
        if (op.date !== undefined) entry.date = op.date;
        if (op.emoji !== undefined) entry.emoji = op.emoji;
        if (op.category !== undefined) entry.category = op.category;
        if (op.description !== undefined) entry.description = op.description;
        if (op.newTitle !== undefined) entry.title = op.newTitle;
        return { ok: true, updated: entry.title, section: "lore" };
      }

      case "remove_lore": {
        const idx = lore.lore.findIndex(
          (l) => l.title.toLowerCase() === op.title.toLowerCase()
        );
        if (idx === -1) return { error: `Lore entry "${op.title}" not found` };
        const title = lore.lore[idx].title;
        lore.lore.splice(idx, 1);
        return { ok: true, removed: title, section: "lore" };
      }

      // ── Bulk & Replace ─────────────────────────────────────────────
      case "bulk": {
        const bulkResults = [];
        for (const subOp of op.operations || []) {
          bulkResults.push(processOp(subOp));
        }
        return { ok: true, results: bulkResults };
      }

      case "replace": {
        if (op.chain !== undefined) lore.chain = op.chain;
        if (op.treaties !== undefined) lore.treaties = op.treaties;
        if (op.rules !== undefined) lore.rules = op.rules;
        if (op.bills !== undefined) lore.bills = op.bills;
        if (op.lore !== undefined) lore.lore = op.lore;
        return { ok: true, replaced: true };
      }

      default:
        return { error: `Unknown action "${op.action}"` };
    }
  }

  const result = processOp(body);
  await setLoreData(kv, lore);

  return new Response(JSON.stringify({ ...result, lore }), {
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

// ── Route: GET / ────────────────────────────────────────────────────────

async function handlePage(kv) {
  const data = await ensureData(kv);
  const lore = await ensureLoreData(kv);
  const html = generateHTML(data, lore);
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}

// ── HTML Template ───────────────────────────────────────────────────────

function generateHTML(data, lore) {
  const chainJSON = JSON.stringify(lore.chain);
  const treatiesJSON = JSON.stringify(lore.treaties);
  const rulesJSON = JSON.stringify(lore.rules);
  const billsJSON = JSON.stringify(lore.bills);
  const loreJSON = JSON.stringify(lore.lore);

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
  }

  .bar-fill::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 2px; height: 100%;
    background: #fff;
    opacity: 0.8;
    box-shadow: 0 0 10px currentColor;
  }

  .bar-score {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    text-align: right;
    min-width: 60px;
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

  .bar-ruby {
    background: linear-gradient(90deg, rgba(224, 17, 95, 0.2), rgba(224, 17, 95, 0.5));
    color: var(--ruby);
    box-shadow: 0 0 15px rgba(224, 17, 95, 0.2);
  }
  .bar-ruby-high {
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.6));
    color: var(--gold);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }

  .score-ruby { color: var(--ruby); }
  .score-ruby-high { color: var(--gold); }

  /* Changelog */
  .changelog-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .log-entry {
    display: grid;
    grid-template-columns: 90px 100px 50px 1fr;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.8rem;
    align-items: center;
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
  .log-change.ruby-positive { color: var(--ruby); }

  .log-reason { color: var(--dim); font-style: italic; }

  /* Top Cards */
  .top-crew {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .top-card {
    text-align: center;
    padding: 20px 28px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel);
    min-width: 150px;
  }

  .top-card.gold { border-color: rgba(255, 215, 0, 0.4); box-shadow: 0 0 20px rgba(255, 215, 0, 0.1); }
  .top-card.danger { border-color: rgba(255, 51, 85, 0.4); box-shadow: 0 0 20px rgba(255, 51, 85, 0.1); }
  .top-card.ruby { border-color: rgba(224, 17, 95, 0.4); box-shadow: 0 0 20px rgba(224, 17, 95, 0.1); }

  .top-card .card-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.55rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--dim);
    margin-bottom: 8px;
  }

  .top-card .card-emoji { font-size: 2.2rem; margin-bottom: 8px; }
  .top-card .card-name { font-size: 0.85rem; color: #fff; margin-bottom: 4px; }

  .top-card .card-score {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.6rem;
    font-weight: 900;
  }

  .top-card.gold .card-score { color: var(--gold); }
  .top-card.danger .card-score { color: var(--red); }
  .top-card.ruby .card-score { color: var(--ruby); }

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
    margin-top: 20px;
    letter-spacing: 1px;
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
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 800px) {
    .command-card {
      grid-template-columns: 40px 1fr;
      gap: 12px;
    }
    .command-desc { display: none; }
    .bar-row {
      grid-template-columns: 100px 1fr 50px;
      gap: 8px;
    }
    .log-entry {
      grid-template-columns: 1fr;
      gap: 4px;
    }
    .nav-btn { padding: 8px 10px; font-size: 0.6rem; }
  }
</style>
</head>
<body>

<canvas id="starfield"></canvas>

<div class="container">
  <header class="header">
    <div class="ship-name">USS Kittyprise</div>
    <div class="subtitle">Official Ship's Wiki & Records</div>
    <div class="system-status">
      <span class="status-dot"></span>
      <span>All Systems Operational</span>
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
  </nav>

  <!-- CREDIT SECTION -->
  <div class="section active" id="credit">
    <div class="top-crew" id="credit-top"></div>
    <div class="panel">
      <div class="section-title">Social Credit Standings</div>
      <div class="bar-chart" id="credit-chart"></div>
    </div>
    <div class="panel">
      <div class="section-title">Credit Activity Log</div>
      <div class="changelog-list" id="credit-log"></div>
    </div>
  </div>

  <!-- RUBIES SECTION -->
  <div class="section" id="rubies">
    <div class="top-crew" id="rubies-top"></div>
    <div class="panel" style="border-color: rgba(224, 17, 95, 0.25);">
      <div class="section-title" style="color: var(--ruby);">💎 Rubies Balances</div>
      <div class="bar-chart" id="rubies-chart"></div>
    </div>
    <div class="panel" style="border-color: rgba(224, 17, 95, 0.25);">
      <div class="section-title" style="color: var(--ruby);">💎 Rubies Transactions</div>
      <div class="changelog-list" id="rubies-log"></div>
    </div>
  </div>

  <!-- COMMAND SECTION -->
  <div class="section" id="command">
    <div class="panel" style="border-color: rgba(255, 215, 0, 0.25);">
      <div class="section-title" style="color: var(--gold);">👑 Chain of Command</div>
      <div class="command-grid" id="command-grid"></div>
    </div>
  </div>

  <!-- TREATIES SECTION -->
  <div class="section" id="treaties">
    <div class="panel" style="border-color: rgba(155, 89, 182, 0.25);">
      <div class="section-title" style="color: var(--purple);">📜 Active Treaties</div>
      <div id="treaties-list"></div>
    </div>
  </div>

  <!-- RULES SECTION -->
  <div class="section" id="rules">
    <div class="panel" style="border-color: rgba(255, 51, 85, 0.25);">
      <div class="section-title" style="color: var(--red);">⚖️ Ship's Rules</div>
      <div id="rules-list"></div>
    </div>
  </div>

  <!-- BILLS SECTION -->
  <div class="section" id="bills">
    <div class="panel" style="border-color: rgba(0, 255, 136, 0.25);">
      <div class="section-title" style="color: var(--green);">🏛️ Bills & Legislation</div>
      <div id="bills-list"></div>
    </div>
  </div>

  <!-- LORE SECTION -->
  <div class="section" id="lore">
    <div class="panel" style="border-color: rgba(243, 156, 18, 0.25);">
      <div class="section-title" style="color: var(--orange);">📖 Ship's Lore</div>
      <div id="lore-list"></div>
    </div>
  </div>

  <div class="last-updated" id="last-updated"></div>

  <footer class="footer">
    <a href="https://chaoscat.win" target="_blank">chaoscat.win</a> — meow 🐱
  </footer>
</div>

<script>
  // Load data
  const scoreData = JSON.parse(document.getElementById('score-data').textContent);
  const chainData = JSON.parse(document.getElementById('chain-data').textContent);
  const treatiesData = JSON.parse(document.getElementById('treaties-data').textContent);
  const rulesData = JSON.parse(document.getElementById('rules-data').textContent);
  const billsData = JSON.parse(document.getElementById('bills-data').textContent);
  const loreData = JSON.parse(document.getElementById('lore-data').textContent);

  // Starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  function drawStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5 + 0.5;
      const brightness = Math.random() * 0.5 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(200, 220, 255, \${brightness})\`;
      ctx.fill();
    }
  }
  drawStars();
  window.addEventListener('resize', drawStars);

  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.section).classList.add('active');
    });
  });

  // Helper functions
  function getScoreClass(score) {
    if (score >= 110) return 'high';
    if (score > 100) return 'good';
    if (score === 100) return 'neutral';
    return 'low';
  }

  function getRubyClass(balance) {
    if (balance >= 100) return 'ruby-high';
    return 'ruby';
  }

  function getMemberInfo(name) {
    return scoreData.scores.find(s => s.name.toLowerCase() === name.toLowerCase()) || { emoji: '👤', rank: 'Civilian' };
  }

  // ═══ CREDIT SECTION ═══
  const scores = [...scoreData.scores].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...scores.map(s => s.score)) + 10;

  // Top cards
  const creditTop = document.getElementById('credit-top');
  const highest = scores[0];
  const lowest = scores[scores.length - 1];
  
  creditTop.innerHTML = \`
    <div class="top-card gold">
      <div class="card-label">★ Highest Credit</div>
      <div class="card-emoji">\${highest.emoji}</div>
      <div class="card-name">\${highest.name}</div>
      <div class="card-score">\${highest.score}</div>
    </div>
    \${lowest.score < highest.score ? \`
    <div class="top-card danger">
      <div class="card-label">⚠ Lowest Credit</div>
      <div class="card-emoji">\${lowest.emoji}</div>
      <div class="card-name">\${lowest.name}</div>
      <div class="card-score">\${lowest.score}</div>
    </div>\` : ''}
  \`;

  // Bar chart
  const creditChart = document.getElementById('credit-chart');
  scores.forEach((member, i) => {
    const pct = ((member.score / maxScore) * 100).toFixed(1);
    const cls = getScoreClass(member.score);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.style.animationDelay = \`\${i * 0.08}s\`;
    row.innerHTML = \`
      <div class="crew-info">
        <span class="crew-emoji">\${member.emoji}</span>
        <div class="crew-details">
          <div class="crew-name">\${member.name}</div>
          <div class="crew-rank">\${member.rank}</div>
        </div>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-\${cls}" style="--fill-width: \${pct}%; animation-delay: \${i * 0.1}s"></div>
      </div>
      <div class="bar-score score-\${cls}">\${member.score}</div>
    \`;
    creditChart.appendChild(row);
  });

  // Changelog
  const creditLog = document.getElementById('credit-log');
  scoreData.changelog.forEach(entry => {
    const isPositive = entry.change.startsWith('+');
    creditLog.innerHTML += \`
      <div class="log-entry">
        <span class="log-date">\${entry.date}</span>
        <span class="log-who">\${entry.who}</span>
        <span class="log-change \${isPositive ? 'positive' : 'negative'}">\${entry.change}</span>
        <span class="log-reason">\${entry.reason}</span>
      </div>
    \`;
  });

  // ═══ RUBIES SECTION ═══
  const rubies = [...(scoreData.rubies || [])].sort((a, b) => b.balance - a.balance);
  const maxRubies = Math.max(...rubies.map(r => r.balance), 60) + 10;

  // Top cards
  const rubiesTop = document.getElementById('rubies-top');
  if (rubies.length > 0) {
    const richest = rubies[0];
    const poorest = rubies[rubies.length - 1];
    const richInfo = getMemberInfo(richest.name);
    const poorInfo = getMemberInfo(poorest.name);
    
    rubiesTop.innerHTML = \`
      <div class="top-card ruby">
        <div class="card-label">💎 Most Rubies</div>
        <div class="card-emoji">\${richInfo.emoji}</div>
        <div class="card-name">\${richest.name}</div>
        <div class="card-score">\${richest.balance}</div>
      </div>
      \${poorest.balance < richest.balance ? \`
      <div class="top-card danger">
        <div class="card-label">💸 Least Rubies</div>
        <div class="card-emoji">\${poorInfo.emoji}</div>
        <div class="card-name">\${poorest.name}</div>
        <div class="card-score">\${poorest.balance}</div>
      </div>\` : ''}
    \`;
  }

  // Bar chart
  const rubiesChart = document.getElementById('rubies-chart');
  rubies.forEach((entry, i) => {
    const info = getMemberInfo(entry.name);
    const pct = Math.max(((entry.balance / maxRubies) * 100), 2).toFixed(1);
    const cls = getRubyClass(entry.balance);
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.style.animationDelay = \`\${i * 0.08}s\`;
    row.innerHTML = \`
      <div class="crew-info">
        <span class="crew-emoji">\${info.emoji}</span>
        <div class="crew-details">
          <div class="crew-name">\${entry.name}</div>
          <div class="crew-rank">\${info.rank}</div>
        </div>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-\${cls}" style="--fill-width: \${pct}%; animation-delay: \${i * 0.1}s"></div>
      </div>
      <div class="bar-score score-\${cls}">\${entry.balance}</div>
    \`;
    rubiesChart.appendChild(row);
  });

  // Rubies log
  const rubiesLog = document.getElementById('rubies-log');
  (scoreData.rubiesLog || []).forEach(entry => {
    const isPositive = entry.change.startsWith('+');
    rubiesLog.innerHTML += \`
      <div class="log-entry">
        <span class="log-date">\${entry.date}</span>
        <span class="log-who">\${entry.who}</span>
        <span class="log-change \${isPositive ? 'ruby-positive' : 'negative'}">\${entry.change}</span>
        <span class="log-reason">\${entry.reason}</span>
      </div>
    \`;
  });

  // ═══ COMMAND SECTION ═══
  const commandGrid = document.getElementById('command-grid');
  chainData.forEach((member, i) => {
    const isTop = i < 4;
    commandGrid.innerHTML += \`
      <div class="command-card \${isTop ? 'highlight' : ''}">
        <div class="command-emoji">\${member.emoji}</div>
        <div class="command-info">
          <h3>\${member.name}</h3>
          <div class="command-rank">\${member.rank}</div>
          <div class="command-title">\${member.title}</div>
        </div>
        <div class="command-desc">\${member.description}</div>
      </div>
    \`;
  });

  // ═══ TREATIES SECTION ═══
  const treatiesList = document.getElementById('treaties-list');
  treatiesData.forEach(treaty => {
    treatiesList.innerHTML += \`
      <div class="treaty-card">
        <div class="treaty-header">
          <div class="treaty-emoji">\${treaty.emoji}</div>
          <div class="treaty-title">
            <h3>\${treaty.name}</h3>
            <div class="treaty-date">Signed: \${treaty.date}</div>
          </div>
        </div>
        <div class="treaty-summary">\${treaty.summary}</div>
        <div class="treaty-parties"><strong>Parties:</strong> \${treaty.parties.join(', ')}</div>
        <ul class="treaty-terms">
          \${treaty.terms.map(t => \`<li>\${t}</li>\`).join('')}
        </ul>
      </div>
    \`;
  });

  // ═══ RULES SECTION ═══
  const rulesList = document.getElementById('rules-list');
  rulesData.forEach(rule => {
    rulesList.innerHTML += \`
      <div class="rule-card">
        <div class="rule-header">
          <span class="rule-number">\${rule.number}</span>
          <span class="rule-emoji">\${rule.emoji}</span>
          <span class="rule-name">\${rule.name}</span>
        </div>
        <div class="rule-desc">\${rule.description}</div>
        <div class="rule-meta">
          <span><strong>Enforced by:</strong> \${rule.enforcedBy}</span>
          <span><strong>Penalty:</strong> \${rule.penalty}</span>
        </div>
      </div>
    \`;
  });

  // ═══ BILLS SECTION ═══
  const billsList = document.getElementById('bills-list');
  billsData.forEach(bill => {
    const statusClass = bill.status.toLowerCase();
    billsList.innerHTML += \`
      <div class="bill-card">
        <div class="bill-header">
          <div class="bill-title-group">
            <span class="bill-number">\${bill.number}</span>
            <span class="bill-name">\${bill.name}</span>
          </div>
          <span class="bill-status \${statusClass}">\${bill.status}</span>
        </div>
        <div class="bill-summary">\${bill.summary}</div>
        <div class="bill-meta">
          <span><strong>Date:</strong> \${bill.date}</span>
          <span><strong>Proposed by:</strong> \${bill.proposedBy}</span>
          <span class="bill-votes">
            <span class="vote-for">✓ \${bill.votes.for}</span> /
            <span class="vote-against">✗ \${bill.votes.against}</span> /
            <span class="vote-abstain">○ \${bill.votes.abstain}</span>
          </span>
        </div>
      </div>
    \`;
  });

  // ═══ LORE SECTION ═══
  const loreList = document.getElementById('lore-list');
  loreData.forEach(entry => {
    loreList.innerHTML += \`
      <div class="lore-card">
        <div class="lore-header">
          <div class="lore-emoji">\${entry.emoji}</div>
          <div class="lore-title">
            <h3>\${entry.title}</h3>
            <div class="lore-category">\${entry.category}</div>
            <div class="lore-date">\${entry.date}</div>
          </div>
        </div>
        <div class="lore-desc">\${entry.description}</div>
      </div>
    \`;
  });

  // Last updated
  const updated = new Date(scoreData.lastUpdated);
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

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Score/Credit/Rubies API
    if (url.pathname === "/api/scores") {
      if (request.method === "GET") {
        return handleGetScores(env.SCORES_KV);
      }
      if (request.method === "POST") {
        return handlePostScores(request, env.SCORES_KV, env);
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Lore API (chain, treaties, rules, bills, lore)
    if (url.pathname === "/api/lore") {
      if (request.method === "GET") {
        return handleGetLore(env.SCORES_KV);
      }
      if (request.method === "POST") {
        return handlePostLore(request, env.SCORES_KV, env);
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Main page
    if (request.method === "GET") {
      return handlePage(env.SCORES_KV);
    }

    return new Response("Not Found", { status: 404 });
  },
};
