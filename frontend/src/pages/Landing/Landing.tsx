import React, { useCallback } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HeroSection } from '../../components/HeroSection';
import styles from '../../styles/pages/Landing.module.css';

export interface LandingPageProps {
  onNavigateHome?: () => void;
  onNavigateGroups?: () => void;
  onNavigateCreate?: () => void;
  onConnectWallet?: () => void;
  isWalletConnected?: boolean;
  walletAddress?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateHome,
  onNavigateGroups, 
  onNavigateCreate,
  onConnectWallet,
  isWalletConnected,
  walletAddress
}) => {
  const handleConnectWallet = useCallback(() => {
    console.log('Connect wallet clicked');
    onConnectWallet?.();
  }, [onConnectWallet]);

  const handleLearnMore = useCallback(() => {
    console.log('Learn more clicked - navigating to groups');
    onNavigateGroups?.();
  }, [onNavigateGroups]);

  return (
    <div className={styles.landingPage}>
      <Header 
        onConnectWallet={handleConnectWallet}
        onNavigateHome={onNavigateHome}
        onNavigateGroups={onNavigateGroups}
        onNavigateCreate={onNavigateCreate}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
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