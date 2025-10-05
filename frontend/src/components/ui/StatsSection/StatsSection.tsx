import React from 'react';
import styles from '../../../styles/components/ui/StatsSection.module.css';

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface StatsSectionProps {
  stats: StatItem[];
  variant?: 'horizontal' | 'vertical';
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  variant = 'horizontal'
}) => {
  return (
    <div className={`${styles.statsSection} ${styles[variant]}`}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statItem}>
          {stat.icon && <span className={styles.icon}>{stat.icon}</span>}
          <div className={styles.statContent}>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;