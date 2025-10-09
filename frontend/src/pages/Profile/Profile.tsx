import React, { useState } from 'react';
import { Button, Footer, GlowContainer, Header } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/pages/Profile.module.css';

export interface ProfileProps {
  onNavigateHome: () => void;
  onNavigateGroups: () => void;
  onNavigateCreate: () => void;
  onNavigateProfile: () => void;
}

type ProfileTab = 'active' | 'settled' | 'history';

interface GroupPosition {
  id: string;
  title: string;
  asset: string;
  contribution: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  participants: number;
  joinedDate: Date;
  endDate?: Date;
  payout?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock data for profile groups
const mockActiveGroups: GroupPosition[] = [
  {
    id: '1',
    title: 'Tech Giants Bull Run',
    asset: 'STX',
    contribution: '100 STX',
    status: 'active',
    participants: 8,
    joinedDate: new Date('2025-10-01'),
    endDate: new Date('2025-10-30'),
    riskLevel: 'medium'
  },
  {
    id: '3',
    title: 'Crypto Winter Survivors',
    asset: 'STX',
    contribution: '250 STX',
    status: 'active',
    participants: 15,
    joinedDate: new Date('2025-09-25'),
    endDate: new Date('2025-11-15'),
    riskLevel: 'high'
  }
];

const mockSettledGroups: GroupPosition[] = [
  {
    id: '2',
    title: 'DeFi Momentum Pool',
    asset: 'STX',
    contribution: '150 STX',
    status: 'won',
    participants: 12,
    joinedDate: new Date('2025-09-15'),
    endDate: new Date('2025-09-30'),
    payout: '+75 STX',
    riskLevel: 'medium'
  },
  {
    id: '4',
    title: 'Bear Market Defense',
    asset: 'STX',
    contribution: '200 STX',
    status: 'lost',
    participants: 10,
    joinedDate: new Date('2025-08-20'),
    endDate: new Date('2025-09-20'),
    payout: '-200 STX',
    riskLevel: 'low'
  }
];

const mockHistoryGroups: GroupPosition[] = [
  ...mockSettledGroups,
  {
    id: '5',
    title: 'Summer Rally 2025',
    asset: 'STX',
    contribution: '300 STX',
    status: 'won',
    participants: 20,
    joinedDate: new Date('2025-07-01'),
    endDate: new Date('2025-08-01'),
    payout: '+150 STX',
    riskLevel: 'high'
  }
];

export const Profile: React.FC<ProfileProps> = ({
  onNavigateGroups
}) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('active');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: GroupPosition['status']) => {
    const statusConfig = {
      active: { label: 'Active', className: styles.statusActive },
      won: { label: 'Won', className: styles.statusWon },
      lost: { label: 'Lost', className: styles.statusLost },
      pending: { label: 'Pending', className: styles.statusPending }
    };

    const config = statusConfig[status];
    return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
  };

  const getRiskBadge = (risk: GroupPosition['riskLevel']) => {
    const riskConfig = {
      low: { label: 'Low Risk', className: styles.riskLow },
      medium: { label: 'Medium Risk', className: styles.riskMedium },
      high: { label: 'High Risk', className: styles.riskHigh }
    };

    const config = riskConfig[risk];
    return <span className={`${styles.riskBadge} ${config.className}`}>{config.label}</span>;
  };

  const renderGroupCard = (group: GroupPosition) => (
    <GlowContainer key={group.id} glowColor="blue" intensity="low" className={styles.groupCard}>
      <div className={styles.groupCardHeader}>
        <div className={styles.groupInfo}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.groupMeta}>
            <span className={styles.asset}>{group.asset}</span>
            <span className={styles.contribution}>{group.contribution}</span>
            <span className={styles.participants}>{group.participants} members</span>
          </div>
        </div>
        <div className={styles.groupStatus}>
          {getStatusBadge(group.status)}
          {getRiskBadge(group.riskLevel)}
        </div>
      </div>

      <div className={styles.groupCardBody}>
        <div className={styles.groupDates}>
          <div className={styles.dateItem}>
            <span className={styles.dateLabel}>Joined:</span>
            <span className={styles.dateValue}>{formatDate(group.joinedDate)}</span>
          </div>
          {group.endDate && (
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>
                {group.status === 'active' ? 'Ends:' : 'Ended:'}
              </span>
              <span className={styles.dateValue}>{formatDate(group.endDate)}</span>
            </div>
          )}
        </div>

        {group.payout && (
          <div className={styles.payoutSection}>
            <span className={styles.payoutLabel}>Payout:</span>
            <span className={`${styles.payoutValue} ${group.status === 'won' ? styles.payoutPositive : styles.payoutNegative}`}>
              {group.payout}
            </span>
          </div>
        )}
      </div>

      <div className={styles.groupCardFooter}>
        <Button variant="secondary" size="sm">
          View Details
        </Button>
        {group.status === 'active' && (
          <Button variant="primary" size="sm">
            Manage
          </Button>
        )}
      </div>
    </GlowContainer>
  );

  const getTabData = () => {
    switch (activeTab) {
      case 'active':
        return mockActiveGroups;
      case 'settled':
        return mockSettledGroups;
      case 'history':
        return mockHistoryGroups;
      default:
        return [];
    }
  };

  const getTabStats = () => {
    const active = mockActiveGroups.length;
    const totalInvested = mockActiveGroups.reduce((sum, group) =>
      sum + parseInt(group.contribution.split(' ')[0]), 0);
    const totalWon = mockSettledGroups.filter(g => g.status === 'won').length;
    const totalPayout = mockSettledGroups.reduce((sum, group) => {
      if (group.payout) {
        const amount = parseInt(group.payout.replace(/[+-]/, '').split(' ')[0]);
        return sum + (group.status === 'won' ? amount : -amount);
      }
      return sum;
    }, 0);

    return { active, totalInvested, totalWon, totalPayout };
  };

  const stats = getTabStats();

  if (!isAuthenticated) {
    return (
      <div className={styles.profilePage}>
        <Header />

        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.connectPrompt}>
              <GlowContainer glowColor="blue" intensity="medium" className={styles.connectCard}>
                <div className={styles.connectContent}>
                  <div className={styles.connectIcon}>🔐</div>
                  <h1 className={styles.connectTitle}>Connect Your Wallet</h1>
                  <p className={styles.connectDescription}>
                    You need to connect your wallet to view your profile and manage your investment groups.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => alert('Please login to view your profile')}
                    className={styles.connectButton}
                  >
                    Login Required
                  </Button>
                </div>
              </GlowContainer>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <span className={styles.avatarIcon}>👤</span>
              </div>
              <div className={styles.userDetails}>
                <h1 className={styles.userName}>My Profile</h1>
                <p className={styles.walletInfo}>
                  <span className={styles.walletLabel}>Account:</span>
                  <span className={styles.walletAddress}>{user?.email || user?.username}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              <GlowContainer glowColor="blue" intensity="low" className={styles.statCard}>
                <div className={styles.statValue}>{stats.active}</div>
                <div className={styles.statLabel}>Active Groups</div>
              </GlowContainer>
              <GlowContainer glowColor="green" intensity="low" className={styles.statCard}>
                <div className={styles.statValue}>{stats.totalInvested} STX</div>
                <div className={styles.statLabel}>Total Invested</div>
              </GlowContainer>
              <GlowContainer glowColor="cyan" intensity="low" className={styles.statCard}>
                <div className={styles.statValue}>{stats.totalWon}</div>
                <div className={styles.statLabel}>Groups Won</div>
              </GlowContainer>
              <GlowContainer
                glowColor={stats.totalPayout >= 0 ? "green" : "amber"}
                intensity="low"
                className={styles.statCard}
              >
                <div className={`${styles.statValue} ${stats.totalPayout >= 0 ? styles.positive : styles.negative}`}>
                  {stats.totalPayout >= 0 ? '+' : ''}{stats.totalPayout} STX
                </div>
                <div className={styles.statLabel}>Net Payout</div>
              </GlowContainer>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active Groups ({mockActiveGroups.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'settled' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('settled')}
            >
              Settled Groups ({mockSettledGroups.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('history')}
            >
              All History ({mockHistoryGroups.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {getTabData().length === 0 ? (
              <div className={styles.emptyState}>
                <GlowContainer glowColor="blue" intensity="low" className={styles.emptyCard}>
                  <div className={styles.emptyIcon}>📊</div>
                  <h3 className={styles.emptyTitle}>
                    No {activeTab} groups yet
                  </h3>
                  <p className={styles.emptyDescription}>
                    {activeTab === 'active'
                      ? 'Join investment groups to start tracking your positions.'
                      : `You don't have any ${activeTab} groups to display.`
                    }
                  </p>
                  {activeTab === 'active' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={onNavigateGroups}
                      className={styles.emptyAction}
                    >
                      Browse Groups
                    </Button>
                  )}
                </GlowContainer>
              </div>
            ) : (
              <div className={styles.groupGrid}>
                {getTabData().map(renderGroupCard)}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;