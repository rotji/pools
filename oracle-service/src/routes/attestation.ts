import { Router, Request, Response } from 'express';
import { AttestationService } from '../services/attestation';
import { StacksService } from '../services/stacks';
import { ValidationService } from '../validation/security';
import { logger } from '../utils/logger';
import { asyncHandler, createError } from '../middleware/errorHandler';

export interface AttestationRequest {
  groupId: number;
  totalValue: number;
  proofData?: string;
  manualOverride?: boolean;
}

export interface SettlementRequest {
  groupId: number;
  skipValidation?: boolean;
}

export function createAttestationRoutes(
  attestationService: AttestationService,
  stacksService: StacksService,
  validationService: ValidationService
): Router {
  const router = Router();

  // Middleware for request logging
  router.use((req, res, next) => {
    logger.info(`Attestation API: ${req.method} ${req.path}`, {
      body: req.body,
      query: req.query
    });
    next();
  });

  /**
   * Start tracking an investment period for a group
   */
  router.post('/start-period', asyncHandler(async (req: Request, res: Response) => {
    const { groupId, durationDays = 30 } = req.body;

    if (!groupId || !Number.isInteger(groupId) || groupId <= 0) {
      throw createError('Invalid group ID', 400, 'INVALID_GROUP_ID');
    }

    if (!Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 365) {
      throw createError('Invalid duration: must be between 1 and 365 days', 400, 'INVALID_DURATION');
    }

    const investmentPeriod = await attestationService.startInvestmentPeriod(groupId, durationDays);

    res.json({
      success: true,
      data: {
        groupId: investmentPeriod.groupId,
        startDate: investmentPeriod.startDate,
        endDate: investmentPeriod.endDate,
        participantCount: investmentPeriod.participants.length,
        totalContributed: investmentPeriod.totalContributed,
        status: investmentPeriod.status
      },
      message: 'Investment period tracking started'
    });
  }));

  /**
   * Create and publish attestation for a group
   */
  router.post('/publish', asyncHandler(async (req: Request, res: Response) => {
    const { groupId, totalValue, proofData, manualOverride = false }: AttestationRequest = req.body;

    // Input validation
    if (!groupId || !Number.isInteger(groupId) || groupId <= 0) {
      throw createError('Invalid group ID', 400, 'INVALID_GROUP_ID');
    }

    if (!totalValue || !Number.isInteger(totalValue) || totalValue < 0) {
      throw createError('Invalid total value', 400, 'INVALID_TOTAL_VALUE');
    }

    // Check if oracle is authorized
    const oracleAddress = stacksService.getOracleAddress();
    const isAuthorized = await stacksService.isOracleRegistered(oracleAddress);

    if (!isAuthorized) {
      throw createError('Oracle is not registered on blockchain', 403, 'ORACLE_NOT_AUTHORIZED');
    }

    // Security checks (unless manual override by admin)
    if (!manualOverride) {
      const performanceData = { totalValue };
      const settlement = await attestationService.calculateSettlement(groupId, performanceData);
      
      // Create temporary attestation data for validation
      const tempAttestationData = {
        groupId: settlement.groupId,
        totalContributed: settlement.totalContributed,
        totalFinal: settlement.totalFinal,
        members: settlement.members,
        investmentPeriodEnd: new Date(),
        proofHash: 'temp'
      };

      const validationResult = validationService.validateAttestation(tempAttestationData);
      
      if (!validationResult.isValid) {
        throw createError(`Validation failed: ${validationResult.errors.join(', ')}`, 400, 'VALIDATION_FAILED');
      }

      // Security checks
      const securityChecks = validationService.performSecurityChecks(oracleAddress, tempAttestationData);
      const failedChecks = securityChecks.filter(check => !check.passed);
      
      if (failedChecks.length > 0) {
        throw createError(
          `Security checks failed: ${failedChecks.map(c => c.checkName).join(', ')}`,
          403,
          'SECURITY_CHECK_FAILED'
        );
      }
    }

    // Create and publish attestation
    const txId = await attestationService.createAndPublishAttestation(
      groupId,
      { totalValue },
      proofData
    );

    // Increment daily attestation count
    validationService.incrementDailyAttestationCount();

    res.json({
      success: true,
      data: {
        groupId,
        txId,
        totalValue,
        oracleAddress,
        timestamp: new Date().toISOString()
      },
      message: 'Attestation published successfully'
    });
  }));

  /**
   * Trigger settlement for a group
   */
  router.post('/settle', asyncHandler(async (req: Request, res: Response) => {
    const { groupId, skipValidation = false }: SettlementRequest = req.body;

    if (!groupId || !Number.isInteger(groupId) || groupId <= 0) {
      throw createError('Invalid group ID', 400, 'INVALID_GROUP_ID');
    }

    // Check if attestation exists
    const attestationHistory = attestationService.getGroupAttestationHistory(groupId);
    if (!attestationHistory) {
      throw createError('No attestation found for group', 404, 'ATTESTATION_NOT_FOUND');
    }

    // Additional validation if not skipped
    if (!skipValidation) {
      const oracleAddress = stacksService.getOracleAddress();
      const isAuthorized = await stacksService.isOracleRegistered(oracleAddress);

      if (!isAuthorized) {
        throw createError('Oracle is not registered on blockchain', 403, 'ORACLE_NOT_AUTHORIZED');
      }
    }

    // Trigger settlement
    const txId = await attestationService.settleGroup(groupId);

    res.json({
      success: true,
      data: {
        groupId,
        settlementTxId: txId,
        attestationData: attestationHistory,
        timestamp: new Date().toISOString()
      },
      message: 'Settlement triggered successfully'
    });
  }));

  /**
   * Get attestation history for a group
   */
  router.get('/history/:groupId', asyncHandler(async (req: Request, res: Response) => {
    const groupId = parseInt(req.params.groupId);

    if (!groupId || !Number.isInteger(groupId) || groupId <= 0) {
      throw createError('Invalid group ID', 400, 'INVALID_GROUP_ID');
    }

    const history = attestationService.getGroupAttestationHistory(groupId);

    if (!history) {
      res.json({
        success: true,
        data: null,
        message: 'No attestation history found for group'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        groupId: history.groupId,
        totalContributed: history.totalContributed,
        totalFinal: history.totalFinal,
        profitLoss: history.profitLoss,
        percentageReturn: ((history.totalFinal - history.totalContributed) / history.totalContributed * 100).toFixed(2) + '%',
        perMemberAmount: history.perMemberAmount,
        memberCount: history.members.length,
        members: history.members
      },
      message: 'Attestation history retrieved'
    });
  }));

  /**
   * Get active investment periods
   */
  router.get('/active-periods', asyncHandler(async (req: Request, res: Response) => {
    const activePeriods = attestationService.getActiveInvestmentPeriods();

    const periodsData = activePeriods.map(period => ({
      groupId: period.groupId,
      startDate: period.startDate,
      endDate: period.endDate,
      participantCount: period.participants.length,
      totalContributed: period.totalContributed,
      status: period.status,
      daysRemaining: Math.max(0, Math.ceil((period.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    }));

    res.json({
      success: true,
      data: {
        totalActive: periodsData.length,
        periods: periodsData,
        totalValue: periodsData.reduce((sum, p) => sum + p.totalContributed, 0)
      },
      message: 'Active investment periods retrieved'
    });
  }));

  /**
   * Get periods ready for settlement
   */
  router.get('/ready-for-settlement', asyncHandler(async (req: Request, res: Response) => {
    const readyPeriods = attestationService.getInvestmentPeriodsReadyForSettlement();

    const periodsData = readyPeriods.map(period => ({
      groupId: period.groupId,
      endDate: period.endDate,
      participantCount: period.participants.length,
      totalContributed: period.totalContributed,
      daysSinceEnd: Math.ceil((Date.now() - period.endDate.getTime()) / (1000 * 60 * 60 * 24))
    }));

    res.json({
      success: true,
      data: {
        totalReady: periodsData.length,
        periods: periodsData
      },
      message: 'Periods ready for settlement retrieved'
    });
  }));

  /**
   * Validate attestation data without publishing
   */
  router.post('/validate', asyncHandler(async (req: Request, res: Response) => {
    const { groupId, totalValue } = req.body;

    if (!groupId || !Number.isInteger(groupId) || groupId <= 0) {
      throw createError('Invalid group ID', 400, 'INVALID_GROUP_ID');
    }

    if (!totalValue || !Number.isInteger(totalValue) || totalValue < 0) {
      throw createError('Invalid total value', 400, 'INVALID_TOTAL_VALUE');
    }

    // Calculate settlement for validation
    const settlement = await attestationService.calculateSettlement(groupId, { totalValue });
    
    // Create attestation data for validation
    const attestationData = {
      groupId: settlement.groupId,
      totalContributed: settlement.totalContributed,
      totalFinal: settlement.totalFinal,
      members: settlement.members,
      investmentPeriodEnd: new Date(),
      proofHash: 'validation'
    };

    // Perform validation
    const validationResult = validationService.validateAttestation(attestationData);
    
    // Perform security checks
    const oracleAddress = stacksService.getOracleAddress();
    const securityChecks = validationService.performSecurityChecks(oracleAddress, attestationData);

    res.json({
      success: true,
      data: {
        validation: validationResult,
        security: {
          checks: securityChecks,
          allPassed: securityChecks.every(check => check.passed)
        },
        settlement: {
          groupId: settlement.groupId,
          totalContributed: settlement.totalContributed,
          totalFinal: settlement.totalFinal,
          profitLoss: settlement.profitLoss,
          perMemberAmount: settlement.perMemberAmount,
          memberCount: settlement.members.length
        }
      },
      message: 'Validation completed'
    });
  }));

  /**
   * Get attestation statistics
   */
  router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
    const activePeriods = attestationService.getActiveInvestmentPeriods();
    const dailyStats = validationService.getDailyAttestationStats();
    
    // Calculate some basic statistics
    const totalActiveValue = activePeriods.reduce((sum, period) => sum + period.totalContributed, 0);
    const averageGroupSize = activePeriods.length > 0 
      ? activePeriods.reduce((sum, period) => sum + period.participants.length, 0) / activePeriods.length 
      : 0;

    res.json({
      success: true,
      data: {
        activeInvestments: {
          count: activePeriods.length,
          totalValue: totalActiveValue,
          averageGroupSize: Math.round(averageGroupSize)
        },
        dailyAttestations: dailyStats,
        oracle: {
          address: stacksService.getOracleAddress(),
          registered: await stacksService.isOracleRegistered(stacksService.getOracleAddress())
        },
        security: validationService.getSecurityConfig()
      },
      message: 'Statistics retrieved'
    });
  }));

  return router;
}

export default createAttestationRoutes;