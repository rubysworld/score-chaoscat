#!/usr/bin/env node
// Seed the KV namespace with initial score data
// Usage: wrangler kv:key put --binding SCORES_KV "score_data" "$(node scripts/generate-seed.js)"
// Or run via: npm run seed (after wrangler is configured)

const data = {
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

console.log(JSON.stringify(data));
