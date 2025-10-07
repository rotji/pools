import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { AttestationData, GroupMember } from '../services/stacks';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SecurityCheck {
  checkName: string;
  passed: boolean;
  details?: string;
}

export interface OracleSecurityConfig {
  maxAttestationValue: number;
  minSettlementDelay: number; // milliseconds
  maxDailyAttestations: number;
  requiredConfirmations: number;
  allowedProfitLossRange: number; // percentage
}

export class ValidationService {
  private securityConfig: OracleSecurityConfig;
  private dailyAttestationCount: Map<string, number>;
  private lastResetDate: string;

  constructor() {
    this.securityConfig = {
      maxAttestationValue: parseInt(process.env.MAX_ATTESTATION_VALUE || '10000000'), // 10M micro-STX
      minSettlementDelay: parseInt(process.env.MIN_SETTLEMENT_DELAY || '300000'), // 5 minutes
      maxDailyAttestations: parseInt(process.env.MAX_DAILY_ATTESTATIONS || '50'),
      requiredConfirmations: parseInt(process.env.REQUIRED_CONFIRMATIONS || '1'),
      allowedProfitLossRange: parseFloat(process.env.ALLOWED_PROFIT_LOSS_RANGE || '50') // ±50%
    };

    this.dailyAttestationCount = new Map();
    this.lastResetDate = new Date().toDateString();

    logger.info('ValidationService initialized', this.securityConfig);
  }

  /**
   * Comprehensive validation of attestation data
   */
  public validateAttestation(attestationData: AttestationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic data validation
      const basicValidation = this.validateBasicData(attestationData);
      errors.push(...basicValidation.errors);
      warnings.push(...basicValidation.warnings);

      // Business logic validation
      const businessValidation = this.validateBusinessLogic(attestationData);
      errors.push(...businessValidation.errors);
      warnings.push(...businessValidation.warnings);

      // Security validation
      const securityValidation = this.validateSecurity(attestationData);
      errors.push(...securityValidation.errors);
      warnings.push(...securityValidation.warnings);

      // Mathematical validation
      const mathValidation = this.validateMathematicalConsistency(attestationData);
      errors.push(...mathValidation.errors);
      warnings.push(...mathValidation.warnings);

      const isValid = errors.length === 0;

      if (isValid) {
        logger.info('Attestation validation passed', {
          groupId: attestationData.groupId,
          warnings: warnings.length
        });
      } else {
        logger.error('Attestation validation failed', {
          groupId: attestationData.groupId,
          errors,
          warnings
        });
      }

      return { isValid, errors, warnings };
    } catch (error) {
      logger.error('Validation process failed:', error);
      return {
        isValid: false,
        errors: ['Internal validation error'],
        warnings: []
      };
    }
  }

  /**
   * Validate basic data structure and types
   */
  private validateBasicData(data: AttestationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Group ID validation
    if (!data.groupId || !Number.isInteger(data.groupId) || data.groupId <= 0) {
      errors.push('Invalid group ID: must be a positive integer');
    }

    // Members validation
    if (!data.members || !Array.isArray(data.members) || data.members.length === 0) {
      errors.push('Invalid members: must be a non-empty array');
    } else {
      data.members.forEach((member, index) => {
        if (!this.isValidStacksAddress(member.address)) {
          errors.push(`Invalid Stacks address for member ${index}: ${member.address}`);
        }
        
        if (!Number.isInteger(member.finalAmount) || member.finalAmount < 0) {
          errors.push(`Invalid final amount for member ${index}: must be a non-negative integer`);
        }
        
        if (!Number.isInteger(member.contribution) || member.contribution <= 0) {
          errors.push(`Invalid contribution for member ${index}: must be a positive integer`);
        }
      });
    }

    // Value validations
    if (!Number.isInteger(data.totalContributed) || data.totalContributed <= 0) {
      errors.push('Invalid total contributed: must be a positive integer');
    }

    if (!Number.isInteger(data.totalFinal) || data.totalFinal < 0) {
      errors.push('Invalid total final: must be a non-negative integer');
    }

    // Investment period validation
    if (!data.investmentPeriodEnd || !(data.investmentPeriodEnd instanceof Date)) {
      errors.push('Invalid investment period end: must be a valid Date');
    } else if (data.investmentPeriodEnd > new Date()) {
      warnings.push('Investment period end is in the future');
    }

    // Proof hash validation
    if (!data.proofHash || typeof data.proofHash !== 'string' || data.proofHash.length === 0) {
      errors.push('Invalid proof hash: must be a non-empty string');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate business logic rules
   */
  private validateBusinessLogic(data: AttestationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if total contributed matches sum of member contributions
    const memberContributionSum = data.members.reduce((sum, member) => sum + member.contribution, 0);
    if (Math.abs(memberContributionSum - data.totalContributed) > 1) {
      errors.push(`Total contributed (${data.totalContributed}) does not match sum of member contributions (${memberContributionSum})`);
    }

    // Check if total final matches sum of member final amounts
    const memberFinalSum = data.members.reduce((sum, member) => sum + member.finalAmount, 0);
    if (Math.abs(memberFinalSum - data.totalFinal) > 1) {
      errors.push(`Total final (${data.totalFinal}) does not match sum of member final amounts (${memberFinalSum})`);
    }

    // Validate profit/loss is within acceptable range
    const profitLoss = data.totalFinal - data.totalContributed;
    const profitLossPercentage = (profitLoss / data.totalContributed) * 100;
    
    if (Math.abs(profitLossPercentage) > this.securityConfig.allowedProfitLossRange) {
      errors.push(`Profit/loss percentage (${profitLossPercentage.toFixed(2)}%) exceeds allowed range (±${this.securityConfig.allowedProfitLossRange}%)`);
    }

    // Check for unusual member distribution
    const averageFinalAmount = data.totalFinal / data.members.length;
    const deviations = data.members.map(member => 
      Math.abs(member.finalAmount - averageFinalAmount) / averageFinalAmount
    );
    
    const maxDeviation = Math.max(...deviations);
    if (maxDeviation > 0.1) { // 10% deviation threshold
      warnings.push(`Large deviation in member final amounts detected (max: ${(maxDeviation * 100).toFixed(1)}%)`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate security constraints
   */
  private validateSecurity(data: AttestationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check maximum attestation value
    if (data.totalFinal > this.securityConfig.maxAttestationValue) {
      errors.push(`Total final amount (${data.totalFinal}) exceeds maximum allowed (${this.securityConfig.maxAttestationValue})`);
    }

    // Check daily attestation limit
    this.resetDailyCountIfNeeded();
    const today = new Date().toDateString();
    const todayCount = this.dailyAttestationCount.get(today) || 0;
    
    if (todayCount >= this.securityConfig.maxDailyAttestations) {
      errors.push(`Daily attestation limit reached (${this.securityConfig.maxDailyAttestations})`);
    }

    // Check for duplicate members
    const addressSet = new Set();
    for (const member of data.members) {
      if (addressSet.has(member.address)) {
        errors.push(`Duplicate member address detected: ${member.address}`);
      }
      addressSet.add(member.address);
    }

    // Validate investment period duration
    const now = new Date();
    const periodDuration = now.getTime() - data.investmentPeriodEnd.getTime();
    
    if (periodDuration < 0) {
      warnings.push('Settling investment period before end date');
    } else if (periodDuration > 7 * 24 * 60 * 60 * 1000) { // 7 days
      warnings.push('Settlement is more than 7 days after investment period end');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate mathematical consistency
   */
  private validateMathematicalConsistency(data: AttestationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for integer overflow/underflow
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
    
    if (data.totalContributed > MAX_SAFE_INTEGER || data.totalFinal > MAX_SAFE_INTEGER) {
      errors.push('Values exceed maximum safe integer');
    }

    // Validate per-member calculations
    const expectedPerMember = Math.floor(data.totalFinal / data.members.length);
    const remainder = data.totalFinal % data.members.length;
    
    let exactMembers = 0;
    let plusOneMembers = 0;
    
    for (const member of data.members) {
      if (member.finalAmount === expectedPerMember) {
        exactMembers++;
      } else if (member.finalAmount === expectedPerMember + 1) {
        plusOneMembers++;
      } else {
        warnings.push(`Member ${member.address} has unexpected final amount: ${member.finalAmount} (expected: ${expectedPerMember} or ${expectedPerMember + 1})`);
      }
    }

    // Verify remainder distribution
    if (plusOneMembers !== remainder) {
      warnings.push(`Remainder distribution mismatch: expected ${remainder} members with +1, found ${plusOneMembers}`);
    }

    // Check for zero amounts (potential errors)
    const zeroAmountMembers = data.members.filter(m => m.finalAmount === 0).length;
    if (zeroAmountMembers > 0) {
      warnings.push(`${zeroAmountMembers} members have zero final amount`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate Stacks address format
   */
  private isValidStacksAddress(address: string): boolean {
    // Basic Stacks address validation
    // Mainnet addresses start with 'SP' or 'SM'
    // Testnet addresses start with 'ST' or 'SN'
    const stacksAddressRegex = /^S[TPMN][0-9A-Z]{38,39}$/;
    return stacksAddressRegex.test(address);
  }

  /**
   * Reset daily attestation count if date has changed
   */
  private resetDailyCountIfNeeded(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyAttestationCount.clear();
      this.lastResetDate = today;
      logger.info('Daily attestation count reset');
    }
  }

  /**
   * Increment daily attestation count
   */
  public incrementDailyAttestationCount(): void {
    this.resetDailyCountIfNeeded();
    const today = new Date().toDateString();
    const currentCount = this.dailyAttestationCount.get(today) || 0;
    this.dailyAttestationCount.set(today, currentCount + 1);
  }

  /**
   * Perform comprehensive security checks
   */
  public performSecurityChecks(oracleAddress: string, data: AttestationData): SecurityCheck[] {
    const checks: SecurityCheck[] = [];

    // Oracle authorization check
    checks.push({
      checkName: 'Oracle Authorization',
      passed: this.isValidStacksAddress(oracleAddress),
      details: `Oracle address: ${oracleAddress}`
    });

    // Rate limiting check
    this.resetDailyCountIfNeeded();
    const today = new Date().toDateString();
    const todayCount = this.dailyAttestationCount.get(today) || 0;
    checks.push({
      checkName: 'Rate Limiting',
      passed: todayCount < this.securityConfig.maxDailyAttestations,
      details: `Daily attestations: ${todayCount}/${this.securityConfig.maxDailyAttestations}`
    });

    // Value bounds check
    checks.push({
      checkName: 'Value Bounds',
      passed: data.totalFinal <= this.securityConfig.maxAttestationValue,
      details: `Total final: ${data.totalFinal}, Max allowed: ${this.securityConfig.maxAttestationValue}`
    });

    // Profit/loss range check
    const profitLossPercentage = ((data.totalFinal - data.totalContributed) / data.totalContributed) * 100;
    checks.push({
      checkName: 'Profit/Loss Range',
      passed: Math.abs(profitLossPercentage) <= this.securityConfig.allowedProfitLossRange,
      details: `P&L: ${profitLossPercentage.toFixed(2)}%, Range: ±${this.securityConfig.allowedProfitLossRange}%`
    });

    // Data integrity check
    const memberFinalSum = data.members.reduce((sum, member) => sum + member.finalAmount, 0);
    checks.push({
      checkName: 'Data Integrity',
      passed: Math.abs(memberFinalSum - data.totalFinal) <= 1,
      details: `Sum check: ${memberFinalSum} vs ${data.totalFinal}`
    });

    const passedChecks = checks.filter(check => check.passed).length;
    logger.info('Security checks completed', {
      total: checks.length,
      passed: passedChecks,
      failed: checks.length - passedChecks
    });

    return checks;
  }

  /**
   * Get current security configuration
   */
  public getSecurityConfig(): OracleSecurityConfig {
    return { ...this.securityConfig };
  }

  /**
   * Update security configuration (admin only)
   */
  public updateSecurityConfig(newConfig: Partial<OracleSecurityConfig>): void {
    this.securityConfig = { ...this.securityConfig, ...newConfig };
    logger.info('Security configuration updated', this.securityConfig);
  }

  /**
   * Get daily attestation statistics
   */
  public getDailyAttestationStats(): { date: string; count: number; limit: number } {
    this.resetDailyCountIfNeeded();
    const today = new Date().toDateString();
    const count = this.dailyAttestationCount.get(today) || 0;
    
    return {
      date: today,
      count,
      limit: this.securityConfig.maxDailyAttestations
    };
  }
}