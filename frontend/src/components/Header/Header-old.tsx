import React, { useState } from 'react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/components/Header.module.css';

export interface HeaderProps {
  // No props needed - using AuthContext directly
}

export const Header: React.FC<HeaderProps> = () => {
  const { isAuthenticated, user, logout } = useAuth();

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
          <button onClick={onNavigateHome} className={styles.navLink}>
            <span className={styles.navIcon}>🏠</span>
            Home
          </button>
          <button onClick={onNavigateGroups} className={styles.navLink}>
            <span className={styles.navIcon}>👥</span>
            Groups
          </button>
          <button onClick={onNavigateCreate} className={styles.navLink}>
            <span className={styles.navIcon}>➕</span>
            Create
          </button>
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
              <Button 
                variant="ghost" 
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
            <button onClick={() => { onNavigateHome?.(); setIsMobileMenuOpen(false); }} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>🏠</span>
              Home
            </button>
            <button onClick={() => { onNavigateGroups?.(); setIsMobileMenuOpen(false); }} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>👥</span>
              Groups
            </button>
            <button onClick={() => { onNavigateCreate?.(); setIsMobileMenuOpen(false); }} className={styles.mobileNavLink}>
              <span className={styles.navIcon}>➕</span>
              Create
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;