import React, { useState } from 'react';
import { Button } from '../ui';
import { ROUTES } from '../../constants';
import styles from '../../styles/components/Header.module.css';

export interface HeaderProps {
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onConnectWallet,
  isWalletConnected = false,
  walletAddress
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <span className={styles.logoSymbol}>◉</span>
            </div>
            <span className={styles.logoText}>UnitedProfit</span>
          </div>
          <span className={styles.tagline}>Risk-sharing platform</span>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <a href={ROUTES.HOME} className={styles.navLink}>
            <span className={styles.navIcon}>🏠</span>
            Home
          </a>
          <a href={ROUTES.GROUPS} className={styles.navLink}>
            <span className={styles.navIcon}>👥</span>
            Groups
          </a>
          <a href={ROUTES.CREATE} className={styles.navLink}>
            <span className={styles.navIcon}>➕</span>
            Create
          </a>
        </nav>

        {/* Wallet Section */}
        <div className={styles.walletSection}>
          {isWalletConnected ? (
            <div className={styles.walletInfo}>
              <div className={styles.walletBadge}>
                <span className={styles.walletDot}></span>
                <span className={styles.walletAddress}>
                  {walletAddress ? truncateAddress(walletAddress) : 'Connected'}
                </span>
              </div>
              <Button variant="ghost" size="sm">
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

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className={styles.mobileNav}>
            <a href={ROUTES.HOME} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>🏠</span>
              Home
            </a>
            <a href={ROUTES.GROUPS} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>👥</span>
              Groups
            </a>
            <a href={ROUTES.CREATE} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>➕</span>
              Create
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;