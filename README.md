# USS Kittyprise Wiki

A Cloudflare Worker that serves the full USS Kittyprise Wiki including Social Credit scores, Rubies currency, Chain of Command, Treaties, Rules, Bills, and Lore.

**Live:** https://kittyprise.chaoscat.win (also: https://score.chaoscat.win)

## Architecture

- **Cloudflare Worker** serves the Wiki page with all data injected from KV
- **KV Namespace** (`SCORES_KV`) stores:
  - `score_data` — scores, changelog, rubies, rubiesLog
  - `lore_data` — chain of command, treaties, rules, bills, lore entries
- **API key** authentication for write operations

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Serves the Wiki HTML page |
| GET | `/api/scores` | No | Returns scores/rubies data as JSON |
| POST | `/api/scores` | Yes | Update scores/rubies |
| GET | `/api/lore` | No | Returns lore data as JSON |
| POST | `/api/lore` | Yes | Update lore (chain, treaties, rules, bills, lore) |

## CLI

Use the `score.sh` CLI for all operations. See the skill docs at `~/ruby/skills/score-chaoscat/SKILL.md`.

```bash
# Score operations
score.sh get
score.sh update "Finny" 5 "Good behavior"
score.sh update "pip" -10 "Purchase" --type rubies

# Lore operations
score.sh chain list
score.sh chain add "Lieutenant" "NewCrew" "🌟" "New Title" "Description"
score.sh treaty add "Peace Treaty" "2026-02-12" "Establishes peace"
score.sh rule add "#5" "No Shouting" "Indoor voices only"
score.sh bill add "Bill #3" "Nap Time Act" "2026-02-12" "Pending" "Asleep" "Summary"
score.sh lore-entry add "Title" "2026-02-12" "Category" "Description"
```

## API Reference

### Scores API (`/api/scores`)

All POST requests require `Authorization: Bearer <API_KEY>` header.

#### Actions

| Action | Required | Optional |
|--------|----------|----------|
| `update_score` | `name`, `delta` | `reason`, `type` (credit/rubies) |
| `set_score` | `name`, `score` | `reason`, `type` |
| `add_log` | `who`, `change`, `reason` | `date`, `type` |
| `add_member` | `name` | `emoji`, `score`, `rank`, `rubies` |
| `remove_member` | `name` | — |
| `update_member` | `name` | `emoji`, `rank`, `newName` |
| `bulk` | `operations` (array) | — |
| `replace` | `data` (object) | — |

### Lore API (`/api/lore`)

#### Chain of Command Actions

| Action | Required | Optional |
|--------|----------|----------|
| `add_chain_member` | `name` | `rank`, `emoji`, `title`, `description`, `position` |
| `update_chain_member` | `name` | `rank`, `emoji`, `title`, `description`, `newName`, `position` |
| `remove_chain_member` | `name` | — |

#### Treaty Actions

| Action | Required | Optional |
|--------|----------|----------|
| `add_treaty` | `name` | `date`, `emoji`, `summary`, `parties`, `terms` |
| `update_treaty` | `name` | `date`, `emoji`, `summary`, `parties`, `terms`, `newName` |
| `remove_treaty` | `name` | — |

#### Rule Actions

| Action | Required | Optional |
|--------|----------|----------|
| `add_rule` | `number`, `name` | `emoji`, `description`, `enforcedBy`, `penalty` |
| `update_rule` | `number` | `name`, `emoji`, `description`, `enforcedBy`, `penalty`, `newNumber` |
| `remove_rule` | `number` | — |

#### Bill Actions

| Action | Required | Optional |
|--------|----------|----------|
| `add_bill` | `number`, `name` | `date`, `status`, `emoji`, `proposedBy`, `summary`, `votes` |
| `update_bill` | `number` | `name`, `date`, `status`, `emoji`, `proposedBy`, `summary`, `votes`, `newNumber` |
| `remove_bill` | `number` | — |

#### Lore Entry Actions

| Action | Required | Optional |
|--------|----------|----------|
| `add_lore` | `title` | `date`, `emoji`, `category`, `description` |
| `update_lore` | `title` | `date`, `emoji`, `category`, `description`, `newTitle` |
| `remove_lore` | `title` | — |

#### Bulk & Replace

| Action | Required |
|--------|----------|
| `bulk` | `operations` (array) |
| `replace` | Any of: `chain`, `treaties`, `rules`, `bills`, `lore` |

## Development

```bash
# Local dev
npm run dev

# Deploy
npm run deploy
```

## Deployment

### Auto-deploy via GitHub Actions

Push to `main` triggers automatic deployment via the `.github/workflows/deploy.yml` action.

**Setup required:** Add `CLOUDFLARE_API_TOKEN` secret to the GitHub repo.

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create token with permissions:
   - Account: Read
   - Workers Scripts: Edit
3. Add as repo secret at: Settings → Secrets → Actions → New repository secret
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (your token)

### Manual Deployment

```bash
wrangler login
wrangler deploy
```

## Data Migration

On first request after deployment, the Worker will automatically:
1. Initialize `score_data` in KV if empty (with default scores)
2. Initialize `lore_data` in KV if empty (with default chain, treaties, rules, bills, lore)

No manual seeding required.
