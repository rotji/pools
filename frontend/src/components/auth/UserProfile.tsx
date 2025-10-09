/**
 * User Profile Component
 * Header dropdown with user info and logout functionality
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './UserProfile.module.css';

export const UserProfile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.userProfile}>
      <div 
        className={styles.profileButton}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className={styles.avatar}>
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.username} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {(user.username || user.walletAddress).charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.username}>{user.username || 'User'}</div>
          <div className={styles.walletAddress}>
            {formatWalletAddress(user.walletAddress)}
          </div>
        </div>
        <div className={styles.dropdownArrow}>▼</div>
      </div>

      {showDropdown && (
        <>
          <div 
            className={styles.backdrop}
            onClick={() => setShowDropdown(false)}
          />
          <div className={styles.dropdownMenu}>
            <div className={styles.userStats}>
              <div className={styles.stat}>
                <span className={styles.label}>Active Groups:</span>
                <span className={styles.value}>{user.activeGroups}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Completed Groups:</span>
                <span className={styles.value}>{user.completedGroups}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Total Contributions:</span>
                <span className={styles.value}>{formatCurrency(user.totalContributions)}</span>
              </div>
            </div>
            
            <div className={styles.menuItems}>
              <button className={styles.menuItem}>
                👤 Profile Settings
              </button>
              <button className={styles.menuItem}>
                📊 My Dashboard
              </button>
              <button className={styles.menuItem}>
                📈 Investment History
              </button>
              <button className={styles.menuItem}>
                🏊‍♀️ My Groups
              </button>
              <hr className={styles.divider} />
              <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
                🚪 Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;