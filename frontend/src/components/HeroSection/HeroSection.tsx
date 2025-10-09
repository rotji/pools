import React from 'react';
import { Button, GlowContainer, StatsSection } from '../ui';
import { LANDING_PAGE_CONTENT } from '../../constants';
import styles from '../../styles/components/HeroSection.module.css';

export interface HeroSectionProps {
  // No props needed - components handle their own logic
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const { hero, stats } = LANDING_PAGE_CONTENT;
  
  const statsData = [
    { label: 'Live Groups', value: stats.liveGroups, icon: '🔥' },
    { label: 'Total Volume', value: stats.totalVolume, icon: '💰' },
    { label: 'Payouts Delivered', value: stats.payoutsDelivered, icon: '✅' }
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <GlowContainer 
          glowColor="blue" 
          intensity="medium"
          className={styles.heroCard}
        >
          <div className={styles.heroContent}>
            {/* Main Heading */}
            <div className={styles.headingSection}>
              <h1 className={styles.title}>
                {hero.title}
              </h1>
              <p className={styles.subtitle}>
                {hero.subtitle}
              </p>
              <p className={styles.description}>
                {hero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaSection}>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => console.log('Get started - handled by main app')}
                className={styles.primaryCta}
              >
                {hero.ctaText}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => console.log('Learn more - handled by main app')}
              >
                {hero.secondaryCtaText}
              </Button>
              {/* Temporary API Test Button */}
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => console.log('API test - handled by main app')}
                style={{ marginLeft: '1rem', fontSize: '0.8rem' }}
              >
                Test API
              </Button>
            </div>

            {/* Stats */}
            <div className={styles.statsSection}>
              <StatsSection stats={statsData} variant="horizontal" />
            </div>
          </div>
        </GlowContainer>
      </div>
    </section>
  );
};

export default HeroSection;