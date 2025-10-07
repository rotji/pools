# Oracle Service - Stacks Blockchain Investment Platform

A comprehensive oracle attestation service with heavy Stacks blockchain integration for investment tracking and settlement automation. This service serves as the crucial bridge between off-chain investment data and on-chain smart contracts for your pooled investment platform.

## �‍♂️ Quick Start (IMPORTANT!)

### ⚠️ Always run from the oracle-service directory to avoid path issues!

```bash
# 1. Navigate to oracle-service directory FIRST
cd oracle-service

# 2. Copy environment file (if not done already)
cp .env.example .env

# 3. Run in development mode
npm run dev
```

### Alternative startup methods:

**Option A: Windows Batch (run from anywhere)**
```cmd
oracle-service\start.bat
```

**Option B: PowerShell Script (run from anywhere)**
```powershell
oracle-service\start.ps1
```

**Option C: Direct command (fallback)**
```bash
# From oracle-service directory only
npx tsx watch ./src/index.ts
```

## �🎯 Overview

This oracle service is designed for the **Stacks Ascend program** with heavy dependency on Stacks blockchain infrastructure. It provides:

- **Real-time Investment Tracking**: Monitor investment periods and calculate performance
- **Automated Settlement**: Trigger smart contract settlements based on investment outcomes
- **Blockchain Integration**: Deep integration with Stacks blockchain and Clarity smart contracts
- **Security & Validation**: Comprehensive validation and security checks for all operations
- **External APIs**: Integration with financial data providers for market information

## 🏗️ Architecture

### Core Components

1. **StacksService** - Heavy Stacks blockchain integration
   - Contract calls and transaction management
   - Oracle registration and authorization
   - Blockchain state monitoring
   - Transaction confirmation handling

2. **AttestationService** - Investment tracking and settlement
   - Investment period management
   - Settlement calculations
   - Attestation creation and publishing
   - Historical data tracking

3. **ValidationService** - Security and data validation
   - Comprehensive attestation validation
   - Security checks and rate limiting
   - Mathematical consistency verification
   - Oracle authorization validation

4. **InvestmentDataService** - External API integration
   - Market data fetching (mock and real APIs)
   - Performance calculation
   - Historical data analysis

5. **SettlementScheduler** - Automation and monitoring
   - Automated settlement processing
   - Health checks and monitoring
   - Performance reporting

## 🚀 Stacks Integration Features

### Smart Contract Interaction
- **Oracle Registry**: Register and manage oracle authorization
- **Group Factory**: Retrieve group member information
- **Settlement Contract**: Trigger automated settlements
- **Escrow Contracts**: Monitor contribution and withdrawal flows

### Blockchain Operations
- **Transaction Broadcasting**: Submit attestations and settlements
- **Event Monitoring**: Listen for contract events
- **State Queries**: Read contract state and member data
- **Confirmation Tracking**: Wait for transaction confirmations

### Security Features
- **Oracle Authorization**: Verify oracle registration on-chain
- **Multi-signature Support**: Ready for multi-oracle configurations
- **Rate Limiting**: Prevent oracle abuse and spam
- **Value Bounds**: Enforce maximum attestation limits

## 📁 Project Structure

```
oracle-service/
├── src/
│   ├── index.ts                 # Main server entry point
│   ├── services/
│   │   ├── stacks.ts           # Stacks blockchain service
│   │   └── attestation.ts      # Attestation management
│   ├── apis/
│   │   └── investmentData.ts   # External API integrations
│   ├── validation/
│   │   └── security.ts         # Validation and security
│   ├── scheduler/
│   │   └── index.ts            # Automated settlement
│   ├── routes/
│   │   ├── attestation.ts      # Attestation API routes
│   │   └── validation.ts       # Validation API routes
│   ├── middleware/
│   │   └── errorHandler.ts     # Error handling
│   ├── utils/
│   │   └── logger.ts           # Logging utilities
│   └── tests/
│       └── integration.test.ts # Comprehensive tests
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── .env.example               # Environment configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- TypeScript 5+
- Stacks blockchain access (testnet/mainnet)
- Oracle private key for signing transactions

### Installation

1. **Install Dependencies**
   ```bash
   cd oracle-service
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Key Configuration Variables**
   ```env
   # Stacks Network
   STACKS_NETWORK=testnet
   ORACLE_PRIVATE_KEY=your_oracle_private_key_here
   
   # Contract Addresses
   ORACLE_REGISTRY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.oracle-registry
   GROUP_FACTORY_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.group-factory
   SETTLEMENT_CONTRACT=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.settlement
   
   # Security Settings
   MAX_ATTESTATION_VALUE=10000000
   MAX_DAILY_ATTESTATIONS=50
   ALLOWED_PROFIT_LOSS_RANGE=50
   ```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 🔗 API Endpoints

### Oracle Management
- `GET /health` - Service health check
- `GET /api/oracle/status` - Oracle status and registration
- `POST /api/oracle/register` - Register oracle on blockchain

### Attestation Management
- `POST /api/attestation/start-period` - Start investment period tracking
- `POST /api/attestation/publish` - Create and publish attestation
- `POST /api/attestation/settle` - Trigger group settlement
- `GET /api/attestation/history/:groupId` - Get attestation history
- `GET /api/attestation/active-periods` - Get active investment periods
- `GET /api/attestation/stats` - Get attestation statistics

### Validation & Security
- `POST /api/validation/attestation` - Validate attestation data
- `POST /api/validation/security` - Perform security checks
- `GET /api/validation/security/config` - Get security configuration
- `PUT /api/validation/security/config` - Update security settings

## 🔄 Automated Settlement Flow

1. **Investment Period Tracking**
   - Groups start investment periods
   - Oracle tracks participants and contributions
   - End dates monitored for settlement triggers

2. **Market Data Collection**
   - External APIs provide market performance data
   - Mock data available for development/testing
   - Historical data analysis for backtesting

3. **Settlement Calculation**
   - Calculate final values based on performance
   - Equal distribution among participants
   - Profit/loss allocation with proper rounding

4. **Attestation Creation**
   - Generate cryptographic proof of settlement
   - Validate all data before publication
   - Security checks and authorization verification

5. **Blockchain Publication**
   - Submit attestation to oracle-registry contract
   - Wait for transaction confirmation
   - Trigger settlement contract execution

6. **Settlement Execution**
   - Call settlement contract with attestation data
   - Enable member withdrawals
   - Record settlement completion

## 🛡️ Security Features

### Validation Layers
- **Input Validation**: Comprehensive data structure validation
- **Business Logic**: Investment rules and constraints
- **Mathematical Consistency**: Verify calculations and distributions
- **Blockchain State**: Verify on-chain authorization and state

### Security Controls
- **Rate Limiting**: Maximum attestations per day per oracle
- **Value Bounds**: Maximum attestation value limits
- **Profit/Loss Limits**: Acceptable return ranges
- **Oracle Authorization**: On-chain verification of oracle status

### Error Handling
- **Graceful Degradation**: Continue operation with partial failures
- **Comprehensive Logging**: Detailed operation tracking
- **Rollback Mechanisms**: Handle failed transactions
- **Alert Systems**: Notify on critical failures

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Individual service and function testing
- **Integration Tests**: End-to-end flow validation
- **Security Tests**: Validation and security feature testing
- **Performance Tests**: Load and stress testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- integration.test.ts
```

## 📊 Monitoring & Reporting

### Health Checks
- Stacks blockchain connectivity
- Oracle registration status
- Market data API availability
- Active investment tracking

### Performance Metrics
- Settlement processing time
- Transaction confirmation rates
- API response times
- Error rates and types

### Automated Reports
- Daily attestation statistics
- Weekly performance summaries
- Settlement success rates
- Security check failures

## 🔮 Stacks Ascend Program Compliance

This oracle service demonstrates heavy dependency on Stacks blockchain infrastructure:

### Core Stacks Dependencies
- **@stacks/transactions**: Transaction creation and broadcasting
- **@stacks/network**: Network configuration and connectivity  
- **@stacks/blockchain-api-client**: API interaction and event monitoring

### Smart Contract Integration
- **Direct Contract Calls**: Oracle registry, group factory, settlement
- **Event Monitoring**: Listen for contract state changes
- **Transaction Management**: Handle confirmations and retries

### Blockchain-First Architecture
- **On-chain Authorization**: Oracle permissions managed on blockchain
- **Immutable Attestations**: All settlements recorded on-chain
- **Decentralized Validation**: Multiple oracles can participate

## 🚀 Deployment

### Production Checklist
- [ ] Configure mainnet Stacks network
- [ ] Deploy smart contracts to mainnet
- [ ] Set up production API keys
- [ ] Configure monitoring and alerts
- [ ] Set up backup oracle instances
- [ ] Test emergency procedures

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 3003
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain comprehensive test coverage
3. Add proper error handling and logging
4. Update documentation for API changes
5. Verify Stacks integration functionality

## 📄 License

MIT License - see LICENSE file for details

---

**For Stacks Ascend Program**: This oracle service showcases heavy integration with Stacks blockchain infrastructure, demonstrating production-ready oracle functionality with comprehensive smart contract integration, automated settlement processing, and enterprise-grade security features.