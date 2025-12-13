import React from 'react';
import { ROUTES } from '../../constants';
import styles from '../../styles/components/Navigation.module.css';


export const Navigation: React.FC<NavigationProps> = () => {
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
        {/* No authentication UI for plain prototype */}
      </div>
    </nav>
  );
};

export default Navigation;