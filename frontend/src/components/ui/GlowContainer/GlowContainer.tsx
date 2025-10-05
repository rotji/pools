import React from 'react';
import styles from '../../../styles/components/ui/GlowContainer.module.css';

export interface GlowContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'blue' | 'cyan' | 'green' | 'amber';
  intensity?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
  animated?: boolean;
}

export const GlowContainer: React.FC<GlowContainerProps> = ({
  glowColor = 'blue',
  intensity = 'medium',
  children,
  animated = false,
  className = '',
  ...props
}) => {
  const containerClasses = [
    styles.glowContainer,
    styles[glowColor],
    styles[intensity],
    animated && styles.animated,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      <div className={styles.glowEffect}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default GlowContainer;