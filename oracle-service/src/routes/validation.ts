import { Router, Request, Response } from 'express';
import { ValidationService } from '../validation/security';
import { logger } from '../utils/logger';
import { asyncHandler, createError } from '../middleware/errorHandler';

export interface ValidationRequest {
  data: any;
  type: 'attestation' | 'settlement' | 'general';
}

export function createValidationRoutes(validationService: ValidationService): Router {
  const router = Router();

  // Middleware for request logging
  router.use((req, res, next) => {
    logger.info(`Validation API: ${req.method} ${req.path}`, {
      body: req.body ? Object.keys(req.body) : [],
      query: req.query
    });
    next();
  });

  /**
   * Validate attestation data structure and content
   */
  router.post('/attestation', asyncHandler(async (req: Request, res: Response) => {
    const attestationData = req.body;

    if (!attestationData) {
      throw createError('No attestation data provided', 400, 'MISSING_DATA');
    }

    const validationResult = validationService.validateAttestation(attestationData);

    res.json({
      success: true,
      data: {
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        timestamp: new Date().toISOString()
      },
      message: validationResult.isValid ? 'Validation passed' : 'Validation failed'
    });
  }));

  /**
   * Perform security checks
   */
  router.post('/security', asyncHandler(async (req: Request, res: Response) => {
    const { oracleAddress, attestationData } = req.body;

    if (!oracleAddress || !attestationData) {
      throw createError('Oracle address and attestation data are required', 400, 'MISSING_PARAMETERS');
    }

    const securityChecks = validationService.performSecurityChecks(oracleAddress, attestationData);
    const allPassed = securityChecks.every(check => check.passed);

    res.json({
      success: true,
      data: {
        allPassed,
        checks: securityChecks,
        summary: {
          total: securityChecks.length,
          passed: securityChecks.filter(c => c.passed).length,
          failed: securityChecks.filter(c => !c.passed).length
        },
        timestamp: new Date().toISOString()
      },
      message: allPassed ? 'All security checks passed' : 'Some security checks failed'
    });
  }));

  /**
   * Get current security configuration
   */
  router.get('/security/config', asyncHandler(async (req: Request, res: Response) => {
    const config = validationService.getSecurityConfig();

    res.json({
      success: true,
      data: config,
      message: 'Security configuration retrieved'
    });
  }));

  /**
   * Update security configuration (admin only)
   */
  router.put('/security/config', asyncHandler(async (req: Request, res: Response) => {
    const newConfig = req.body;

    if (!newConfig || Object.keys(newConfig).length === 0) {
      throw createError('No configuration updates provided', 400, 'MISSING_CONFIG');
    }

    // Basic validation of config values
    const validKeys = [
      'maxAttestationValue',
      'minSettlementDelay',
      'maxDailyAttestations',
      'requiredConfirmations',
      'allowedProfitLossRange'
    ];

    const invalidKeys = Object.keys(newConfig).filter(key => !validKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw createError(`Invalid configuration keys: ${invalidKeys.join(', ')}`, 400, 'INVALID_CONFIG_KEYS');
    }

    // Validate config values
    if (newConfig.maxAttestationValue !== undefined && (typeof newConfig.maxAttestationValue !== 'number' || newConfig.maxAttestationValue <= 0)) {
      throw createError('maxAttestationValue must be a positive number', 400, 'INVALID_CONFIG_VALUE');
    }

    if (newConfig.minSettlementDelay !== undefined && (typeof newConfig.minSettlementDelay !== 'number' || newConfig.minSettlementDelay < 0)) {
      throw createError('minSettlementDelay must be a non-negative number', 400, 'INVALID_CONFIG_VALUE');
    }

    if (newConfig.maxDailyAttestations !== undefined && (typeof newConfig.maxDailyAttestations !== 'number' || newConfig.maxDailyAttestations <= 0)) {
      throw createError('maxDailyAttestations must be a positive number', 400, 'INVALID_CONFIG_VALUE');
    }

    if (newConfig.requiredConfirmations !== undefined && (typeof newConfig.requiredConfirmations !== 'number' || newConfig.requiredConfirmations < 1)) {
      throw createError('requiredConfirmations must be at least 1', 400, 'INVALID_CONFIG_VALUE');
    }

    if (newConfig.allowedProfitLossRange !== undefined && (typeof newConfig.allowedProfitLossRange !== 'number' || newConfig.allowedProfitLossRange < 0)) {
      throw createError('allowedProfitLossRange must be a non-negative number', 400, 'INVALID_CONFIG_VALUE');
    }

    validationService.updateSecurityConfig(newConfig);
    const updatedConfig = validationService.getSecurityConfig();

    res.json({
      success: true,
      data: updatedConfig,
      message: 'Security configuration updated successfully'
    });
  }));

  /**
   * Get daily attestation statistics
   */
  router.get('/stats/daily', asyncHandler(async (req: Request, res: Response) => {
    const dailyStats = validationService.getDailyAttestationStats();

    res.json({
      success: true,
      data: dailyStats,
      message: 'Daily attestation statistics retrieved'
    });
  }));

  /**
   * Validate Stacks address format
   */
  router.post('/address', asyncHandler(async (req: Request, res: Response) => {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      throw createError('Address is required and must be a string', 400, 'INVALID_ADDRESS_FORMAT');
    }

    // Basic Stacks address validation
    const stacksAddressRegex = /^S[TPMN][0-9A-Z]{38,39}$/;
    const isValid = stacksAddressRegex.test(address);

    res.json({
      success: true,
      data: {
        address,
        isValid,
        format: isValid ? 'Valid Stacks address' : 'Invalid Stacks address format',
        network: address.startsWith('SP') || address.startsWith('SM') ? 'mainnet' : 
                 address.startsWith('ST') || address.startsWith('SN') ? 'testnet' : 'unknown'
      },
      message: isValid ? 'Address is valid' : 'Address is invalid'
    });
  }));

  /**
   * Validate group member data
   */
  router.post('/members', asyncHandler(async (req: Request, res: Response) => {
    const { members } = req.body;

    if (!members || !Array.isArray(members)) {
      throw createError('Members must be an array', 400, 'INVALID_MEMBERS_FORMAT');
    }

    const validationResults = members.map((member, index) => {
      const errors: string[] = [];
      
      // Validate address
      if (!member.address || typeof member.address !== 'string') {
        errors.push('Address is required and must be a string');
      } else {
        const stacksAddressRegex = /^S[TPMN][0-9A-Z]{38,39}$/;
        if (!stacksAddressRegex.test(member.address)) {
          errors.push('Invalid Stacks address format');
        }
      }

      // Validate contribution
      if (!Number.isInteger(member.contribution) || member.contribution <= 0) {
        errors.push('Contribution must be a positive integer');
      }

      // Validate final amount
      if (!Number.isInteger(member.finalAmount) || member.finalAmount < 0) {
        errors.push('Final amount must be a non-negative integer');
      }

      return {
        index,
        address: member.address,
        isValid: errors.length === 0,
        errors
      };
    });

    const validMembers = validationResults.filter(result => result.isValid).length;
    const invalidMembers = validationResults.filter(result => !result.isValid).length;

    // Check for duplicate addresses
    const addresses = members.map(m => m.address).filter(addr => addr);
    const uniqueAddresses = new Set(addresses);
    const hasDuplicates = addresses.length !== uniqueAddresses.size;

    res.json({
      success: true,
      data: {
        totalMembers: members.length,
        validMembers,
        invalidMembers,
        hasDuplicates,
        validationResults,
        summary: {
          totalContribution: members.reduce((sum, m) => sum + (Number.isInteger(m.contribution) ? m.contribution : 0), 0),
          totalFinalAmount: members.reduce((sum, m) => sum + (Number.isInteger(m.finalAmount) ? m.finalAmount : 0), 0)
        }
      },
      message: `Validation completed: ${validMembers}/${members.length} members valid`
    });
  }));

  /**
   * Validate mathematical consistency of settlement data
   */
  router.post('/math', asyncHandler(async (req: Request, res: Response) => {
    const { totalContributed, totalFinal, members } = req.body;

    if (!Number.isInteger(totalContributed) || totalContributed <= 0) {
      throw createError('totalContributed must be a positive integer', 400, 'INVALID_TOTAL_CONTRIBUTED');
    }

    if (!Number.isInteger(totalFinal) || totalFinal < 0) {
      throw createError('totalFinal must be a non-negative integer', 400, 'INVALID_TOTAL_FINAL');
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      throw createError('members must be a non-empty array', 400, 'INVALID_MEMBERS');
    }

    const checks = {
      contributionSum: {
        expected: totalContributed,
        actual: members.reduce((sum, m) => sum + (Number.isInteger(m.contribution) ? m.contribution : 0), 0),
        matches: false
      },
      finalAmountSum: {
        expected: totalFinal,
        actual: members.reduce((sum, m) => sum + (Number.isInteger(m.finalAmount) ? m.finalAmount : 0), 0),
        matches: false
      },
      equalDistribution: {
        expectedPerMember: Math.floor(totalFinal / members.length),
        remainder: totalFinal % members.length,
        isCorrect: false
      }
    };

    // Check sums
    checks.contributionSum.matches = Math.abs(checks.contributionSum.actual - checks.contributionSum.expected) <= 1;
    checks.finalAmountSum.matches = Math.abs(checks.finalAmountSum.actual - checks.finalAmountSum.expected) <= 1;

    // Check equal distribution
    const expectedAmount = checks.equalDistribution.expectedPerMember;
    const remainder = checks.equalDistribution.remainder;
    
    let exactCount = 0;
    let plusOneCount = 0;
    
    for (const member of members) {
      if (member.finalAmount === expectedAmount) {
        exactCount++;
      } else if (member.finalAmount === expectedAmount + 1) {
        plusOneCount++;
      }
    }

    checks.equalDistribution.isCorrect = 
      exactCount === (members.length - remainder) && plusOneCount === remainder;

    const allChecksPass = 
      checks.contributionSum.matches && 
      checks.finalAmountSum.matches && 
      checks.equalDistribution.isCorrect;

    res.json({
      success: true,
      data: {
        allChecksPass,
        checks,
        profitLoss: totalFinal - totalContributed,
        percentageReturn: ((totalFinal - totalContributed) / totalContributed * 100).toFixed(2) + '%'
      },
      message: allChecksPass ? 'All mathematical checks passed' : 'Some mathematical checks failed'
    });
  }));

  return router;
}

export default createValidationRoutes;