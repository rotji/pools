# Smart Contract Test Suite

This directory contains comprehensive test suites for all smart contracts in the group investment pooling platform.

## Test Files

### 1. `integration_test.ts` 
**Main End-to-End Test**
- Complete workflow: create-group → join-group → publish-attestation → settle flow
- Tests the entire system integration
- Validates equal profit/loss distribution logic
- Tests error cases (unauthorized operations, invalid parameters)

### 2. `group_factory_test.ts`
**Group Management Tests**
- Group creation with various parameters
- Member joining functionality
- Group capacity limits and validation
- Duplicate member prevention
- Authorization checks

### 3. `oracle_registry_test.ts`
**Oracle System Tests**
- Oracle registration and authorization
- Attestation publishing and validation
- Settlement triggering mechanisms
- Unauthorized access prevention
- Multi-oracle support preparation

### 4. `escrow_stx_test.ts`
**STX Escrow Tests**
- STX contribution deposits
- Balance tracking and verification
- Group settlement distribution
- Withdrawal mechanisms
- Group total calculations

### 5. `settlement_test.ts`
**Settlement Logic Tests**
- Equal profit/loss distribution calculations
- Settlement finalization processes
- Individual claiming mechanisms
- Member settlement tracking
- Various profit/loss scenarios

### 6. `sip010_mock_token_test.ts`
**Token Functionality Tests**
- SIP-010 standard compliance
- Token metadata (name, symbol, decimals)
- Minting and burning operations
- Transfer functionality
- Authorization controls

## Running Tests

```bash
# Install dependencies
cd contracts
npm install

# Run all tests
npm test

# Run specific test file
npm test -- --filter integration_test

# Check contract syntax
clarinet check
```

## Test Coverage

The test suite covers:
- ✅ **Happy Path**: Complete successful workflow
- ✅ **Edge Cases**: Boundary conditions and limits
- ✅ **Error Handling**: Invalid inputs and unauthorized access
- ✅ **Business Logic**: Equal distribution calculations
- ✅ **Security**: Authorization and access controls
- ✅ **Standards**: SIP-010 token compliance

## Test Scenarios

### Core Flow Test (Integration)
1. Oracle registration by contract owner
2. Group creation by user
3. Multiple members joining group
4. Investment execution (simulated via oracle)
5. Oracle attestation of results
6. Automatic settlement calculation
7. Equal distribution of profits/losses
8. Individual withdrawal of settlements

### Security Tests
- Unauthorized oracle registration attempts
- Unauthorized attestation publishing
- Invalid group parameters
- Capacity limit enforcement
- Duplicate member prevention

### Economic Tests
- Profit scenarios (total gains > total invested)
- Loss scenarios (total gains < total invested)
- Break-even scenarios (total gains = total invested)
- Equal distribution verification across all scenarios