import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import { GroupCard, FilterBar } from '../../components/Groups';
import { Button } from '../../components/ui';
import { MOCK_GROUPS } from '../../constants';
import styles from '../../styles/pages/Groups.module.css';

export interface GroupsProps {
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
  onNavigateHome?: () => void;
  onNavigateGroups?: () => void;
  onNavigateCreate?: () => void;
  onNavigateProfile?: () => void;
  onViewGroupDetail?: (groupId: string) => void;
}

export const Groups: React.FC<GroupsProps> = ({
  onConnectWallet,
  isWalletConnected = false,
  walletAddress,
  onNavigateHome,
  onNavigateGroups,
  onNavigateCreate,
  onNavigateProfile,
  onViewGroupDetail
}) => {
  const [filteredGroups] = useState(MOCK_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filters: any) => {
    console.log('Filters applied:', filters);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
  };

  const handleCreateGroup = () => {
    console.log('Navigate to create group');
    onNavigateCreate?.();
  };

  return (
    <div className={styles.groupsPage}>
      <Header 
        onConnectWallet={onConnectWallet}
        onNavigateHome={onNavigateHome}
        onNavigateGroups={onNavigateGroups}
        onNavigateCreate={onNavigateCreate}
        onNavigateProfile={onNavigateProfile}
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
            {filteredGroups.map((group: any) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                onViewDetail={onViewGroupDetail}
                isWalletConnected={isWalletConnected}
              />
            ))}
          </div>

          {/* Show message when we have groups (for now) */}
          {filteredGroups.length > 0 && (
            <div className={styles.infoMessage}>
              <p>Showing {filteredGroups.length} investment groups</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Groups;