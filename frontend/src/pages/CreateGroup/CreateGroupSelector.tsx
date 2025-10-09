import React from 'react';
import { Header, Footer, Button, GlowContainer } from '../../components';
import styles from '../../styles/pages/CreateGroup.module.css';

export interface CreateGroupSelectorProps {
  onSelectPublic: () => void;
  onSelectPrivate: () => void;
}

export const CreateGroupSelector: React.FC<CreateGroupSelectorProps> = ({
  onSelectPublic,
  onSelectPrivate
}) => {
  return (
    <div className={styles.createGroupPage}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create Investment Group</h1>
            <p className={styles.subtitle}>
              Choose the type of investment group you want to create
            </p>
          </div>

          <div className={styles.selectorGrid}>
            {/* Public Group Option */}
            <GlowContainer 
              glowColor="blue" 
              intensity="medium"
              className={styles.selectorCard}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <span className={styles.icon}>🌐</span>
                  </div>
                  <h2 className={styles.cardTitle}>Public Group</h2>
                  <div className={styles.badge}>
                    <span className={styles.badgeText}>Open to All</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardDescription}>
                    Create an open investment group that anyone can discover and join. 
                    Perfect for building large, diverse investment communities.
                  </p>

                  <ul className={styles.featureList}>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Discoverable on platform</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Anyone can join instantly</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Transparent member list</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Higher member capacity</span>
                    </li>
                  </ul>
                </div>

                <div className={styles.cardFooter}>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={onSelectPublic}
                    className={styles.selectButton}
                  >
                    Create Public Group
                  </Button>
                </div>
              </div>
            </GlowContainer>

            {/* Private Group Option */}
            <GlowContainer 
              glowColor="green" 
              intensity="medium"
              className={styles.selectorCard}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconContainer}>
                    <span className={styles.icon}>🔒</span>
                  </div>
                  <h2 className={styles.cardTitle}>Private Group</h2>
                  <div className={styles.badge}>
                    <span className={styles.badgeText}>Invite Only</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p className={styles.cardDescription}>
                    Create an exclusive investment group for invited members only. 
                    Ideal for close-knit communities and targeted investment strategies.
                  </p>

                  <ul className={styles.featureList}>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Invitation-based membership</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Member approval control</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Enhanced privacy settings</span>
                    </li>
                    <li className={styles.feature}>
                      <span className={styles.featureIcon}>✅</span>
                      <span>Curated member experience</span>
                    </li>
                  </ul>
                </div>

                <div className={styles.cardFooter}>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    onClick={onSelectPrivate}
                    className={styles.selectButton}
                  >
                    Create Private Group
                  </Button>
                </div>
              </div>
            </GlowContainer>
          </div>

          <div className={styles.helpSection}>
            <p className={styles.helpText}>
              <strong>Not sure which to choose?</strong> Public groups are great for growing large communities, 
              while private groups offer more control and exclusivity. You can always create both types!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateGroupSelector;