# UnitedProfit - Project Structure

## Monorepo Architecture

```
unitedprofit/
├── README.md                   # Main project documentation
├── package.json               # Workspace configuration
├── .gitignore                 # Git ignore rules
│
├── frontend/                   # React + TypeScript + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable UI components
│   │   │   └── features/      # Feature-specific components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API calls and external services
│   │   ├── utils/             # Helper functions
│   │   ├── types/             # TypeScript type definitions
│   │   ├── styles/            # CSS modules and global styles
│   │   └── assets/            # Images, icons, static files
│   ├── docs/                  # Frontend-specific documentation
│   ├── public/                # Public assets
│   └── package.json           # Frontend dependencies
│
├── backend/                    # Node.js + Express + PostgreSQL API
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Helper functions
│   │   └── types/             # TypeScript interfaces
│   ├── tests/                 # Backend test suites
│   └── package.json           # Backend dependencies
│
├── oracle-service/             # Oracle attestation service
│   ├── src/
│   │   ├── attestation/       # Attestation logic
│   │   ├── apis/              # External API integrations
│   │   └── validation/        # Data validation
│   ├── tests/                 # Oracle test suites
│   └── package.json           # Oracle service dependencies
│
├── contracts/                  # Stacks blockchain smart contracts
│   ├── src/                   # Clarity contract files
│   ├── tests/                 # Clarinet test files
│   └── Clarinet.toml          # Clarinet configuration
│
├── db/                        # Database related files
│   ├── migrations/            # Database schema migrations
│   └── seeds/                 # Sample data for development
│
├── docs/                      # Project documentation
│   ├── architecture.md        # System architecture
│   ├── api.md                 # API documentation
│   ├── smart-contracts.md     # Contract documentation
│   └── deployment.md          # Deployment guides
│
└── scripts/                   # Development and deployment scripts
    ├── deployment/            # Production deployment scripts
    └── dev/                   # Development utility scripts
```

## Key Technologies

- **Frontend**: Vite + React + TypeScript + CSS Modules
- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Blockchain**: Stacks + Clarity smart contracts
- **Oracle**: Custom attestation service
- **Database**: PostgreSQL with migrations
- **Testing**: Clarinet (contracts), Jest (backend), Vitest (frontend)

## Development Workflow

1. **Local Development**: Use `npm run dev` in root to start all services
2. **Testing**: Each workspace has its own test suite
3. **Deployment**: Automated scripts in `/scripts/deployment/`
4. **Database**: Migrations managed in `/db/migrations/`

## Getting Started

1. Install dependencies: `npm install`
2. Setup database: `npm run db:setup`
3. Start development servers: `npm run dev`
4. Run tests: `npm run test`