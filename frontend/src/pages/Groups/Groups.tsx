import React, { useEffect, useState } from 'react';
import { Footer, Header } from '../../components';
import { FilterBar, GroupCard } from '../../components/Groups';
import { Button } from '../../components/ui';
import type { GroupStatus } from '../../constants';
import { GroupService } from '../../services/groupService';
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
  onViewGroupDetail?: (groupId: string) => void;
}

export const Groups: React.FC<GroupsProps> = ({
  onViewGroupDetail
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    GroupService.getPublicGroups()
      .then((res) => {
        if (res.success && res.data?.groups) {
          setGroups(res.data.groups);
          setFilteredGroups(res.data.groups);
        } else {
          setError(res.message || 'Failed to load groups');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load groups');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (filters: any) => {
    // TODO: Implement filtering logic
    // For now, just filter by search term
    if (filters?.search) {
      setFilteredGroups(groups.filter(g =>
        g.title.toLowerCase().includes(filters.search.toLowerCase())
      ));
    } else {
      setFilteredGroups(groups);
    }
    console.log('Filters applied:', filters);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
    // TODO: Implement join group logic
  };

  return (
    <div className={styles.groupsPage}>
      <Header />
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

          {/* Loading State */}
          {loading && (
            <div className={styles.loadingState}>Loading groups...</div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className={styles.errorState}>{error}</div>
          )}

          {/* Groups Grid */}
          {!loading && !error && (
            <div className={styles.groupsGrid}>
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onViewDetail={onViewGroupDetail}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredGroups.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No groups found</h3>
              <p className={styles.emptyDescription}>
                Try adjusting your filters or create a new group
              </p>
              <Button variant="primary">
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