import { StacksService, AttestationData, GroupMember } from './stacks';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

export interface InvestmentPeriod {
  groupId: number;
  startDate: Date;
  endDate: Date;
  participants: GroupMember[];
  totalContributed: number;
  status: 'ACTIVE' | 'ENDED' | 'SETTLED';
}

export interface SettlementCalculation {
  groupId: number;
  totalContributed: number;
  totalFinal: number;
  profitLoss: number;
  perMemberAmount: number;
  members: GroupMember[];
}

export class AttestationService {
  private stacksService: StacksService;
  private activeInvestments: Map<number, InvestmentPeriod>;
  private settlementHistory: Map<number, SettlementCalculation>;

  constructor(stacksService: StacksService) {
    this.stacksService = stacksService;
    this.activeInvestments = new Map();
    this.settlementHistory = new Map();
    
    logger.info('AttestationService initialized');
  }

  /**
   * Start tracking a new investment period for a group
   */
  public async startInvestmentPeriod(
    groupId: number, 
    durationDays: number = 30
  ): Promise<InvestmentPeriod> {
    try {
      logger.info('Starting investment period tracking', { groupId, durationDays });

      // Get group members from blockchain
      const members = await this.stacksService.getGroupMembers(groupId);
      
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));
      
      const investmentPeriod: InvestmentPeriod = {
        groupId,
        startDate,
        endDate,
        participants: members,
        totalContributed: members.reduce((sum, member) => sum + member.contribution, 0),
        status: 'ACTIVE'
      };

      this.activeInvestments.set(groupId, investmentPeriod);
      
      logger.info('Investment period started', {
        groupId,
        memberCount: members.length,
        totalContributed: investmentPeriod.totalContributed,
        endDate: endDate.toISOString()
      });

      return investmentPeriod;
    } catch (error) {
      logger.error('Failed to start investment period:', error);
      throw createError('Failed to start investment period tracking', 500, 'INVESTMENT_PERIOD_ERROR');
    }
  }

  /**
   * Check which investment periods have ended and need settlement
   */
  public getInvestmentPeriodsReadyForSettlement(): InvestmentPeriod[] {
    const now = new Date();
    const readyForSettlement: InvestmentPeriod[] = [];

    for (const [groupId, period] of this.activeInvestments) {
      if (period.status === 'ACTIVE' && period.endDate <= now) {
        period.status = 'ENDED';
        readyForSettlement.push(period);
        logger.info('Investment period ended, ready for settlement', {
          groupId,
          endDate: period.endDate.toISOString()
        });
      }
    }

    return readyForSettlement;
  }

  /**
   * Calculate settlement amounts based on investment performance
   */
  public async calculateSettlement(
    groupId: number,
    actualPerformanceData: { totalValue: number }
  ): Promise<SettlementCalculation> {
    try {
      const investmentPeriod = this.activeInvestments.get(groupId);
      if (!investmentPeriod) {
        throw createError('Investment period not found', 404, 'PERIOD_NOT_FOUND');
      }

      logger.info('Calculating settlement', {
        groupId,
        totalContributed: investmentPeriod.totalContributed,
        actualValue: actualPerformanceData.totalValue
      });

      const totalContributed = investmentPeriod.totalContributed;
      const totalFinal = actualPerformanceData.totalValue;
      const profitLoss = totalFinal - totalContributed;
      
      // Calculate equal distribution based on final performance
      const memberCount = investmentPeriod.participants.length;
      const perMemberAmount = Math.floor(totalFinal / memberCount);

      // Update member final amounts
      const updatedMembers = investmentPeriod.participants.map(member => ({
        ...member,
        finalAmount: perMemberAmount
      }));

      const settlement: SettlementCalculation = {
        groupId,
        totalContributed,
        totalFinal,
        profitLoss,
        perMemberAmount,
        members: updatedMembers
      };

      this.settlementHistory.set(groupId, settlement);

      logger.info('Settlement calculated', {
        groupId,
        profitLoss,
        perMemberAmount,
        totalReturn: ((totalFinal / totalContributed - 1) * 100).toFixed(2) + '%'
      });

      return settlement;
    } catch (error) {
      logger.error('Failed to calculate settlement:', error);
      throw createError('Failed to calculate settlement', 500, 'SETTLEMENT_CALCULATION_ERROR');
    }
  }

  /**
   * Create and publish attestation to blockchain
   */
  public async createAndPublishAttestation(
    groupId: number,
    performanceData: { totalValue: number },
    proofData?: string
  ): Promise<string> {
    try {
      logger.info('Creating attestation for settlement', { groupId });

      // Calculate settlement
      const settlement = await this.calculateSettlement(groupId, performanceData);

      // Create proof hash (simplified for MVP)
      const proofHash = this.generateProofHash(settlement, proofData);

      // Prepare attestation data
      const attestationData: AttestationData = {
        groupId: settlement.groupId,
        totalContributed: settlement.totalContributed,
        totalFinal: settlement.totalFinal,
        members: settlement.members,
        investmentPeriodEnd: this.activeInvestments.get(groupId)?.endDate || new Date(),
        proofHash
      };

      // Publish to blockchain
      const txResult = await this.stacksService.publishAttestation(attestationData);

      // Update investment period status
      const period = this.activeInvestments.get(groupId);
      if (period) {
        period.status = 'SETTLED';
        this.activeInvestments.set(groupId, period);
      }

      logger.info('Attestation published successfully', {
        groupId,
        txId: txResult.txid,
        profitLoss: settlement.profitLoss
      });

      return txResult.txid;
    } catch (error) {
      logger.error('Failed to create and publish attestation:', error);
      throw createError('Failed to publish attestation', 500, 'ATTESTATION_CREATION_ERROR');
    }
  }

  /**
   * Automatically settle a group after attestation
   */
  public async settleGroup(groupId: number): Promise<string> {
    try {
      logger.info('Triggering automatic settlement', { groupId });

      const settlement = this.settlementHistory.get(groupId);
      if (!settlement) {
        throw createError('Settlement data not found', 404, 'SETTLEMENT_NOT_FOUND');
      }

      // Trigger settlement on blockchain
      const txResult = await this.stacksService.triggerSettlement(groupId);

      logger.info('Group settlement triggered', {
        groupId,
        txId: txResult.txid
      });

      return txResult.txid;
    } catch (error) {
      logger.error('Failed to settle group:', error);
      throw createError('Failed to settle group', 500, 'GROUP_SETTLEMENT_ERROR');
    }
  }

  /**
   * Get attestation history for a group
   */
  public getGroupAttestationHistory(groupId: number): SettlementCalculation | null {
    return this.settlementHistory.get(groupId) || null;
  }

  /**
   * Get all active investment periods
   */
  public getActiveInvestmentPeriods(): InvestmentPeriod[] {
    return Array.from(this.activeInvestments.values())
      .filter(period => period.status === 'ACTIVE');
  }

  /**
   * Validate attestation data before publishing
   */
  public validateAttestationData(attestationData: AttestationData): boolean {
    try {
      // Check required fields
      if (!attestationData.groupId || attestationData.groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      if (!attestationData.members || attestationData.members.length === 0) {
        throw new Error('No members provided');
      }

      if (attestationData.totalContributed <= 0) {
        throw new Error('Invalid total contributed amount');
      }

      if (attestationData.totalFinal < 0) {
        throw new Error('Invalid total final amount');
      }

      // Validate member data
      for (const member of attestationData.members) {
        if (!member.address || member.finalAmount < 0) {
          throw new Error(`Invalid member data for ${member.address}`);
        }
      }

      // Check that member final amounts sum correctly
      const memberTotalFinal = attestationData.members.reduce(
        (sum, member) => sum + member.finalAmount, 
        0
      );

      if (Math.abs(memberTotalFinal - attestationData.totalFinal) > 1) {
        throw new Error('Member final amounts do not sum to total final amount');
      }

      return true;
    } catch (error) {
      logger.error('Attestation validation failed:', error);
      return false;
    }
  }

  /**
   * Generate cryptographic proof hash for attestation
   */
  private generateProofHash(
    settlement: SettlementCalculation, 
    additionalData?: string
  ): string {
    // In a production system, this would include proper cryptographic signatures
    // For MVP, we'll use a simple hash of the settlement data
    const data = {
      groupId: settlement.groupId,
      totalContributed: settlement.totalContributed,
      totalFinal: settlement.totalFinal,
      timestamp: Date.now(),
      additionalData: additionalData || ''
    };

    // Simple hash implementation (in production, use proper crypto)
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Process scheduled settlements for ended investment periods
   */
  public async processScheduledSettlements(): Promise<void> {
    try {
      const readyPeriods = this.getInvestmentPeriodsReadyForSettlement();
      
      for (const period of readyPeriods) {
        try {
          logger.info('Processing scheduled settlement', { groupId: period.groupId });
          
          // In a real implementation, you would fetch actual performance data
          // For now, simulate some basic performance calculation
          const mockPerformanceData = await this.getMockPerformanceData(period.groupId);
          
          await this.createAndPublishAttestation(
            period.groupId, 
            mockPerformanceData,
            'scheduled_settlement'
          );

          // Trigger settlement after a brief delay
          setTimeout(async () => {
            try {
              await this.settleGroup(period.groupId);
            } catch (error) {
              logger.error('Failed to trigger scheduled settlement:', error);
            }
          }, 5000);

        } catch (error) {
          logger.error(`Failed to process settlement for group ${period.groupId}:`, error);
        }
      }
    } catch (error) {
      logger.error('Failed to process scheduled settlements:', error);
    }
  }

  /**
   * Mock performance data for development/testing
   */
  private async getMockPerformanceData(groupId: number): Promise<{ totalValue: number }> {
    const period = this.activeInvestments.get(groupId);
    if (!period) {
      throw new Error('Investment period not found');
    }

    // Simulate market performance (random between -20% to +30%)
    const performanceMultiplier = 0.8 + (Math.random() * 0.5); // 0.8 to 1.3
    const totalValue = Math.floor(period.totalContributed * performanceMultiplier);

    logger.info('Mock performance data generated', {
      groupId,
      originalValue: period.totalContributed,
      finalValue: totalValue,
      performance: ((performanceMultiplier - 1) * 100).toFixed(2) + '%'
    });

    return { totalValue };
  }
}