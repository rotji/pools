import React, { useCallback } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
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
      <Header 
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
        */}
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;