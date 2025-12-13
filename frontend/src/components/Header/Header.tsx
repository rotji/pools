import React from 'react';
import styles from '../../styles/components/Header.module.css';

export interface HeaderProps {
  // No props needed - using AuthContext directly
}


export const Header: React.FC<HeaderProps> = () => {
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

        {/* Navigation Links */}
        <nav className={styles.headerNav}>
          <a href="/" className={styles.navLink}>Home</a>
          <a href="/about" className={styles.navLink}>About</a>
          <a href="/signup" className={styles.navLink}>Sign Up</a>
          <a href="/login" className={styles.navLink}>Login</a>
          <a href="/create" className={styles.createGroupButton}>+ Create Group</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;