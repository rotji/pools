# UnitedProfit 🎯

**United we invest. United we profit.**

UnitedProfit is a decentralized group investment pooling platform where participants contribute equal amounts, invest in different assets, and share all profits and losses equally among group members.

## 🌟 Core Philosophy

> **"No one wins alone — we win or lose together."**
> 
> **"Transparency by design — every settlement is recorded on-chain."**
> 
> **"Platform acts as neutral arbiter, not as fund manager."**

## 🎯 How It Works

1. **Form Groups**: Create or join investment pools with equal contributions
2. **Invest Together**: Members invest in different assets (crypto, stocks, forex)
3. **Share Results**: All profits and losses are distributed equally among group members
4. **Transparent Settlement**: Smart contracts ensure fair, automatic payouts

## 🛠️ Technical Stack

- **Frontend**: Vite + React + TypeScript + CSS Modules
- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Blockchain**: Stacks + Clarity Smart Contracts
- **Authentication**: Hiro Wallet + stacks.js
- **Oracle Service**: Custom attestation system for off-chain data

## 📁 Monorepo Structure

```
/EquiPools
├─ /frontend                # Vite + React + TypeScript + CSS Modules + stacks.js
├─ /backend                 # Main backend API (Node.js + Express + TypeScript)
├─ /oracle-service          # Independent oracle microservice (Node.js + TypeScript)
├─ /contracts               # Clarity contracts + tests (Clarinet)
├─ /db                      # Migrations, seeds, ER diagrams
├─ /scripts                 # Useful dev scripts (start-all, test-all, lint)
├─ /frontend/docs           # Product docs, onboarding, architecture docs
├─ .github                  # CI workflows (GitHub Actions)
├─ README.md
└─ package.json (workspace) # Monorepo workspace management
```

## 🚨 Important Disclaimer

**This platform does NOT provide financial advice or investment recommendations.**

All participants understand that investing involves risk, including possible total loss of funds. Settlement occurs only after external platforms release funds; the platform is not liable for external holds or freezes. Users must comply with local laws.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Clarinet (for Clarity contract development)
- Hiro Wallet (for authentication)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/equipools.git
cd equipools

# Install dependencies for all services
npm run install:all

# Start all services in development mode
npm run dev:all

# Run tests
npm run test:all
```

## 📋 Development Phases

### Phase 1: Basic MVP
- [x] Monorepo structure
- [ ] Core tooling setup
- [ ] Smart contract skeletons
- [ ] Basic frontend with wallet connection
- [ ] Backend API infrastructure

### Phase 2: Medium Features
- [ ] Oracle automation
- [ ] Multi-token support
- [ ] Advanced UI/UX
- [ ] Real trading integrations

### Phase 3: Complex Production
- [ ] Multi-signature oracles
- [ ] Mobile apps
- [ ] Compliance framework
- [ ] Mainnet deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- [Documentation](./frontend/docs/)
- [Architecture Overview](./frontend/docs/docs%20two.md)
- [Developer Checklist](./frontend/docs/developerschecklist.md)
- [UI/UX Guidelines](./frontend/docs/UI%20UX.md)

---

**Built with ❤️ for the Stacks ecosystem**