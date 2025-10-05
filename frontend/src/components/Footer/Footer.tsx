import React from 'react';
import { Button } from '../ui';
import { ROUTES } from '../../constants';
import styles from '../../styles/components/Footer.module.css';

export interface FooterProps {
  // Future props can be added here
}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Browse Groups', href: ROUTES.GROUPS },
    { label: 'Create Group', href: ROUTES.CREATE },
    { label: 'How It Works', href: '#how-it-works' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Risk Disclosure', href: '#risk-disclosure' },
    { label: 'Documentation', href: '#docs' }
  ];

  const socialLinks = [
    { label: 'Twitter', href: '#twitter', icon: '🐦' },
    { label: 'Discord', href: '#discord', icon: '💬' },
    { label: 'GitHub', href: '#github', icon: '💻' },
    { label: 'Telegram', href: '#telegram', icon: '📱' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerMain}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <span className={styles.logoSymbol}>◉</span>
              </div>
              <span className={styles.logoText}>UnitedProfit</span>
            </div>
            
            <p className={styles.brandDescription}>
              Revolutionizing investment through blockchain-powered risk sharing. 
              Join groups, contribute equally, and share all outcomes fairly.
            </p>
            
            <div className={styles.brandStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>24</span>
                <span className={styles.statLabel}>Active Groups</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>1.2M</span>
                <span className={styles.statLabel}>STX Volume</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>156</span>
                <span className={styles.statLabel}>Payouts</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <nav className={styles.linksList}>
              {quickLinks.map((link, index) => (
                <a key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className={styles.linksSection}>
            <h3 className={styles.sectionTitle}>Legal</h3>
            <nav className={styles.linksList}>
              {legalLinks.map((link, index) => (
                <a key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter & Social */}
          <div className={styles.socialSection}>
            <h3 className={styles.sectionTitle}>Stay Connected</h3>
            
            <div className={styles.newsletterForm}>
              <p className={styles.newsletterText}>
                Get updates on new features and groups
              </p>
              <div className={styles.inputGroup}>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className={styles.emailInput}
                />
                <Button variant="primary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>

            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <span className={styles.socialIcon}>{social.icon}</span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} UnitedProfit. Built on Stacks blockchain.
            </p>
            
            <div className={styles.bottomLinks}>
              <span className={styles.builtWith}>
                Built with ❤️ for the Stacks community
              </span>
            </div>
          </div>
          
          <div className={styles.disclaimer}>
            <p className={styles.disclaimerText}>
              <strong>Risk Warning:</strong> This platform involves financial risk. 
              All participants may lose their entire investment. 
              Platform acts as neutral arbiter, not financial advisor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;