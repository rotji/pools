# Technical Blueprint — Monorepo & System Architecture

*Ready-to-use structure for the Group Pooling Platform (Stacks + off-chain integrations). Includes separate Backend and Oracle services, frontend (Vite + React + TS + CSS Modules), Clarity contracts, and PostgreSQL schema. Grouped by Basic / Medium / Complex phases.*

---

## 🚨 Bold Platform Disclaimer (show in README & UI)

**DISCLAIMER:** This platform is not financial advice. Participation involves risk, including possible total loss of funds. Settlement occurs only after external platforms release funds; the platform is not liable for external holds or freezes. Users must comply with local laws. KYC/AML required.

---

# 1 — Monorepo (GitHub) Top-level Layout

```
/group-pooling-platform
├─ /frontend                # Vite + React + TypeScript + CSS Modules + stacks.js
├─ /backend                 # Main backend API (Node.js + Express + TypeScript)
├─ /oracle-service          # Independent oracle microservice (Node.js + TypeScript)
├─ /contracts               # Clarity contracts + tests (Clarinet)
├─ /db                      # Migrations, seeds, ER diagrams
├─ /infra                   # Terraform / CloudFormation / k8s manifests (optional)
├─ /scripts                 # Useful dev scripts (start-all, test-all, lint)
├─ /docs                    # Product docs, onboarding, architecture docs
├─ .github                  # CI workflows (GitHub Actions)
├─ README.md
└─ package.json (workspace) # optional, set up as monorepo (pnpm/yarn workspaces)
```

> Use pnpm / yarn workspaces or npm workspaces to manage packages and shared utils.

---

# 2 — Frontend Structure (Vite + React + TS + CSS Modules + stacks.js)

```
/frontend
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ public/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css             # global resets (minimal)
│  ├─ routes/
│  │  ├─ Home.tsx
│  │  ├─ Groups.tsx
│  │  ├─ GroupDetail.tsx
│  │  ├─ CreateGroup.tsx
│  │  ├─ WalletConnect.tsx
│  │  └─ Admin.tsx
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ Button/ Button.module.css
│  │  │  ├─ Modal/
│  │  │  └─ Card/
│  │  ├─ GroupList/
│  │  └─ ConnectWallet/
│  ├─ lib/
│  │  ├─ api.ts             # backend API wrapper (fetch/axios)
│  │  └─ stacks/            # stacks.js helpers (auth, contract calls)
│  ├─ hooks/
│  ├─ stores/               # optional: Zustand / Redux
│  ├─ styles/               # shared CSS Modules variables (if any)
│  └─ assets/
├─ tests/                   # frontend tests (Vitest + Testing Library)
└─ README.frontend.md
```

**Notes / Responsibilities**

* `lib/stacks/` contains stacks.js auth flows (Hiro Wallet integration), tx helpers, and contract call wrappers.
* Use CSS Modules for all component styling.
* Routes map to group lifecycle views: create → join → deposit (sign tx) → trade (embedded or redirect) → view settlement.

---

# 3 — Backend (Node.js + Express + TypeScript)

```
/backend
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts               # server bootstrap
│  ├─ app.ts                 # express app
│  ├─ config/
│  │  └─ index.ts            # env config loader
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ groups.controller.ts
│  │  ├─ users.controller.ts
│  │  └─ admin.controller.ts
│  ├─ services/
│  │  ├─ group.service.ts
│  │  ├─ settlement.service.ts
│  │  ├─ integration.service.ts  # adapters to external APIs (pluggable)
│  │  └─ notifications.service.ts
│  ├─ integrations/
│  │  ├─ crypto/
│  │  │  └─ binance.client.ts
│  │  └─ mock/
│  ├─ db/
│  │  ├─ index.ts            # pg client / knex / prisma
│  │  └─ migrations/
│  ├─ models/                 # TypeScript interfaces/types
│  ├─ middlewares/
│  ├─ utils/
│  └─ jobs/                   # scheduled reconciliation, sync workers
├─ tests/
└─ README.backend.md
```

**Backend responsibilities**

* Primary API for frontend (user profiles, group metadata, membership CRUD, off-chain account linking).
* Persist audit trail of on-chain events (watch Stacks events via API).
* Manage admin operations (force-settle, manual verifications).
* Provide adapter pattern (`/integrations`) so new exchange connectors can be added easily.
* Provide webhooks endpoint for the Oracle service to post attestations and updates.

---

# 4 — Oracle Service (Independent microservice)

```
/oracle-service
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts               # bootstrap
│  ├─ config/
│  ├─ services/
│  │  ├─ attestation.service.ts   # builds signed attestations
│  │  ├─ feeds.service.ts         # connectors to external APIs (binance, coinGecko)
│  │  └─ verifier.service.ts      # verify external signatures if using user-signed proofs
│  ├─ integrations/
│  ├─ signer/
│  │  └─ key-management.ts    # sign attestations with oracle key(s)
│  ├─ api/
│  │  └─ publish.controller.ts  # endpoint to push attestation to backend or directly to Stacks
│  ├─ jobs/                   # scheduled price aggregations / reconciliation
│  └─ utils/
├─ tests/
└─ README.oracle.md
```

**Oracle Responsibilities & Modes**

* **Fetch Mode:** poll/exchange APIs to fetch final balances/withdrawable status for an account.
* **Aggregate Mode:** combine multiple data sources and produce deterministic `total_final` numbers.
* **Sign Mode:** sign attestation payloads with oracle private key(s) (Ed25519 / secp256k1 based on scheme).
* **Publish Mode:** either publish attestations to backend (which calls Clarity via a privileged wallet) **or** publish directly to a Stacks oracle account (via stacks.js on server).
* **Security:** keys stored in a secrets manager (HashiCorp Vault / AWS Secrets Manager); limit IP and role access; rotate keys.

---

# 5 — Clarity Contracts Folder Layout & Responsibilities

```
/contracts
├─ Clarinet.toml
├─ src/
│  ├─ group-factory.clar         # create groups meta, emits events for escrow creation
│  ├─ escrow-stx.clar            # escrow contract for STX deposits
│  ├─ escrow-sip010.clar         # placeholder/compatible interface for FT tokens (SIP-010)
│  ├─ settlement.clar            # settlement logic: accept attestations & compute per-member share
│  ├─ oracle-registry.clar       # whitelist oracle principals, manage oracle keys/roles
│  └─ sip010-mock-token.clar     # mock token used in medium tests
├─ tests/
│  └─ clarinet-tests.ts
└─ docs/                         # contract docs & ABI interface
```

**Contract responsibilities**

* `group-factory`: register groups, create mapping to escrow, store group metadata. Emits events/records.
* `escrow-stx`: accept STX transfers for joining groups; track deposit txids and member principals.
* `settlement`: accept signed attestation payloads from whitelisted oracle principal(s), compute `total_final`, compute `per_member_amount`, mark settlement record, enable `withdraw` for members.
* `oracle-registry`: manage which principals (addresses) are valid oracles; ability to rotate or revoke.
* `escrow-sip010`: same interface but for SIP-010 tokens (mint/transfer allowances if tokenized approach used later).

**Testing**

* Use Clarinet tests for each contract with test cases for rounding, locked funds, only-oracle can submit attestations, reentrancy/edge cases.

---

# 6 — PostgreSQL Schema (Entities & Relationships — conceptual)

> Use migrations (Knex / TypeORM / Prisma) for real SQL. Below are table definitions and key fields (no raw SQL yet).

### `users`

* `id` (uuid, pk)
* `principal` (stacks principal / wallet address, unique)
* `email` (nullable)
* `kyc_status` (enum: pending/verified/rejected)
* `created_at`, `updated_at`

### `groups`

* `id` (uuid)
* `group_id_onchain` (uint / optional)
* `name`
* `contribution_amount` (numeric)
* `currency` (enum: STX / SIP-010-token / fiat-mock)
* `pooling_model` (enum: full_pooling)
* `start_date`, `end_date`
* `status` (open/active/settled/pending)
* `admin_user_id`
* `created_at`, `updated_at`

### `memberships`

* `id`
* `group_id` (fk groups)
* `user_id` (fk users)
* `deposit_tx` (on-chain tx id or off-chain receipt)
* `deposit_amount`
* `status` (joined/withdrawn/locked)
* `joined_at`

### `settlements`

* `id`
* `group_id`
* `total_contributed`
* `total_final`
* `net_profit`
* `per_member_amount`
* `oracle_attestation_id` (fk)
* `settled_at`
* `status` (pending/confirmed/failed)

### `oracle_attestations`

* `id`
* `group_id`
* `oracle_principal`
* `payload` (json)
* `signature`
* `published_onchain_tx` (optional)
* `created_at`

### `external_accounts`

* `id`
* `user_id`
* `platform` (e.g., BINANCE, MOCK)
* `account_identifier`
* `credentials_meta` (encrypted)
* `last_synced_at`

### `audit_logs`

* `id`
* `entity` (group/membership/settlement/contract)
* `action`
* `actor`
* `details` (json)
* `created_at`

**Indexes & constraints**

* Index `users(principal)`
* FK constraints for referential integrity
* Unique constraint on membership per (group_id, user_id)

---

# 7 — Environment & Secrets (example env vars per service)

**Frontend**

* `VITE_API_URL`
* `VITE_STACKS_NETWORK` (mainnet/testnet)
* `VITE_HIRO_WALLET_URL` (if needed)

**Backend**

* `DATABASE_URL`
* `JWT_SECRET`
* `BACKEND_PORT`
* `STACKS_API_URL` (Hiro / Stacks API)
* `ORACLE_SERVICE_URL`
* `ADMIN_PRINCIPAL` (optional)
* `SENTRY_DSN` (optional)

**Oracle Service**

* `ORACLE_SIGNER_KEY` (store in Vault; do NOT put directly in env for prod)
* `ORACLE_ALLOWED_PLATFORMS`
* `ORACLE_PUBLISH_MODE` (backend | direct-onchain)
* `ORACLE_POOLING_THRESHOLD`

**Contracts / Clarinet**

* `CLARINET_NETWORK` (local/testnet)
* `CLARINET_ACCOUNT_KEYS` (for test)

---

# 8 — CI / CD, Testing & Deployment Notes

* Use GitHub Actions:

  * `ci/frontend.yml` — install, lint, test, build (for preview)
  * `ci/backend.yml` — typescript build, unit tests, db migrations
  * `ci/contracts.yml` — run `clarinet test` and fail on errors (Stacks Ascent requirement)
* Staging: Deploy to testnet Stacks; use testnet keys.
* Production: require audited contracts and legal review before mainnet.
* Deployment targets: AWS ECS/Fargate, or Vercel for frontend, GCP Cloud Run for backend/oracle, or Kubernetes.

---

# 9 — Observability, Security & Compliance

* Monitoring: Prometheus + Grafana or Datadog; Sentry for exceptions.
* Logging: centralized (CloudWatch / ELK), store audit logs immutably.
* Secrets: AWS Secrets Manager / HashiCorp Vault.
* KYC: integrate Onfido / Jumio; store KYC status only, raw PII in secure storage.
* Pen-tests before production; Clarity contract audits required for mainnet.

---

# 10 — Mapping to ROADMAP PHASES (Basic / Medium / Complex)

### Basic (MVP) — deliverables in structure

* Frontend routes, stacks.js wallet connect, group create/join flows.
* Clarity: `group-factory`, `escrow-stx`, `settlement` (manual oracle/admin attestation).
* Backend: minimal API for metadata, webhook to mirror on-chain events, PostgreSQL basic schema.
* Oracle-service: **manual mode** — operator triggers attestations (no external data connectors).
* Tests: Clarinet tests + unit tests for settlement math.

### Medium — deliverables in structure

* Oracle-service: automated connector to free APIs (CoinGecko, Binance public endpoints) + signing + publishing.
* Backend: integration.service adapters (mock exchange connectors), scheduled jobs.
* Clarity: add `escrow-sip010`, `sip010-mock-token`.
* Frontend: richer dashboard, trading simulator (paper trading), admin panel.

### Complex — deliverables in structure

* Full exchange integrations (Alpaca, OANDA, licensed betting APIs), custody partners (Fireblocks).
* Decentralized oracle network (multi-signer attestations, majority verification on chain).
* Advanced on-chain tooling: tokenized pool shares, on-chain governance (DAO).
* Full compliance (SOC2), multi-region deployment, mobile apps.

---

# 11 — Recommended Next Immediate Actions (practical)

1. Create monorepo and initialize workspaces (pnpm/yarn).
2. Scaffold `frontend`, `backend`, `oracle-service`, and `contracts` folders with README stubs.
3. Implement Clarinet contract skeletons and run `clarinet check` immediately (required for Stacks Ascent).
4. Wire up a demo: simple frontend that creates a testnet group, user deposits STX into `escrow-stx`, admin settles with manual oracle attestation, users withdraw — use this demo for the Ascent application.

---

If you want, I can now **generate the README-style blueprint files** for each subproject (frontend/backend/oracle/contracts) with this exact structure, plus sample `package.json` suggestions and `npm` scripts (still no production code).

Would you like me to:

* A) Generate README + folder skeleton files for the whole monorepo now?
* B) Start by generating Clarinet contract skeletons and tests (so you can run `clarinet check`)?

Choose **A** or **B** and I’ll produce the artifacts immediately.
✅ Understood. I will now begin **PART A — Monorepo Structure + Root Configuration + README Templates**.

Because of length limits, **I will deliver it in multiple chunks**.
**Do not worry — I will stop when needed and prompt you to reply `continue` so I can resume.**

---

# 🧱 PART A — MONOREPO ROOT STRUCTURE & BASE FILES (CHUNK 1)

Below is the **root folder structure** and **root-level `package.json` setup with npm workspaces**.

---

### 📁 Folder Layout (Create these at the project root)

```
group-pooling-platform/
├─ backend/
├─ oracle-service/
├─ frontend/
├─ contracts/
├─ db/
├─ docs/
├─ scripts/
├─ .github/
│  └─ workflows/    # (for CI/CD YAML later)
├─ README.md
└─ package.json      # (npm workspaces config here)
```

---

### 📄 Root `package.json` (npm workspaces enabled)

Create this file at `/group-pooling-platform/package.json`:

```json
{
  "name": "group-pooling-platform",
  "private": true,
  "version": "1.0.0",
  "description": "Monorepo for pooled risk-sharing investment platform (Stacks + Off-chain Oracles)",
  "workspaces": [
    "frontend",
    "backend",
    "oracle-service",
    "contracts"
  ],
  "scripts": {
    "dev:frontend": "npm --workspace frontend run dev",
    "dev:backend": "npm --workspace backend run dev",
    "dev:oracle": "npm --workspace oracle-service run dev",
    "dev:contracts": "cd contracts && clarinet develop",
    "dev:all": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" \"npm run dev:oracle\"",
    "test": "npm run test -ws",
    "lint": "npm run lint -ws"
  },
  "devDependencies": {
    "concurrently": "^8.0.1"
  }
}
```

> ✅ This allows you to run **workspaces** with `npm` just like Yarn/PNPM.

---

### 📄 Root `README.md` (High-level overview)

Create `/README.md` with the following template:

````md
# Group Pooling Platform (Stacks + Oracles + Risk-Sharing)

> A decentralized platform where users form groups, deposit equal funds, invest independently, and **share all profits/losses equally** — enforced via **Clarity smart contracts** and **off-chain oracle attestations**.

---

## 🚨 Disclaimer

**This platform does not provide financial advice.**
Users participate at their own risk. Settlement occurs only after **external platforms release funds**. The platform is **not liable for exchange freezes or delays**.

---

## 📦 Monorepo Services

| Folder          | Description |
|----------------|-------------|
| `/frontend`     | Vite + React + TypeScript + stacks.js wallet auth |
| `/backend`      | Node.js + Express + PostgreSQL API |
| `/oracle-service` | Attestation microservice for external platform results |
| `/contracts`    | Clarity smart contracts (escrow, settlement, oracles) |
| `/db`           | Schema definitions & migrations |
| `/docs`         | Architecture, whitepaper, timelines |

---

## 🛠️ Development Commands

```bash
# Install all dependencies
npm install

# Run individual services
npm run dev:frontend
npm run dev:backend
npm run dev:oracle
npm run dev:contracts

# Or run backend + frontend + oracle together
npm run dev:all
````

---

## 🗺️ Roadmap Phases

| Phase           | On-chain                   | Off-chain                   | Oracle                         |
| --------------- | -------------------------- | --------------------------- | ------------------------------ |
| **Basic (MVP)** | STX escrow + settlement    | Manual investment tracking  | Manual attestation             |
| **Medium**      | SIP-010 stablecoin support | Mock API integrations       | Automated oracle               |
| **Complex**     | Tokenized pool shares      | Real brokers / betting APIs | Multi-sig decentralized oracle |

---

## ✨ Credits

Built with **Stacks**, **Clarity**, **TypeScript**, **Vite**, and **PostgreSQL**.

---

```

---

✅ This completes **Chunk 1 (Root Setup)**.  
Next, I will generate **folder scaffolding for each `/frontend`, `/backend`, `/oracle-service`, `/contracts`, `/db`, and `/docs` — each with their own README placeholders.**

---

👉 **Reply with `continue`** when you’re ready for **Chunk 2 (Service-level READMEs & Directory Scaffolding).**
```
✅ Continuing with **PART A – Chunk 2: Service-Level Folder Scaffolding + README Templates**

---

# 📁 PART A — CHUNK 2: Service Directory Structure + READMEs

Create the following files and folders in each service directory.

---

## 📦 `/frontend` — Vite + React + TypeScript + CSS Modules + stacks.js

```
frontend/
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ public/
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes/
│  │  ├─ Home.tsx
│  │  ├─ Groups.tsx
│  │  ├─ GroupDetail.tsx
│  │  ├─ CreateGroup.tsx
│  │  ├─ WalletConnect.tsx
│  │  └─ Admin.tsx
│  ├─ components/
│  ├─ lib/stacks/
│  ├─ lib/api.ts
│  ├─ hooks/
│  ├─ stores/
│  ├─ styles/
│  └─ assets/
└─ README.frontend.md
```

### 📄 `/frontend/README.frontend.md`

````md
# Frontend (Vite + React + TypeScript + stacks.js)

This frontend app handles the **user interface, wallet authentication, group creation, and settlement UX**.

---

## 🚀 Tech Stack

| Layer       | Tool |
|-------------|------|
| Framework   | React + TypeScript |
| Bundler     | Vite |
| Styling     | CSS Modules |
| Wallet Auth | `@stacks/connect` (Hiro Wallet) |
| Routing     | React Router |
| API Calls   | Axios / Fetch wrapper |

---

## 📌 Key UI Pages

| Route         | Description |
|---------------|-------------|
| `/`           | Landing Page |
| `/groups`     | Browse public groups |
| `/group/:id`  | Group detail + join status |
| `/create`     | Create group form |
| `/wallet`     | Connect wallet screen |
| `/admin`      | (Restricted) Admin settlement tools |

---

## 🛠️ Commands

```bash
npm install
npm run dev
npm run build
````

---

```

---

## 🔧 `/backend` — Node.js + Express + PostgreSQL + TS

```

backend/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts
│  ├─ app.ts
│  ├─ config/
│  ├─ controllers/
│  ├─ services/
│  ├─ integrations/
│  ├─ db/
│  ├─ middlewares/
│  ├─ models/
│  └─ jobs/
└─ README.backend.md

````

### 📄 `/backend/README.backend.md`

```md
# Backend (Node.js + Express + PostgreSQL)

This is the primary **API layer** for users, groups, settlements, and metadata.  
It **does not handle oracle attestations directly** — that is delegated to `/oracle-service`.

---

## 📌 Responsibilities

- User and Group CRUD
- Membership tracking
- Synchronizing Clarity events (via Stacks API polling)
- Webhook endpoint for Oracle attestations
- Basic admin controls (force settle, view logs)

---

## 🛠️ Commands

```bash
npm install
npm run dev
npm run build
````

---

## 🗂️ Directory Structure

| Folder          | Purpose                                      |
| --------------- | -------------------------------------------- |
| `controllers/`  | HTTP route handlers                          |
| `services/`     | Business logic                               |
| `integrations/` | External API connectors (Binance mock, etc.) |
| `db/`           | Migrations + SQL client setup                |
| `jobs/`         | Scheduled jobs (sync oracles / cleanup)      |

---

```

---

## 🔮 `/oracle-service` — Off-chain Oracle Microservice

```

oracle-service/
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ index.ts
│  ├─ services/
│  ├─ feeds/
│  ├─ signer/
│  ├─ api/
│  └─ jobs/
└─ README.oracle.md

````

### 📄 `/oracle-service/README.oracle.md`

```md
# Oracle Service (Off-chain Attestation Engine)

This service **fetches external platform results (Binance, brokers, mock APIs)** and **produces signed attestations** for **on-chain settlement**.

---

## 📌 Modes

| Mode | Description |
|------|-------------|
| Manual | CLI or Dashboard triggers attestation |
| Automatic | Scheduler fetches & publishes to backend or directly to Clarity |

---

## 🔑 Security

- Private keys stored securely (Vault/Env in Dev)
- Accepts **POST /publish** only from backend

---

## 🛠️ Commands

```bash
npm install
npm run dev
````

---

```

---

## 📜 `/contracts` — Clarity Smart Contracts (Managed via Clarinet)

```

contracts/
├─ Clarinet.toml
├─ src/
│  ├─ group-factory.clar
│  ├─ escrow-stx.clar
│  ├─ escrow-sip010.clar
│  ├─ settlement.clar
│  ├─ oracle-registry.clar
│  └─ sip010-mock-token.clar
├─ tests/
│  └─ test-settlement.ts
└─ README.contracts.md

````

### 📄 `/contracts/README.contracts.md`

```md
# Clarity Smart Contracts (Pooled Escrow + Oracle Settlement)

This folder tracks **all Clarity modules** and their **test cases** (Clarinet).

---

## 📦 Contract Modules

| File | Purpose |
|------|---------|
| `group-factory.clar` | Creates groups and links them to escrow contracts |
| `escrow-stx.clar` | STX deposit + withdrawal logic |
| `escrow-sip010.clar` | Same as above but for fungible tokens |
| `settlement.clar` | Accepts attestation and releases final payout |
| `oracle-registry.clar` | Whitelisted oracle addresses |
| `sip010-mock-token.clar` | Mock stablecoin for testing phase |

---

## 🧪 Testing

```bash
clarinet test
````

---

```

---

✅ **This concludes Chunk 2.**

Next, I will scaffold:

---

### 📂 `/db` — Schema Diagrams & Migration Placeholder  
### 📂 `/docs` — Architecture / Whitepaper Prep  
### 📂 `/scripts` — Dev Utilities  

---

👉 **Reply with `continue` to move ahead to Chunk 3.**
```
✅ Continuing with **PART A — Chunk 3: Database, Docs & Scripts Structure**

---

## 🗄️ `/db` — PostgreSQL Schema & Migration Setup

```
db/
├─ migrations/
│  ├─ 0001_initial_schema.sql
│  ├─ 0002_add_oracle_tables.sql
│  └─ ...
├─ seed/
│  ├─ seed-dev.sql
├─ diagrams/
│  ├─ schema.v1.png
│  ├─ schema.v1.drawio
├─ README.db.md
```

### 📄 `/db/README.db.md`

````md
# Database (PostgreSQL Schema & Migrations)

This folder contains:

✅ **SQL migrations** — applied via backend service at startup or using a migration CLI  
✅ **Seed data** — mock users, mock groups (for development)  
✅ **Diagrams** — visual ERD (Entity Relationship Diagram)

---

## 🧱 Core Entities (Subject to Expansion)

| Table | Purpose |
|--------|---------|
| users | Wallet-linked user accounts |
| groups | Pooled investment circles |
| group_members | Membership & deposit status |
| deposits | User → contract escrow tracking |
| settlements | Result distribution |
| oracle_attestations | Off-chain feeds submitted by oracle-service |

---

## 📦 Migrations Workflow

```bash
# apply all migration files
psql -U user -d database -f migrations/0001_initial_schema.sql
````

Future improvement: Integrate a migration runner like **dbmate** or **node-pg-migrate**.

---

```

---

## 📚 `/docs` — Whitepaper / Architecture / Pitch Deck Prep

```

docs/
├─ whitepaper.md
├─ architecture.md
├─ api-reference.md
├─ stacks-ascend-proposal.md
└─ roadmap.md

````

### 📄 Suggested Content for `/docs/architecture.md`

```md
# System Architecture

````

(Diagrams + explanation of on-chain/off-chain interactions, oracle flow, etc.)

---

## 🧰 `/scripts` — Dev Utilities (Optional but Recommended)

```
scripts/
├─ setup-dev.sh
├─ reset-db.sh
├─ generate-keys.js
├─ mock-oracle-publish.js
└─ README.scripts.md
```

---

✅ **PART A Summary Completed**

We have now defined the **entire monorepo project layout** covering:

✔ Folder Structure
✔ README Templates
✔ Service Isolation (Backend & Oracle Separate)
✔ Contract Module Layout
✔ DB & Docs Scaffolding

---

# 🔽 Next Up — PART B (as promised)

## **Clarity Contract Skeletons + Clarinet Project Initialization**

This will include:

| Contract               | Responsibility                           |
| ---------------------- | ---------------------------------------- |
| `group-factory.clar`   | Registers a new pooled group             |
| `escrow-stx.clar`      | Handles STX deposits/withdrawals         |
| `escrow-sip010.clar`   | Handles SIP-010 token deposits           |
| `settlement.clar`      | Accepts oracle attestation & distributes |
| `oracle-registry.clar` | Whitelisted Oracle identities            |

I will scaffold:

✅ `Clarinet.toml`
✅ Basic module files with **function stubs only** (no business logic yet)
✅ 1 test example for `escrow-stx`

---

👉 **Reply `"Start Part B"` and I’ll deliver the contract skeletons.**

Ready when you are.
