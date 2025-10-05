import React, { useCallback } from 'react';
import { Navigation } from '../../components/Navigation';
import { HeroSection } from '../../components/HeroSection';
import styles from '../../styles/pages/Landing.module.css';

export interface LandingPageProps {
  // Future props for wallet connection state
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  // Mock wallet connection handlers (will implement with Stacks.js later)
  const handleConnectWallet = useCallback(() => {
    console.log('Connect wallet clicked');
    // TODO: Implement wallet connection with @stacks/connect
  }, []);

  const handleLearnMore = useCallback(() => {
    console.log('Learn more clicked');
    // TODO: Scroll to features section or open modal
  }, []);

  return (
    <div className={styles.landingPage}>
      <Navigation 
        onConnectWallet={handleConnectWallet}
        isWalletConnected={false}
      />
      
      <main className={styles.main}>
        <HeroSection 
          onConnectWallet={handleConnectWallet}
          onLearnMore={handleLearnMore}
        />
        
        {/* Future sections will go here:
            - Features section
            - How it works
            - Recent groups/activity
            - Footer
        */}
      </main>
    </div>
  );
};

export default LandingPage;