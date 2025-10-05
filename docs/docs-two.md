# Technical Blueprint ΓÇö Monorepo & System Architecture

*Ready-to-use structure for the Group Pooling Platform (Stacks + off-chain integrations). Includes separate Backend and Oracle services, frontend (Vite + React + TS + CSS Modules), Clarity contracts, and PostgreSQL schema. Grouped by Basic / Medium / Complex phases.*

---

## ≡ƒÜ¿ Bold Platform Disclaimer (show in README & UI)

**DISCLAIMER:** This platform is not financial advice. Participation involves risk, including possible total loss of funds. Settlement occurs only after external platforms release funds; the platform is not liable for external holds or freezes. Users must comply with local laws. KYC/AML required.

---

# 1 ΓÇö Monorepo (GitHub) Top-level Layout

```
/group-pooling-platform
Γö£ΓöÇ /frontend                # Vite + React + TypeScript + CSS Modules + stacks.js
Γö£ΓöÇ /backend                 # Main backend API (Node.js + Express + TypeScript)
Γö£ΓöÇ /oracle-service          # Independent oracle microservice (Node.js + TypeScript)
Γö£ΓöÇ /contracts               # Clarity contracts + tests (Clarinet)
Γö£ΓöÇ /db                      # Migrations, seeds, ER diagrams
Γö£ΓöÇ /infra                   # Terraform / CloudFormation / k8s manifests (optional)
Γö£ΓöÇ /scripts                 # Useful dev scripts (start-all, test-all, lint)
Γö£ΓöÇ /docs                    # Product docs, onboarding, architecture docs
Γö£ΓöÇ .github                  # CI workflows (GitHub Actions)
Γö£ΓöÇ README.md
ΓööΓöÇ package.json (workspace) # optional, set up as monorepo (pnpm/yarn workspaces)
```

> Use pnpm / yarn workspaces or npm workspaces to manage packages and shared utils.

---

# 2 ΓÇö Frontend Structure (Vite + React + TS + CSS Modules + stacks.js)

```
/frontend
Γö£ΓöÇ package.json
Γö£ΓöÇ vite.config.ts
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ public/
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ main.tsx
Γöé  Γö£ΓöÇ App.tsx
Γöé  Γö£ΓöÇ index.css             # global resets (minimal)
Γöé  Γö£ΓöÇ routes/
Γöé  Γöé  Γö£ΓöÇ Home.tsx
Γöé  Γöé  Γö£ΓöÇ Groups.tsx
Γöé  Γöé  Γö£ΓöÇ GroupDetail.tsx
Γöé  Γöé  Γö£ΓöÇ CreateGroup.tsx
Γöé  Γöé  Γö£ΓöÇ WalletConnect.tsx
Γöé  Γöé  ΓööΓöÇ Admin.tsx
Γöé  Γö£ΓöÇ components/
Γöé  Γöé  Γö£ΓöÇ ui/
Γöé  Γöé  Γöé  Γö£ΓöÇ Button/ Button.module.css
Γöé  Γöé  Γöé  Γö£ΓöÇ Modal/
Γöé  Γöé  Γöé  ΓööΓöÇ Card/
Γöé  Γöé  Γö£ΓöÇ GroupList/
Γöé  Γöé  ΓööΓöÇ ConnectWallet/
Γöé  Γö£ΓöÇ lib/
Γöé  Γöé  Γö£ΓöÇ api.ts             # backend API wrapper (fetch/axios)
Γöé  Γöé  ΓööΓöÇ stacks/            # stacks.js helpers (auth, contract calls)
Γöé  Γö£ΓöÇ hooks/
Γöé  Γö£ΓöÇ stores/               # optional: Zustand / Redux
Γöé  Γö£ΓöÇ styles/               # shared CSS Modules variables (if any)
Γöé  ΓööΓöÇ assets/
Γö£ΓöÇ tests/                   # frontend tests (Vitest + Testing Library)
ΓööΓöÇ README.frontend.md
```

**Notes / Responsibilities**

* `lib/stacks/` contains stacks.js auth flows (Hiro Wallet integration), tx helpers, and contract call wrappers.
* Use CSS Modules for all component styling.
* Routes map to group lifecycle views: create ΓåÆ join ΓåÆ deposit (sign tx) ΓåÆ trade (embedded or redirect) ΓåÆ view settlement.

---

# 3 ΓÇö Backend (Node.js + Express + TypeScript)

```
/backend
Γö£ΓöÇ package.json
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ index.ts               # server bootstrap
Γöé  Γö£ΓöÇ app.ts                 # express app
Γöé  Γö£ΓöÇ config/
Γöé  Γöé  ΓööΓöÇ index.ts            # env config loader
Γöé  Γö£ΓöÇ controllers/
Γöé  Γöé  Γö£ΓöÇ auth.controller.ts
Γöé  Γöé  Γö£ΓöÇ groups.controller.ts
Γöé  Γöé  Γö£ΓöÇ users.controller.ts
Γöé  Γöé  ΓööΓöÇ admin.controller.ts
Γöé  Γö£ΓöÇ services/
Γöé  Γöé  Γö£ΓöÇ group.service.ts
Γöé  Γöé  Γö£ΓöÇ settlement.service.ts
Γöé  Γöé  Γö£ΓöÇ integration.service.ts  # adapters to external APIs (pluggable)
Γöé  Γöé  ΓööΓöÇ notifications.service.ts
Γöé  Γö£ΓöÇ integrations/
Γöé  Γöé  Γö£ΓöÇ crypto/
Γöé  Γöé  Γöé  ΓööΓöÇ binance.client.ts
Γöé  Γöé  ΓööΓöÇ mock/
Γöé  Γö£ΓöÇ db/
Γöé  Γöé  Γö£ΓöÇ index.ts            # pg client / knex / prisma
Γöé  Γöé  ΓööΓöÇ migrations/
Γöé  Γö£ΓöÇ models/                 # TypeScript interfaces/types
Γöé  Γö£ΓöÇ middlewares/
Γöé  Γö£ΓöÇ utils/
Γöé  ΓööΓöÇ jobs/                   # scheduled reconciliation, sync workers
Γö£ΓöÇ tests/
ΓööΓöÇ README.backend.md
```

**Backend responsibilities**

* Primary API for frontend (user profiles, group metadata, membership CRUD, off-chain account linking).
* Persist audit trail of on-chain events (watch Stacks events via API).
* Manage admin operations (force-settle, manual verifications).
* Provide adapter pattern (`/integrations`) so new exchange connectors can be added easily.
* Provide webhooks endpoint for the Oracle service to post attestations and updates.

---

# 4 ΓÇö Oracle Service (Independent microservice)

```
/oracle-service
Γö£ΓöÇ package.json
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ index.ts               # bootstrap
Γöé  Γö£ΓöÇ config/
Γöé  Γö£ΓöÇ services/
Γöé  Γöé  Γö£ΓöÇ attestation.service.ts   # builds signed attestations
Γöé  Γöé  Γö£ΓöÇ feeds.service.ts         # connectors to external APIs (binance, coinGecko)
Γöé  Γöé  ΓööΓöÇ verifier.service.ts      # verify external signatures if using user-signed proofs
Γöé  Γö£ΓöÇ integrations/
Γöé  Γö£ΓöÇ signer/
Γöé  Γöé  ΓööΓöÇ key-management.ts    # sign attestations with oracle key(s)
Γöé  Γö£ΓöÇ api/
Γöé  Γöé  ΓööΓöÇ publish.controller.ts  # endpoint to push attestation to backend or directly to Stacks
Γöé  Γö£ΓöÇ jobs/                   # scheduled price aggregations / reconciliation
Γöé  ΓööΓöÇ utils/
Γö£ΓöÇ tests/
ΓööΓöÇ README.oracle.md
```

**Oracle Responsibilities & Modes**

* **Fetch Mode:** poll/exchange APIs to fetch final balances/withdrawable status for an account.
* **Aggregate Mode:** combine multiple data sources and produce deterministic `total_final` numbers.
* **Sign Mode:** sign attestation payloads with oracle private key(s) (Ed25519 / secp256k1 based on scheme).
* **Publish Mode:** either publish attestations to backend (which calls Clarity via a privileged wallet) **or** publish directly to a Stacks oracle account (via stacks.js on server).
* **Security:** keys stored in a secrets manager (HashiCorp Vault / AWS Secrets Manager); limit IP and role access; rotate keys.

---

# 5 ΓÇö Clarity Contracts Folder Layout & Responsibilities

```
/contracts
Γö£ΓöÇ Clarinet.toml
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ group-factory.clar         # create groups meta, emits events for escrow creation
Γöé  Γö£ΓöÇ escrow-stx.clar            # escrow contract for STX deposits
Γöé  Γö£ΓöÇ escrow-sip010.clar         # placeholder/compatible interface for FT tokens (SIP-010)
Γöé  Γö£ΓöÇ settlement.clar            # settlement logic: accept attestations & compute per-member share
Γöé  Γö£ΓöÇ oracle-registry.clar       # whitelist oracle principals, manage oracle keys/roles
Γöé  ΓööΓöÇ sip010-mock-token.clar     # mock token used in medium tests
Γö£ΓöÇ tests/
Γöé  ΓööΓöÇ clarinet-tests.ts
ΓööΓöÇ docs/                         # contract docs & ABI interface
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

# 6 ΓÇö PostgreSQL Schema (Entities & Relationships ΓÇö conceptual)

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

# 7 ΓÇö Environment & Secrets (example env vars per service)

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

# 8 ΓÇö CI / CD, Testing & Deployment Notes

* Use GitHub Actions:

  * `ci/frontend.yml` ΓÇö install, lint, test, build (for preview)
  * `ci/backend.yml` ΓÇö typescript build, unit tests, db migrations
  * `ci/contracts.yml` ΓÇö run `clarinet test` and fail on errors (Stacks Ascent requirement)
* Staging: Deploy to testnet Stacks; use testnet keys.
* Production: require audited contracts and legal review before mainnet.
* Deployment targets: AWS ECS/Fargate, or Vercel for frontend, GCP Cloud Run for backend/oracle, or Kubernetes.

---

# 9 ΓÇö Observability, Security & Compliance

* Monitoring: Prometheus + Grafana or Datadog; Sentry for exceptions.
* Logging: centralized (CloudWatch / ELK), store audit logs immutably.
* Secrets: AWS Secrets Manager / HashiCorp Vault.
* KYC: integrate Onfido / Jumio; store KYC status only, raw PII in secure storage.
* Pen-tests before production; Clarity contract audits required for mainnet.

---

# 10 ΓÇö Mapping to ROADMAP PHASES (Basic / Medium / Complex)

### Basic (MVP) ΓÇö deliverables in structure

* Frontend routes, stacks.js wallet connect, group create/join flows.
* Clarity: `group-factory`, `escrow-stx`, `settlement` (manual oracle/admin attestation).
* Backend: minimal API for metadata, webhook to mirror on-chain events, PostgreSQL basic schema.
* Oracle-service: **manual mode** ΓÇö operator triggers attestations (no external data connectors).
* Tests: Clarinet tests + unit tests for settlement math.

### Medium ΓÇö deliverables in structure

* Oracle-service: automated connector to free APIs (CoinGecko, Binance public endpoints) + signing + publishing.
* Backend: integration.service adapters (mock exchange connectors), scheduled jobs.
* Clarity: add `escrow-sip010`, `sip010-mock-token`.
* Frontend: richer dashboard, trading simulator (paper trading), admin panel.

### Complex ΓÇö deliverables in structure

* Full exchange integrations (Alpaca, OANDA, licensed betting APIs), custody partners (Fireblocks).
* Decentralized oracle network (multi-signer attestations, majority verification on chain).
* Advanced on-chain tooling: tokenized pool shares, on-chain governance (DAO).
* Full compliance (SOC2), multi-region deployment, mobile apps.

---

# 11 ΓÇö Recommended Next Immediate Actions (practical)

1. Create monorepo and initialize workspaces (pnpm/yarn).
2. Scaffold `frontend`, `backend`, `oracle-service`, and `contracts` folders with README stubs.
3. Implement Clarinet contract skeletons and run `clarinet check` immediately (required for Stacks Ascent).
4. Wire up a demo: simple frontend that creates a testnet group, user deposits STX into `escrow-stx`, admin settles with manual oracle attestation, users withdraw ΓÇö use this demo for the Ascent application.

---

If you want, I can now **generate the README-style blueprint files** for each subproject (frontend/backend/oracle/contracts) with this exact structure, plus sample `package.json` suggestions and `npm` scripts (still no production code).

Would you like me to:

* A) Generate README + folder skeleton files for the whole monorepo now?
* B) Start by generating Clarinet contract skeletons and tests (so you can run `clarinet check`)?

Choose **A** or **B** and IΓÇÖll produce the artifacts immediately.
Γ£à Understood. I will now begin **PART A ΓÇö Monorepo Structure + Root Configuration + README Templates**.

Because of length limits, **I will deliver it in multiple chunks**.
**Do not worry ΓÇö I will stop when needed and prompt you to reply `continue` so I can resume.**

---

# ≡ƒº▒ PART A ΓÇö MONOREPO ROOT STRUCTURE & BASE FILES (CHUNK 1)

Below is the **root folder structure** and **root-level `package.json` setup with npm workspaces**.

---

### ≡ƒôü Folder Layout (Create these at the project root)

```
group-pooling-platform/
Γö£ΓöÇ backend/
Γö£ΓöÇ oracle-service/
Γö£ΓöÇ frontend/
Γö£ΓöÇ contracts/
Γö£ΓöÇ db/
Γö£ΓöÇ docs/
Γö£ΓöÇ scripts/
Γö£ΓöÇ .github/
Γöé  ΓööΓöÇ workflows/    # (for CI/CD YAML later)
Γö£ΓöÇ README.md
ΓööΓöÇ package.json      # (npm workspaces config here)
```

---

### ≡ƒôä Root `package.json` (npm workspaces enabled)

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

> Γ£à This allows you to run **workspaces** with `npm` just like Yarn/PNPM.

---

### ≡ƒôä Root `README.md` (High-level overview)

Create `/README.md` with the following template:

````md
# Group Pooling Platform (Stacks + Oracles + Risk-Sharing)

> A decentralized platform where users form groups, deposit equal funds, invest independently, and **share all profits/losses equally** ΓÇö enforced via **Clarity smart contracts** and **off-chain oracle attestations**.

---

## ≡ƒÜ¿ Disclaimer

**This platform does not provide financial advice.**
Users participate at their own risk. Settlement occurs only after **external platforms release funds**. The platform is **not liable for exchange freezes or delays**.

---

## ≡ƒôª Monorepo Services

| Folder          | Description |
|----------------|-------------|
| `/frontend`     | Vite + React + TypeScript + stacks.js wallet auth |
| `/backend`      | Node.js + Express + PostgreSQL API |
| `/oracle-service` | Attestation microservice for external platform results |
| `/contracts`    | Clarity smart contracts (escrow, settlement, oracles) |
| `/db`           | Schema definitions & migrations |
| `/docs`         | Architecture, whitepaper, timelines |

---

## ≡ƒ¢á∩╕Å Development Commands

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

## ≡ƒù║∩╕Å Roadmap Phases

| Phase           | On-chain                   | Off-chain                   | Oracle                         |
| --------------- | -------------------------- | --------------------------- | ------------------------------ |
| **Basic (MVP)** | STX escrow + settlement    | Manual investment tracking  | Manual attestation             |
| **Medium**      | SIP-010 stablecoin support | Mock API integrations       | Automated oracle               |
| **Complex**     | Tokenized pool shares      | Real brokers / betting APIs | Multi-sig decentralized oracle |

---

## Γ£¿ Credits

Built with **Stacks**, **Clarity**, **TypeScript**, **Vite**, and **PostgreSQL**.

---

```

---

Γ£à This completes **Chunk 1 (Root Setup)**.  
Next, I will generate **folder scaffolding for each `/frontend`, `/backend`, `/oracle-service`, `/contracts`, `/db`, and `/docs` ΓÇö each with their own README placeholders.**

---

≡ƒæë **Reply with `continue`** when youΓÇÖre ready for **Chunk 2 (Service-level READMEs & Directory Scaffolding).**
```
Γ£à Continuing with **PART A ΓÇô Chunk 2: Service-Level Folder Scaffolding + README Templates**

---

# ≡ƒôü PART A ΓÇö CHUNK 2: Service Directory Structure + READMEs

Create the following files and folders in each service directory.

---

## ≡ƒôª `/frontend` ΓÇö Vite + React + TypeScript + CSS Modules + stacks.js

```
frontend/
Γö£ΓöÇ package.json
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ vite.config.ts
Γö£ΓöÇ public/
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ main.tsx
Γöé  Γö£ΓöÇ App.tsx
Γöé  Γö£ΓöÇ routes/
Γöé  Γöé  Γö£ΓöÇ Home.tsx
Γöé  Γöé  Γö£ΓöÇ Groups.tsx
Γöé  Γöé  Γö£ΓöÇ GroupDetail.tsx
Γöé  Γöé  Γö£ΓöÇ CreateGroup.tsx
Γöé  Γöé  Γö£ΓöÇ WalletConnect.tsx
Γöé  Γöé  ΓööΓöÇ Admin.tsx
Γöé  Γö£ΓöÇ components/
Γöé  Γö£ΓöÇ lib/stacks/
Γöé  Γö£ΓöÇ lib/api.ts
Γöé  Γö£ΓöÇ hooks/
Γöé  Γö£ΓöÇ stores/
Γöé  Γö£ΓöÇ styles/
Γöé  ΓööΓöÇ assets/
ΓööΓöÇ README.frontend.md
```

### ≡ƒôä `/frontend/README.frontend.md`

````md
# Frontend (Vite + React + TypeScript + stacks.js)

This frontend app handles the **user interface, wallet authentication, group creation, and settlement UX**.

---

## ≡ƒÜÇ Tech Stack

| Layer       | Tool |
|-------------|------|
| Framework   | React + TypeScript |
| Bundler     | Vite |
| Styling     | CSS Modules |
| Wallet Auth | `@stacks/connect` (Hiro Wallet) |
| Routing     | React Router |
| API Calls   | Axios / Fetch wrapper |

---

## ≡ƒôî Key UI Pages

| Route         | Description |
|---------------|-------------|
| `/`           | Landing Page |
| `/groups`     | Browse public groups |
| `/group/:id`  | Group detail + join status |
| `/create`     | Create group form |
| `/wallet`     | Connect wallet screen |
| `/admin`      | (Restricted) Admin settlement tools |

---

## ≡ƒ¢á∩╕Å Commands

```bash
npm install
npm run dev
npm run build
````

---

```

---

## ≡ƒöº `/backend` ΓÇö Node.js + Express + PostgreSQL + TS

```

backend/
Γö£ΓöÇ package.json
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ index.ts
Γöé  Γö£ΓöÇ app.ts
Γöé  Γö£ΓöÇ config/
Γöé  Γö£ΓöÇ controllers/
Γöé  Γö£ΓöÇ services/
Γöé  Γö£ΓöÇ integrations/
Γöé  Γö£ΓöÇ db/
Γöé  Γö£ΓöÇ middlewares/
Γöé  Γö£ΓöÇ models/
Γöé  ΓööΓöÇ jobs/
ΓööΓöÇ README.backend.md

````

### ≡ƒôä `/backend/README.backend.md`

```md
# Backend (Node.js + Express + PostgreSQL)

This is the primary **API layer** for users, groups, settlements, and metadata.  
It **does not handle oracle attestations directly** ΓÇö that is delegated to `/oracle-service`.

---

## ≡ƒôî Responsibilities

- User and Group CRUD
- Membership tracking
- Synchronizing Clarity events (via Stacks API polling)
- Webhook endpoint for Oracle attestations
- Basic admin controls (force settle, view logs)

---

## ≡ƒ¢á∩╕Å Commands

```bash
npm install
npm run dev
npm run build
````

---

## ≡ƒùé∩╕Å Directory Structure

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

## ≡ƒö« `/oracle-service` ΓÇö Off-chain Oracle Microservice

```

oracle-service/
Γö£ΓöÇ package.json
Γö£ΓöÇ tsconfig.json
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ index.ts
Γöé  Γö£ΓöÇ services/
Γöé  Γö£ΓöÇ feeds/
Γöé  Γö£ΓöÇ signer/
Γöé  Γö£ΓöÇ api/
Γöé  ΓööΓöÇ jobs/
ΓööΓöÇ README.oracle.md

````

### ≡ƒôä `/oracle-service/README.oracle.md`

```md
# Oracle Service (Off-chain Attestation Engine)

This service **fetches external platform results (Binance, brokers, mock APIs)** and **produces signed attestations** for **on-chain settlement**.

---

## ≡ƒôî Modes

| Mode | Description |
|------|-------------|
| Manual | CLI or Dashboard triggers attestation |
| Automatic | Scheduler fetches & publishes to backend or directly to Clarity |

---

## ≡ƒöæ Security

- Private keys stored securely (Vault/Env in Dev)
- Accepts **POST /publish** only from backend

---

## ≡ƒ¢á∩╕Å Commands

```bash
npm install
npm run dev
````

---

```

---

## ≡ƒô£ `/contracts` ΓÇö Clarity Smart Contracts (Managed via Clarinet)

```

contracts/
Γö£ΓöÇ Clarinet.toml
Γö£ΓöÇ src/
Γöé  Γö£ΓöÇ group-factory.clar
Γöé  Γö£ΓöÇ escrow-stx.clar
Γöé  Γö£ΓöÇ escrow-sip010.clar
Γöé  Γö£ΓöÇ settlement.clar
Γöé  Γö£ΓöÇ oracle-registry.clar
Γöé  ΓööΓöÇ sip010-mock-token.clar
Γö£ΓöÇ tests/
Γöé  ΓööΓöÇ test-settlement.ts
ΓööΓöÇ README.contracts.md

````

### ≡ƒôä `/contracts/README.contracts.md`

```md
# Clarity Smart Contracts (Pooled Escrow + Oracle Settlement)

This folder tracks **all Clarity modules** and their **test cases** (Clarinet).

---

## ≡ƒôª Contract Modules

| File | Purpose |
|------|---------|
| `group-factory.clar` | Creates groups and links them to escrow contracts |
| `escrow-stx.clar` | STX deposit + withdrawal logic |
| `escrow-sip010.clar` | Same as above but for fungible tokens |
| `settlement.clar` | Accepts attestation and releases final payout |
| `oracle-registry.clar` | Whitelisted oracle addresses |
| `sip010-mock-token.clar` | Mock stablecoin for testing phase |

---

## ≡ƒº¬ Testing

```bash
clarinet test
````

---

```

---

Γ£à **This concludes Chunk 2.**

Next, I will scaffold:

---

### ≡ƒôé `/db` ΓÇö Schema Diagrams & Migration Placeholder  
### ≡ƒôé `/docs` ΓÇö Architecture / Whitepaper Prep  
### ≡ƒôé `/scripts` ΓÇö Dev Utilities  

---

≡ƒæë **Reply with `continue` to move ahead to Chunk 3.**
```
Γ£à Continuing with **PART A ΓÇö Chunk 3: Database, Docs & Scripts Structure**

---

## ≡ƒùä∩╕Å `/db` ΓÇö PostgreSQL Schema & Migration Setup

```
db/
Γö£ΓöÇ migrations/
Γöé  Γö£ΓöÇ 0001_initial_schema.sql
Γöé  Γö£ΓöÇ 0002_add_oracle_tables.sql
Γöé  ΓööΓöÇ ...
Γö£ΓöÇ seed/
Γöé  Γö£ΓöÇ seed-dev.sql
Γö£ΓöÇ diagrams/
Γöé  Γö£ΓöÇ schema.v1.png
Γöé  Γö£ΓöÇ schema.v1.drawio
Γö£ΓöÇ README.db.md
```

### ≡ƒôä `/db/README.db.md`

````md
# Database (PostgreSQL Schema & Migrations)

This folder contains:

Γ£à **SQL migrations** ΓÇö applied via backend service at startup or using a migration CLI  
Γ£à **Seed data** ΓÇö mock users, mock groups (for development)  
Γ£à **Diagrams** ΓÇö visual ERD (Entity Relationship Diagram)

---

## ≡ƒº▒ Core Entities (Subject to Expansion)

| Table | Purpose |
|--------|---------|
| users | Wallet-linked user accounts |
| groups | Pooled investment circles |
| group_members | Membership & deposit status |
| deposits | User ΓåÆ contract escrow tracking |
| settlements | Result distribution |
| oracle_attestations | Off-chain feeds submitted by oracle-service |

---

## ≡ƒôª Migrations Workflow

```bash
# apply all migration files
psql -U user -d database -f migrations/0001_initial_schema.sql
````

Future improvement: Integrate a migration runner like **dbmate** or **node-pg-migrate**.

---

```

---

## ≡ƒôÜ `/docs` ΓÇö Whitepaper / Architecture / Pitch Deck Prep

```

docs/
Γö£ΓöÇ whitepaper.md
Γö£ΓöÇ architecture.md
Γö£ΓöÇ api-reference.md
Γö£ΓöÇ stacks-ascend-proposal.md
ΓööΓöÇ roadmap.md

````

### ≡ƒôä Suggested Content for `/docs/architecture.md`

```md
# System Architecture

````

(Diagrams + explanation of on-chain/off-chain interactions, oracle flow, etc.)

---

## ≡ƒº░ `/scripts` ΓÇö Dev Utilities (Optional but Recommended)

```
scripts/
Γö£ΓöÇ setup-dev.sh
Γö£ΓöÇ reset-db.sh
Γö£ΓöÇ generate-keys.js
Γö£ΓöÇ mock-oracle-publish.js
ΓööΓöÇ README.scripts.md
```

---

Γ£à **PART A Summary Completed**

We have now defined the **entire monorepo project layout** covering:

Γ£ö Folder Structure
Γ£ö README Templates
Γ£ö Service Isolation (Backend & Oracle Separate)
Γ£ö Contract Module Layout
Γ£ö DB & Docs Scaffolding

---

# ≡ƒö╜ Next Up ΓÇö PART B (as promised)

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

Γ£à `Clarinet.toml`
Γ£à Basic module files with **function stubs only** (no business logic yet)
Γ£à 1 test example for `escrow-stx`

---

≡ƒæë **Reply `"Start Part B"` and IΓÇÖll deliver the contract skeletons.**

Ready when you are.
