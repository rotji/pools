import React from 'react';
import { Button } from '../ui';
import { ROUTES } from '../../constants';
import styles from '../../styles/components/Navigation.module.css';

export interface NavigationProps {
  onConnectWallet?: () => void;
  onNavigateProfile?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  onConnectWallet,
  onNavigateProfile,
  isWalletConnected = false,
  walletAddress
}) => {
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

        {/* Wallet Connection */}
        <div className={styles.walletSection}>
          {isWalletConnected ? (
            <div className={styles.walletInfo}>
              <span className={styles.walletAddress}>
                {walletAddress ? truncateAddress(walletAddress) : 'Connected'}
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onNavigateProfile}
              >
                Profile
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="md"
              onClick={onConnectWallet}
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