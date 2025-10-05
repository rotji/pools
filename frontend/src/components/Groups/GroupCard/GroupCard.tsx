import React from 'react';
import { Button } from '../../ui';
import type { GroupStatus } from '../../../constants';
import styles from '../../../styles/components/Groups/GroupCard.module.css';

export interface Group {
  id: string;
  title: string;
  description: string;
  contributionAmount: number;
  currency: string;
  currentMembers: number;
  maxMembers: number;
  status: GroupStatus;
  timeRemaining: string;
  totalContributed: number;
  targetAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

export interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
  isWalletConnected: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onJoin,
  isWalletConnected
}) => {
  const progressPercentage = (group.totalContributed / group.targetAmount) * 100;
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: GroupStatus) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'settling': return '#8b5cf6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const isJoinable = group.status === 'active' && group.currentMembers < group.maxMembers;

  return (
    <div className={styles.groupCard}>
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{group.title}</h3>
          <div className={styles.badges}>
            <span 
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(group.status) }}
            >
              {group.status}
            </span>
            <span 
              className={styles.riskBadge}
              style={{ backgroundColor: getRiskColor(group.riskLevel) }}
            >
              {group.riskLevel} risk
            </span>
          </div>
        </div>
        <div className={styles.timer}>
          <span className={styles.timerIcon}>⏰</span>
          <span className={styles.timeRemaining}>{group.timeRemaining}</span>
        </div>
      </div>

      <p className={styles.description}>{group.description}</p>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Contribution</span>
          <span className={styles.statValue}>
            {group.contributionAmount} {group.currency}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Members</span>
          <span className={styles.statValue}>
            {group.currentMembers}/{group.maxMembers}
          </span>
        </div>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressAmount}>
            {group.totalContributed}/{group.targetAmount} {group.currency}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <span className={styles.progressPercentage}>
          {Math.round(progressPercentage)}% funded
        </span>
      </div>

      <div className={styles.tags}>
        {group.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.actions}>
        {isJoinable ? (
          <Button 
            variant="primary"
            size="md"
            onClick={() => onJoin(group.id)}
            disabled={!isWalletConnected}
            className={styles.joinButton}
          >
            {isWalletConnected ? 'Join Group' : 'Connect Wallet to Join'}
          </Button>
        ) : (
          <Button 
            variant="ghost"
            size="md"
            disabled
            className={styles.viewButton}
          >
            {group.status === 'completed' ? 'View Results' : 
             group.status === 'settling' ? 'Settling...' : 'Group Full'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;