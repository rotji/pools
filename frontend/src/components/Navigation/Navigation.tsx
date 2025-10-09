import React from 'react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';
import styles from '../../styles/components/Navigation.module.css';

export interface NavigationProps {
  // No props needed - using AuthContext directly
}

export const Navigation: React.FC<NavigationProps> = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoText}>Pools</span>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <a href={ROUTES.HOME} className={styles.navLink}>
            Home
          </a>
          <a href={ROUTES.GROUPS} className={styles.navLink}>
            Groups
          </a>
          <a href={ROUTES.CREATE} className={styles.navLink}>
            Create
          </a>
        </div>

        {/* User Authentication */}
        <div className={styles.walletSection}>
          {isAuthenticated ? (
            <div className={styles.walletInfo}>
              <span className={styles.walletAddress}>
                {user?.walletAddress ? truncateAddress(user.walletAddress) : user?.username || 'Connected'}
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="md"
              onClick={() => console.log('Connect wallet - handled by main app')}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;