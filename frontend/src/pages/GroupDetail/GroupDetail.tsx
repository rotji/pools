import React, { useState } from 'react';
import { Header, Footer } from '../../components';
import { Button } from '../../components/ui';
import { MOCK_GROUPS } from '../../constants';
import styles from '../../styles/pages/GroupDetail.module.css';
import { useAuth } from '../../contexts/AuthContext';

interface GroupMember {
  id: string;
  address: string;
  avatar: string;
  joinedAt: Date;
  status: 'confirmed' | 'pending';
}

interface GroupDetailProps {
  onNavigateHome: () => void;
  onNavigateGroups: () => void;
  onNavigateCreate: () => void;
  groupId: string;
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  onNavigateGroups,
  groupId
}) => {
  const { isAuthenticated } = useAuth();
  const group = MOCK_GROUPS.find(g => g.id === groupId);
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Mock participant data - in real app this would come from backend
  const mockParticipants: GroupMember[] = [
    {
      id: '1',
      address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      avatar: '👨‍💼',
      joinedAt: new Date('2025-10-01'),
      status: 'confirmed'
    },
    {
      id: '2',
      address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      avatar: '👩‍💻',
      joinedAt: new Date('2025-10-03'),
      status: 'confirmed'
    },
    {
      id: '3',
      address: 'ST2JHG361ZXG51QTQAADT8ACVP5P1CY8GTJFAKDC',
      avatar: '👨‍🎓',
      joinedAt: new Date('2025-10-05'),
      status: 'pending'
    },
    {
      id: '4',
      address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
      avatar: '👩‍🔬',
      joinedAt: new Date('2025-10-07'),
      status: 'confirmed'
    }
  ];

  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinGroup = () => {
    console.log('Joining group:', groupId);
    setShowRiskModal(true);
  };

  const handleLeaveGroup = () => {
    console.log('Leaving group:', groupId);
    setHasJoined(false);
  };

  const handleConfirmJoin = () => {
    setHasJoined(true);
    setShowRiskModal(false);
  };

  if (!group) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.notFound}>
            <h1>Group Not Found</h1>
            <p>The group you're looking for doesn't exist.</p>
            <Button onClick={onNavigateGroups}>Back to Groups</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPoolValue = group.currentMembers * group.contributionAmount;
  const confirmedMembers = mockParticipants.filter(p => p.status === 'confirmed').length;
  const pendingMembers = mockParticipants.filter(p => p.status === 'pending').length;

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Back Navigation */}
        <div className={styles.backNav}>
          <button onClick={onNavigateGroups} className={styles.backButton}>
            ← Back to Groups
          </button>
        </div>

        {/* Group Header */}
        <div className={styles.groupHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.groupTitle}>{group.title}</h1>
              <span className={`${styles.typeBadge} ${styles[group.type]}`}>
                {group.type === 'public' ? '🌐 Public' : '🔒 Private'}
              </span>
            </div>
            <div className={styles.statusSection}>
              <span className={`${styles.statusBadge} ${styles[group.status]}`}>
                {group.status}
              </span>
            </div>
          </div>
          <p className={styles.groupDescription}>{group.description}</p>
        </div>

        {/* Group Statistics */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <h3>{group.contributionAmount} STX</h3>
              <p>Contribution Amount</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <h3>{group.currentMembers}</h3>
              <p>Members</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏦</div>
            <div className={styles.statInfo}>
              <h3>{totalPoolValue} STX</h3>
              <p>Total Pool Value</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <h3>{group.timeRemaining}</h3>
              <p>Time Remaining</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Participants Section */}
          <div className={styles.participantsSection}>
            <div className={styles.sectionHeader}>
              <h2>Participants</h2>
              <div className={styles.memberStats}>
                <span className={styles.confirmed}>{confirmedMembers} confirmed</span>
                {pendingMembers > 0 && (
                  <span className={styles.pending}>{pendingMembers} pending</span>
                )}
              </div>
            </div>
            
            <div className={styles.participantsList}>
              {mockParticipants.map((participant) => (
                <div key={participant.id} className={styles.participantCard}>
                  <div className={styles.participantAvatar}>
                    {participant.avatar}
                  </div>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantAddress}>
                      {participant.address.slice(0, 8)}...{participant.address.slice(-4)}
                    </div>
                    <div className={styles.participantMeta}>
                      <span className={styles.joinDate}>
                        Joined {participant.joinedAt.toLocaleDateString()}
                      </span>
                      <span className={`${styles.participantStatus} ${styles[participant.status]}`}>
                        {participant.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Contract & Action Section */}
          <div className={styles.actionSection}>
            {/* Smart Contract Info */}
            <div className={styles.contractSection}>
              <h3>Smart Contract</h3>
              <div className={styles.contractInfo}>
                <div className={styles.contractField}>
                  <label>Contract Address</label>
                  <span className={styles.contractAddress}>
                    SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.escrow-stx
                  </span>
                </div>
                <div className={styles.contractField}>
                  <label>Asset Type</label>
                  <span>Cryptocurrency</span>
                </div>
                <div className={styles.contractField}>
                  <label>Risk Level</label>
                  <span className={styles.riskLevel}>{group.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {!isAuthenticated ? (
                <Button 
                  onClick={() => alert('Please login to join this group')}
                  variant="primary"
                  size="lg"
                  className={styles.connectButton}
                >
                  Login to Join
                </Button>
              ) : (
                <>
                  {!hasJoined ? (
                    <Button 
                      onClick={handleJoinGroup}
                      variant="primary"
                      size="lg"
                      className={styles.joinButton}
                      disabled={group.status !== 'active'}
                    >
                      {group.type === 'private' ? 'Request to Join' : 'Join Group'}
                    </Button>
                  ) : (
                    <div className={styles.joinedState}>
                      <div className={styles.joinedMessage}>
                        ✅ You are a member of this group
                      </div>
                      <Button 
                        onClick={handleLeaveGroup}
                        variant="secondary"
                        size="md"
                        className={styles.leaveButton}
                      >
                        Leave Group
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Risk Disclosure */}
            <div className={styles.riskDisclosure}>
              <h4>⚠️ Investment Risk Disclosure</h4>
              <p className={styles.riskText}>
                All investments carry risk. You may lose some or all of your contribution. 
                Please read our <button className={styles.riskLink} onClick={() => setShowRiskModal(true)}>
                  full risk disclosure
                </button> before participating.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Risk Disclosure Modal */}
      {showRiskModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Investment Risk Disclosure</h3>
              <button 
                onClick={() => setShowRiskModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.riskSection}>
                <h4>🚨 IMPORTANT RISK WARNING</h4>
                <p>
                  By participating in this investment group, you acknowledge and accept that:
                </p>
                <ul>
                  <li>All investments carry inherent risks and you may lose some or all of your contribution</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>The value of investments can go down as well as up</li>
                  <li>Smart contracts may contain bugs or vulnerabilities</li>
                  <li>Blockchain transactions are irreversible</li>
                  <li>This platform does not provide financial advice</li>
                </ul>
              </div>
              
              <div className={styles.legalSection}>
                <h4>📋 Legal Considerations</h4>
                <p>
                  Investment groups are subject to applicable securities laws. Please consult 
                  with a qualified financial advisor before participating. This platform 
                  facilitates group formation but does not provide investment advice.
                </p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button 
                onClick={() => setShowRiskModal(false)}
                variant="secondary"
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmJoin}
                variant="primary"
                className={styles.confirmButton}
              >
                I Understand, Join Group
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GroupDetail;