# UnitedProfit 🎯

**United we invest. United we profit.**

## 🚨 IMPORTANT: Read This First!
**If commands fail or backend won't start → Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

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

## 🎨 Current Features (October 2025)

### ✅ Completed UI Components
- **🏠 Landing Page**: Hero section with "Invest Together. Win Together." tagline
- **📋 Groups List**: Browse and filter investment groups with search functionality
- **📊 Group Detail**: Comprehensive participant management and statistics dashboard
- **🎨 Design System**: "Futuristic Trust" theme with Electric Blue (#2563EB) and Emerald Green (#10B981)
- **� Mobile Responsive**: Optimized for all screen sizes with proper breakpoints

### 🎯 Key UI/UX Features
- **Glass Morphism Effects**: Modern frosted glass design with backdrop blur
- **Smart Navigation**: Functional routing between all major pages
- **Wallet Integration**: Ready for Hiro wallet connection
- **Risk Disclosure**: Legal compliance with comprehensive risk warnings
- **Participant Management**: Avatar-based member display with status tracking

## �🛠️ Technical Stack

- **Frontend**: Vite + React + TypeScript + CSS Modules
- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Blockchain**: Stacks + Clarity Smart Contracts
- **Authentication**: Hiro Wallet + stacks.js
- **Oracle Service**: Custom attestation system for off-chain data
- **Design**: Mobile-first responsive with glass morphism effects

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
- PostgreSQL (for future backend integration)
- Clarinet (for Clarity contract development)
- Hiro Wallet (for authentication)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/rotji/pools.git
cd pools

# Navigate to frontend and install dependencies
cd frontend
npm install

# Start the development server
npm run dev
# or
npx vite

# Open your browser to http://localhost:5173
```

### 🎮 Current Demo Features

You can currently test:
1. **Landing Page**: Beautiful hero section with modern design
2. **Groups List**: Browse 8 mock investment groups with filtering
3. **Group Detail**: Click "View Details" on any group to see:
   - Participant management with avatars
   - Group statistics and pool information
   - Join/leave functionality (mock)
   - Risk disclosure modal
4. **Mobile Testing**: Resize browser or test on mobile devices

### 🔧 Development Commands

```bash
# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Smart contracts (when ready)
cd contracts
clarinet test        # Run contract tests
clarinet check       # Check contract syntax
```

## 📋 Development Phases

### ✅ Phase 1: Basic MVP (COMPLETED)
- ✅ Monorepo structure setup
- ✅ Core tooling configuration (Vite, React, TypeScript, CSS Modules)
- ✅ Smart contract skeletons (Clarity contracts with Clarinet)
- ✅ Complete frontend UI implementation:
  - Landing page with hero section and "Futuristic Trust" design
  - Groups list with filtering and search functionality
  - Group detail page with participant management
  - Mobile-responsive design across all components
  - Glass morphism effects and modern animations

### 🚧 Phase 2: Frontend Enhancement (IN PROGRESS)
- 🚧 Create Public Group page (currently building)
- ⏳ Create Private Group page with invitation system
- ⏳ User profile page with tabs (Active/Past/Settings)
- ⏳ Enhanced wallet connection modal
- ⏳ Final mobile responsiveness audit

### 📅 Phase 3: Backend & Smart Contract Integration
- ⏳ Backend API infrastructure
- ⏳ Oracle automation service
- ⏳ Real smart contract deployment on Stacks testnet
- ⏳ Frontend-contract integration with stacks.js

### 🚀 Phase 4: Production Features
- ⏳ Multi-token support beyond STX
- ⏳ Real trading platform integrations
- ⏳ Advanced UI animations and gamification
- ⏳ Mainnet deployment and security audits

## 📱 Mobile Responsiveness

All components are built with **mobile-first design**:

- **Breakpoints**: 1024px (desktop), 768px (tablet), 480px (mobile)
- **Touch Optimization**: 44px minimum touch targets
- **Performance**: Optimized images and smooth animations
- **Accessibility**: Screen reader support and keyboard navigation
- **Cross-device Testing**: Verified on phones, tablets, and desktops

## ⚠️ Development Notes

**IMPORTANT**: VS Code integrated terminal has directory navigation issues. Always use relative paths from workspace root:

```bash
# ✅ Correct way to run commands
node backend/simple-demo-server.js    # Start backend
npm run dev --prefix frontend         # Start frontend  

# ❌ Wrong way (will fail)
cd backend && node simple-demo-server.js
```

📖 **See full details**: [VS Code Terminal Issue Documentation](./docs/vscode-terminal-issue.md)

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