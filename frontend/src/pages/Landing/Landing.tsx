import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HeroSection } from '../../components/HeroSection';
import styles from '../../styles/pages/Landing.module.css';

export interface LandingPageProps {
  // No props needed - components will use AuthContext directly
}

export const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <div className={styles.landingPage}>
      <Header />
      
      <main className={styles.main}>
        <HeroSection />
        
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