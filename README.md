# USS Kittyprise — Social Credit System

A Cloudflare Worker that serves the crew social credit scoreboard with a KV-backed database and API for score updates.

**Live:** https://score.chaoscat.win

## Architecture

- **Cloudflare Worker** serves the HTML page with scores injected from KV
- **KV Namespace** (`SCORES_KV`) stores all score/changelog data as a single JSON blob
- **API key** authentication for write operations

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Serves the scoreboard HTML page |
| GET | `/api/scores` | No | Returns current scores as JSON |
| POST | `/api/scores` | Yes | Update scores (see API below) |

## API Usage

All POST requests require `Authorization: Bearer <API_KEY>` header.

Config stored at `~/.config/score-chaoscat/config.json`.

### Update a score

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "update_score", "name": "Finny", "delta": 5, "reason": "Being awesome"}'
```

### Set a score absolutely

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "set_score", "name": "Finny", "score": 105, "reason": "Score correction"}'
```

### Add a changelog entry (without changing scores)

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "add_log", "who": "Finny", "change": "+5", "reason": "Being awesome"}'
```

### Add a new crew member

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "add_member", "name": "NewPerson", "emoji": "🌟", "score": 100, "rank": "Civilian"}'
```

### Remove a crew member

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "remove_member", "name": "NewPerson"}'
```

### Update member details (emoji, rank, name)

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "update_member", "name": "Finny", "rank": "Admiral", "emoji": "🐠"}'
```

### Bulk operations

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "bulk",
    "operations": [
      {"action": "update_score", "name": "Finny", "delta": 3, "reason": "Great work"},
      {"action": "update_score", "name": "pip", "delta": -1, "reason": "Annoying codeize again"}
    ]
  }'
```

### Full data replace (nuclear option)

```bash
curl -X POST https://score.chaoscat.win/api/scores \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "replace", "data": {"scores": [...], "changelog": [...]}}'
```

## Development

```bash
# Local dev
npm run dev

# Deploy
npm run deploy
```

## Deployment Setup

1. `wrangler login` (OAuth to Cloudflare)
2. Create KV namespace: `wrangler kv:namespace create SCORES_KV`
3. Update `wrangler.toml` with the KV namespace ID
4. Deploy: `wrangler deploy`
5. Seed data: `wrangler kv:key put --binding SCORES_KV "score_data" "$(node scripts/seed.js)"`
6. Set up DNS: CNAME `score` → `score-chaoscat.<account>.workers.dev` (or use Worker route)
