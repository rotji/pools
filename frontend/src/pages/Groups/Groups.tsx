import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import { GroupCard, FilterBar } from '../../components/Groups';
import { Button } from '../../components/ui';
import { MOCK_GROUPS } from '../../constants';
import type { GroupStatus } from '../../constants';
import styles from '../../styles/pages/Groups.module.css';

// Define Group type here for now
export interface Group {
  id: string;
  title: string;
  description: string;
  contributionAmount: number;
  currency: string;
  currentMembers: number;
  type: 'public' | 'private';
  status: GroupStatus;
  timeRemaining: string;
  totalContributed: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  tags: string[];
}

export interface GroupsProps {
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

export const Groups: React.FC<GroupsProps> = ({
  onConnectWallet,
  isWalletConnected = false,
  walletAddress
}) => {
  const [filteredGroups] = useState<Group[]>([...MOCK_GROUPS] as unknown as Group[]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filters: any) => {
    // TODO: Implement filtering logic
    console.log('Filters applied:', filters);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
    // TODO: Implement join group logic
  };

  const handleCreateGroup = () => {
    console.log('Navigate to create group');
    // TODO: Navigate to create group page
  };

  return (
    <div className={styles.groupsPage}>
      <Header 
        onConnectWallet={onConnectWallet}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
      />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>Investment Groups</h1>
              <p className={styles.pageDescription}>
                Join active investment pools and share equal contributions and outcomes
              </p>
            </div>
            <Button 
              variant="primary"
              size="lg"
              onClick={handleCreateGroup}
              className={styles.createButton}
            >
              Create New Group
            </Button>
          </div>

          {/* Filter Bar */}
          <FilterBar 
            onFilter={handleFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Groups Grid */}
          <div className={styles.groupsGrid}>
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                isWalletConnected={isWalletConnected}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No groups found</h3>
              <p className={styles.emptyDescription}>
                Try adjusting your filters or create a new group
              </p>
              <Button variant="primary" onClick={handleCreateGroup}>
                Create New Group
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Groups;