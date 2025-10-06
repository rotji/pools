import React from 'react';
import { Button } from '../../ui';
import type { GroupStatus, GroupType } from '../../../constants';
import styles from '../../../styles/components/Groups/GroupCard.module.css';

export interface Group {
  id: string;
  title: string;
  description: string;
  contributionAmount: number;
  currency: string;
  currentMembers: number;
  type: GroupType;
  status: GroupStatus;
  timeRemaining: string;
  totalContributed: number;
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

  const getTypeColor = (type: GroupType) => {
    switch (type) {
      case 'public': return '#10b981';
      case 'private': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const isJoinable = group.status === 'active' && group.type === 'public';

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
              className={styles.typeBadge}
              style={{ backgroundColor: getTypeColor(group.type) }}
            >
              {group.type}
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
            {group.currentMembers} {group.currentMembers === 1 ? 'member' : 'members'}
          </span>
        </div>
      </div>

      <div className={styles.totalSection}>
        <div className={styles.totalHeader}>
          <span className={styles.totalLabel}>Total Pool</span>
          <span className={styles.totalAmount}>
            {group.totalContributed} {group.currency}
          </span>
        </div>
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
        ) : group.type === 'private' && group.status === 'active' ? (
          <Button 
            variant="ghost"
            size="md"
            disabled
            className={styles.viewButton}
          >
            Private - Invite Only
          </Button>
        ) : (
          <Button 
            variant="ghost"
            size="md"
            disabled
            className={styles.viewButton}
          >
            {group.status === 'completed' ? 'View Results' : 
             group.status === 'settling' ? 'Settling...' : 'Not Available'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;