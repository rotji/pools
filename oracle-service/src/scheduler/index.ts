import * as cron from 'node-cron';
import { AttestationService } from '../services/attestation';
import { StacksService } from '../services/stacks';
import { InvestmentDataService } from '../apis/investmentData';
import { logger } from '../utils/logger';

export class SettlementScheduler {
  private attestationService: AttestationService;
  private stacksService: StacksService;
  private investmentDataService: InvestmentDataService;
  private scheduledTasks: Map<string, cron.ScheduledTask>;

  constructor(attestationService: AttestationService, stacksService: StacksService) {
    this.attestationService = attestationService;
    this.stacksService = stacksService;
    this.investmentDataService = new InvestmentDataService();
    this.scheduledTasks = new Map();

    logger.info('SettlementScheduler initialized');
  }

  /**
   * Start all scheduled tasks
   */
  public startScheduledTasks(): void {
    // Check for settlements every hour
    this.scheduleSettlementCheck();
    
    // Daily health check
    this.scheduleDailyHealthCheck();
    
    // Weekly performance report
    this.scheduleWeeklyReport();

    logger.info('All scheduled tasks started');
  }

  /**
   * Schedule periodic settlement checks
   */
  private scheduleSettlementCheck(): void {
    const task = cron.schedule('0 * * * *', async () => {
      logger.info('Running scheduled settlement check...');
      await this.processSettlements();
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.scheduledTasks.set('settlement-check', task);
    task.start();

    logger.info('Settlement check scheduled (every hour)');
  }

  /**
   * Schedule daily health check
   */
  private scheduleDailyHealthCheck(): void {
    const task = cron.schedule('0 9 * * *', async () => {
      logger.info('Running daily health check...');
      await this.performHealthCheck();
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.scheduledTasks.set('health-check', task);
    task.start();

    logger.info('Daily health check scheduled (9 AM daily)');
  }

  /**
   * Schedule weekly performance report
   */
  private scheduleWeeklyReport(): void {
    const task = cron.schedule('0 10 * * 1', async () => {
      logger.info('Running weekly performance report...');
      await this.generateWeeklyReport();
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.scheduledTasks.set('weekly-report', task);
    task.start();

    logger.info('Weekly report scheduled (10 AM every Monday)');
  }

  /**
   * Process settlements for investment periods that have ended
   */
  private async processSettlements(): Promise<void> {
    try {
      const readyPeriods = this.attestationService.getInvestmentPeriodsReadyForSettlement();
      
      if (readyPeriods.length === 0) {
        logger.debug('No investment periods ready for settlement');
        return;
      }

      logger.info(`Processing ${readyPeriods.length} investment periods for settlement`);

      for (const period of readyPeriods) {
        try {
          await this.processIndividualSettlement(period.groupId);
        } catch (error) {
          logger.error(`Failed to process settlement for group ${period.groupId}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error in settlement processing:', error);
    }
  }

  /**
   * Process settlement for an individual group
   */
  private async processIndividualSettlement(groupId: number): Promise<void> {
    try {
      logger.info(`Processing settlement for group ${groupId}`);

      // Get investment period data
      const activePeriods = this.attestationService.getActiveInvestmentPeriods();
      const period = activePeriods.find(p => p.groupId === groupId);
      
      if (!period) {
        logger.warn(`No active period found for group ${groupId}`);
        return;
      }

      // Calculate asset allocation (simplified for MVP)
      const assetAllocation = this.generateDefaultAssetAllocation(period.totalContributed);
      
      // Get current market performance
      const performanceResponse = await this.investmentDataService.calculateGroupPerformance(
        groupId,
        period.totalContributed,
        assetAllocation
      );

      if (!performanceResponse.success || !performanceResponse.data) {
        throw new Error('Failed to calculate group performance');
      }

      // Create and publish attestation
      const txId = await this.attestationService.createAndPublishAttestation(
        groupId,
        { totalValue: performanceResponse.data.totalValue },
        'automated_settlement'
      );

      logger.info(`Attestation published for group ${groupId}`, {
        txId,
        totalValue: performanceResponse.data.totalValue,
        profitLoss: performanceResponse.data.profitLoss
      });

      // Wait for attestation transaction to confirm before settling
      const confirmed = await this.stacksService.waitForTransaction(txId, 30000);
      
      if (confirmed) {
        // Trigger settlement after confirmation
        setTimeout(async () => {
          try {
            const settlementTxId = await this.attestationService.settleGroup(groupId);
            logger.info(`Settlement triggered for group ${groupId}`, { settlementTxId });
          } catch (error) {
            logger.error(`Failed to trigger settlement for group ${groupId}:`, error);
          }
        }, 5000);
      } else {
        logger.warn(`Attestation transaction not confirmed for group ${groupId}, skipping settlement`);
      }

    } catch (error) {
      logger.error(`Error processing settlement for group ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Generate default asset allocation for a group (simplified for MVP)
   */
  private generateDefaultAssetAllocation(totalValue: number): { [symbol: string]: number } {
    // Simple balanced portfolio for MVP
    const allocation = {
      'BTC': totalValue * 0.4,  // 40% Bitcoin
      'ETH': totalValue * 0.3,  // 30% Ethereum
      'STX': totalValue * 0.2,  // 20% Stacks
      'SOL': totalValue * 0.1   // 10% Solana
    };

    logger.debug('Generated default asset allocation', allocation);
    return allocation;
  }

  /**
   * Perform health check on oracle services
   */
  private async performHealthCheck(): Promise<void> {
    try {
      logger.info('Performing oracle health check...');

      const checks = {
        stacksConnection: false,
        oracleRegistration: false,
        marketDataApi: false,
        activeInvestments: 0
      };

      // Check Stacks connection
      try {
        await this.stacksService.getNetworkInfo();
        checks.stacksConnection = true;
      } catch (error) {
        logger.error('Stacks connection check failed:', error);
      }

      // Check oracle registration
      try {
        const oracleAddress = this.stacksService.getOracleAddress();
        checks.oracleRegistration = await this.stacksService.isOracleRegistered(oracleAddress);
      } catch (error) {
        logger.error('Oracle registration check failed:', error);
      }

      // Check market data API
      try {
        const marketData = await this.investmentDataService.getMarketData(['BTC', 'ETH']);
        checks.marketDataApi = marketData.success;
      } catch (error) {
        logger.error('Market data API check failed:', error);
      }

      // Count active investments
      checks.activeInvestments = this.attestationService.getActiveInvestmentPeriods().length;

      logger.info('Health check completed', checks);

      // Alert if critical services are down
      if (!checks.stacksConnection) {
        logger.error('CRITICAL: Stacks connection is down!');
      }

      if (!checks.oracleRegistration) {
        logger.warn('WARNING: Oracle is not registered on blockchain');
      }

    } catch (error) {
      logger.error('Health check failed:', error);
    }
  }

  /**
   * Generate weekly performance report
   */
  private async generateWeeklyReport(): Promise<void> {
    try {
      logger.info('Generating weekly performance report...');

      const activePeriods = this.attestationService.getActiveInvestmentPeriods();
      const totalActiveGroups = activePeriods.length;
      const totalActiveValue = activePeriods.reduce((sum, period) => sum + period.totalContributed, 0);

      // Get recent settlements
      const recentSettlements: any[] = [];
      for (let groupId = 1; groupId <= 10; groupId++) {
        const settlement = this.attestationService.getGroupAttestationHistory(groupId);
        if (settlement) {
          recentSettlements.push(settlement);
        }
      }

      const reportData = {
        period: 'Weekly Report',
        timestamp: new Date().toISOString(),
        activeGroups: totalActiveGroups,
        totalActiveValue,
        recentSettlements: recentSettlements.length,
        totalProfitLoss: recentSettlements.reduce((sum, s) => sum + s.profitLoss, 0),
        averageReturn: recentSettlements.length > 0 
          ? (recentSettlements.reduce((sum, s) => sum + (s.profitLoss / s.totalContributed), 0) / recentSettlements.length * 100)
          : 0
      };

      logger.info('Weekly performance report generated', reportData);

      // In production, this could send email reports, store in database, etc.

    } catch (error) {
      logger.error('Failed to generate weekly report:', error);
    }
  }

  /**
   * Stop all scheduled tasks
   */
  public stopAllTasks(): void {
    for (const [name, task] of this.scheduledTasks) {
      task.stop();
      logger.info(`Stopped scheduled task: ${name}`);
    }
    
    this.scheduledTasks.clear();
    logger.info('All scheduled tasks stopped');
  }

  /**
   * Get status of all scheduled tasks
   */
  public getTaskStatus(): { [taskName: string]: boolean } {
    const status: { [taskName: string]: boolean } = {};
    
    for (const [name] of this.scheduledTasks) {
      // For simplicity, assume tasks are running if they exist in the map
      status[name] = true;
    }
    
    return status;
  }

  /**
   * Manually trigger settlement check (for testing/admin use)
   */
  public async manualSettlementCheck(): Promise<void> {
    logger.info('Manual settlement check triggered');
    await this.processSettlements();
  }

  /**
   * Manually trigger health check (for testing/admin use)
   */
  public async manualHealthCheck(): Promise<void> {
    logger.info('Manual health check triggered');
    await this.performHealthCheck();
  }
}

/**
 * Configure and start scheduled tasks
 */
export function configureScheduledTasks(
  attestationService: AttestationService,
  stacksService: StacksService
): SettlementScheduler {
  const scheduler = new SettlementScheduler(attestationService, stacksService);
  
  // Start tasks if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    scheduler.startScheduledTasks();
  }
  
  return scheduler;
}