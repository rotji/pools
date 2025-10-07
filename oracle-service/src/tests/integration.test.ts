import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import { StacksService } from '../services/stacks';
import { AttestationService } from '../services/attestation';
import { ValidationService } from '../validation/security';
import { StacksTestnet } from '@stacks/network';

// Mock data for testing
const mockGroupId = 1;
const mockOracleAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const mockTotalValue = 1000000;

const mockMembers = [
  {
    address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    contribution: 100000,
    finalAmount: 110000
  },
  {
    address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    contribution: 100000,
    finalAmount: 110000
  }
];

const mockAttestationData = {
  groupId: mockGroupId,
  totalContributed: 200000,
  totalFinal: 220000,
  members: mockMembers,
  investmentPeriodEnd: new Date(),
  proofHash: 'test-proof-hash'
};

describe('Oracle Service Integration Tests', () => {
  let stacksService: StacksService;
  let attestationService: AttestationService;
  let validationService: ValidationService;

  beforeAll(async () => {
    // Initialize services with test configuration
    const testNetwork = new StacksTestnet();
    
    // Mock environment variables for testing
    process.env.ORACLE_PRIVATE_KEY = 'test-private-key-for-testing-only';
    process.env.ORACLE_REGISTRY_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.oracle-registry';
    process.env.GROUP_FACTORY_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.group-factory';
    
    stacksService = new StacksService(testNetwork);
    attestationService = new AttestationService(stacksService);
    validationService = new ValidationService();

    // Mock external dependencies
    jest.spyOn(stacksService, 'getNetworkInfo').mockResolvedValue({
      burn_block_height: 100000,
      burn_block_time: Date.now() / 1000,
      burn_block_time_iso: new Date().toISOString()
    });

    jest.spyOn(stacksService, 'isOracleRegistered').mockResolvedValue(true);
    jest.spyOn(stacksService, 'getGroupMembers').mockResolvedValue(mockMembers);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('StacksService', () => {
    test('should initialize with correct oracle address', () => {
      const oracleAddress = stacksService.getOracleAddress();
      expect(oracleAddress).toBeDefined();
      expect(typeof oracleAddress).toBe('string');
    });

    test('should check network connection', async () => {
      const networkInfo = await stacksService.getNetworkInfo();
      expect(networkInfo).toBeDefined();
      expect(networkInfo.burn_block_height).toBeGreaterThan(0);
    });

    test('should check oracle registration status', async () => {
      const isRegistered = await stacksService.isOracleRegistered(mockOracleAddress);
      expect(typeof isRegistered).toBe('boolean');
    });

    test('should validate contract addresses format', () => {
      expect(process.env.ORACLE_REGISTRY_CONTRACT).toMatch(/^ST[0-9A-Z]+\.[a-z-]+$/);
      expect(process.env.GROUP_FACTORY_CONTRACT).toMatch(/^ST[0-9A-Z]+\.[a-z-]+$/);
    });
  });

  describe('AttestationService', () => {
    test('should start investment period tracking', async () => {
      const period = await attestationService.startInvestmentPeriod(mockGroupId, 30);
      
      expect(period).toBeDefined();
      expect(period.groupId).toBe(mockGroupId);
      expect(period.status).toBe('ACTIVE');
      expect(period.participants).toEqual(mockMembers);
      expect(period.endDate).toBeInstanceOf(Date);
    });

    test('should calculate settlement correctly', async () => {
      await attestationService.startInvestmentPeriod(mockGroupId, 30);
      
      const settlement = await attestationService.calculateSettlement(
        mockGroupId, 
        { totalValue: mockTotalValue }
      );

      expect(settlement).toBeDefined();
      expect(settlement.groupId).toBe(mockGroupId);
      expect(settlement.totalFinal).toBe(mockTotalValue);
      expect(settlement.members).toHaveLength(mockMembers.length);
      
      // Verify equal distribution
      const expectedPerMember = Math.floor(mockTotalValue / mockMembers.length);
      settlement.members.forEach(member => {
        expect(member.finalAmount).toBeCloseTo(expectedPerMember, 0);
      });
    });

    test('should get active investment periods', () => {
      const activePeriods = attestationService.getActiveInvestmentPeriods();
      expect(Array.isArray(activePeriods)).toBe(true);
    });

    test('should identify periods ready for settlement', () => {
      const readyPeriods = attestationService.getInvestmentPeriodsReadyForSettlement();
      expect(Array.isArray(readyPeriods)).toBe(true);
    });
  });

  describe('ValidationService', () => {
    test('should validate correct attestation data', () => {
      const result = validationService.validateAttestation(mockAttestationData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid group ID', () => {
      const invalidData = { ...mockAttestationData, groupId: -1 };
      const result = validationService.validateAttestation(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('group ID'))).toBe(true);
    });

    test('should reject invalid member data', () => {
      const invalidData = { 
        ...mockAttestationData, 
        members: [{ address: 'invalid', contribution: -100, finalAmount: -50 }]
      };
      const result = validationService.validateAttestation(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should validate mathematical consistency', () => {
      const result = validationService.validateAttestation(mockAttestationData);
      
      expect(result.isValid).toBe(true);
      
      // Check that member contributions sum to total
      const memberContributionSum = mockAttestationData.members.reduce(
        (sum, member) => sum + member.contribution, 0
      );
      expect(memberContributionSum).toBe(mockAttestationData.totalContributed);
      
      // Check that member final amounts sum to total
      const memberFinalSum = mockAttestationData.members.reduce(
        (sum, member) => sum + member.finalAmount, 0
      );
      expect(memberFinalSum).toBe(mockAttestationData.totalFinal);
    });

    test('should perform security checks', () => {
      const securityChecks = validationService.performSecurityChecks(
        mockOracleAddress, 
        mockAttestationData
      );
      
      expect(Array.isArray(securityChecks)).toBe(true);
      expect(securityChecks.length).toBeGreaterThan(0);
      
      securityChecks.forEach(check => {
        expect(check).toHaveProperty('checkName');
        expect(check).toHaveProperty('passed');
        expect(typeof check.passed).toBe('boolean');
      });
    });

    test('should validate Stacks addresses', () => {
      const validAddresses = [
        'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE'
      ];
      
      const invalidAddresses = [
        'invalid-address',
        'ST123', // too short
        'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE123' // too long
      ];

      // This is an internal method, so we'll test via the validation
      validAddresses.forEach(address => {
        const testData = {
          ...mockAttestationData,
          members: [{ address, contribution: 100000, finalAmount: 110000 }]
        };
        const result = validationService.validateAttestation(testData);
        expect(result.errors.some(error => error.includes('address'))).toBe(false);
      });

      invalidAddresses.forEach(address => {
        const testData = {
          ...mockAttestationData,
          members: [{ address, contribution: 100000, finalAmount: 110000 }]
        };
        const result = validationService.validateAttestation(testData);
        expect(result.errors.some(error => error.includes('address'))).toBe(true);
      });
    });

    test('should track daily attestation counts', () => {
      const initialStats = validationService.getDailyAttestationStats();
      expect(initialStats).toHaveProperty('date');
      expect(initialStats).toHaveProperty('count');
      expect(initialStats).toHaveProperty('limit');
      
      validationService.incrementDailyAttestationCount();
      
      const updatedStats = validationService.getDailyAttestationStats();
      expect(updatedStats.count).toBe(initialStats.count + 1);
    });

    test('should update security configuration', () => {
      const originalConfig = validationService.getSecurityConfig();
      const newConfig = { maxDailyAttestations: 100 };
      
      validationService.updateSecurityConfig(newConfig);
      
      const updatedConfig = validationService.getSecurityConfig();
      expect(updatedConfig.maxDailyAttestations).toBe(100);
      expect(updatedConfig.maxAttestationValue).toBe(originalConfig.maxAttestationValue); // unchanged
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle complete attestation flow', async () => {
      // 1. Start investment period
      const period = await attestationService.startInvestmentPeriod(mockGroupId + 1, 30);
      expect(period.status).toBe('ACTIVE');

      // 2. Calculate settlement
      const settlement = await attestationService.calculateSettlement(
        mockGroupId + 1, 
        { totalValue: mockTotalValue }
      );
      expect(settlement).toBeDefined();

      // 3. Validate attestation data
      const attestationData = {
        groupId: settlement.groupId,
        totalContributed: settlement.totalContributed,
        totalFinal: settlement.totalFinal,
        members: settlement.members,
        investmentPeriodEnd: period.endDate,
        proofHash: 'integration-test-hash'
      };

      const validationResult = validationService.validateAttestation(attestationData);
      expect(validationResult.isValid).toBe(true);

      // 4. Perform security checks
      const securityChecks = validationService.performSecurityChecks(
        mockOracleAddress,
        attestationData
      );
      const allSecurityChecksPassed = securityChecks.every(check => check.passed);
      expect(allSecurityChecksPassed).toBe(true);
    });

    test('should handle edge cases in profit/loss calculations', async () => {
      await attestationService.startInvestmentPeriod(mockGroupId + 2, 30);

      // Test various profit/loss scenarios
      const scenarios = [
        { totalValue: 200000, description: 'break-even' },
        { totalValue: 250000, description: '25% profit' },
        { totalValue: 150000, description: '25% loss' },
        { totalValue: 100000, description: '50% loss' }
      ];

      for (const scenario of scenarios) {
        const settlement = await attestationService.calculateSettlement(
          mockGroupId + 2,
          { totalValue: scenario.totalValue }
        );

        expect(settlement.totalFinal).toBe(scenario.totalValue);
        expect(settlement.profitLoss).toBe(scenario.totalValue - settlement.totalContributed);

        // Validate equal distribution
        const memberFinalSum = settlement.members.reduce(
          (sum, member) => sum + member.finalAmount, 0
        );
        expect(memberFinalSum).toBe(scenario.totalValue);
      }
    });

    test('should handle large groups correctly', async () => {
      // Mock a larger group
      const largeGroupMembers = Array.from({ length: 20 }, (_, i) => ({
        address: `ST${i.toString().padStart(38, '0')}TESTADDR`,
        contribution: 50000,
        finalAmount: 0
      }));

      jest.spyOn(stacksService, 'getGroupMembers').mockResolvedValueOnce(largeGroupMembers);

      await attestationService.startInvestmentPeriod(mockGroupId + 3, 30);
      
      const settlement = await attestationService.calculateSettlement(
        mockGroupId + 3,
        { totalValue: 1100000 } // 10% profit on 1M total
      );

      expect(settlement.members).toHaveLength(20);
      
      // Verify equal distribution with proper remainder handling
      const expectedPerMember = Math.floor(1100000 / 20);
      const remainder = 1100000 % 20;
      
      let exactMatches = 0;
      let plusOneMatches = 0;
      
      settlement.members.forEach(member => {
        if (member.finalAmount === expectedPerMember) {
          exactMatches++;
        } else if (member.finalAmount === expectedPerMember + 1) {
          plusOneMatches++;
        }
      });

      expect(exactMatches + plusOneMatches).toBe(20);
      expect(plusOneMatches).toBe(remainder);
    });
  });
});