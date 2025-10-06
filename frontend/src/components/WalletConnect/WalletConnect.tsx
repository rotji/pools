import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import styles from '../../styles/components/WalletConnect.module.css';

export interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
  isConnecting?: boolean;
}

interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting = false
}) => {
  const [connectionStep, setConnectionStep] = useState<'select' | 'connecting' | 'success' | 'error'>('select');
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setConnectionStep('select');
      setWalletInfo(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleHiroWalletConnect = async () => {
    setConnectionStep('connecting');
    setErrorMessage('');

    try {
      // Check if Hiro Wallet is installed
      if (typeof window !== 'undefined' && (window as any).StacksProvider) {
        const stacksProvider = (window as any).StacksProvider;
        
        // Request wallet connection
        const response = await stacksProvider.request({
          method: 'stx_requestAccounts',
        });

        if (response && response.length > 0) {
          const address = response[0];
          
          // Get additional wallet info
          const balanceResponse = await stacksProvider.request({
            method: 'stx_getBalance',
            params: { address }
          });

          const networkResponse = await stacksProvider.request({
            method: 'stx_getNetwork'
          });

          const walletData: WalletInfo = {
            address: address,
            balance: balanceResponse ? formatBalance(balanceResponse.balance) : '0',
            network: networkResponse?.network || 'testnet'
          };

          setWalletInfo(walletData);
          setConnectionStep('success');
          
          // Notify parent component
          onConnect(address);
          
          // Auto close after 2 seconds
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          throw new Error('No accounts found');
        }
      } else {
        throw new Error('Hiro Wallet not installed');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setErrorMessage(error.message || 'Failed to connect wallet');
      setConnectionStep('error');
    }
  };

  const handleWalletConnectConnect = async () => {
    setConnectionStep('connecting');
    setErrorMessage('');

    try {
      // WalletConnect integration would go here
      // For now, show coming soon message
      setErrorMessage('WalletConnect integration coming soon');
      setConnectionStep('error');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to connect via WalletConnect');
      setConnectionStep('error');
    }
  };

  const formatBalance = (balance: string | number): string => {
    const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (balanceNum >= 1000000) {
      return `${(balanceNum / 1000000).toFixed(2)}M`;
    } else if (balanceNum >= 1000) {
      return `${(balanceNum / 1000).toFixed(2)}K`;
    }
    return balanceNum.toFixed(6);
  };

  const handleRetry = () => {
    setConnectionStep('select');
    setErrorMessage('');
  };

  const handleInstallHiro = () => {
    window.open('https://wallet.hiro.so/', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Connect Wallet</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {connectionStep === 'select' && (
            <>
              <p className={styles.description}>
                Connect your wallet to join investment groups and manage your portfolio
              </p>

              <div className={styles.walletOptions}>
                <button 
                  className={styles.walletOption}
                  onClick={handleHiroWalletConnect}
                  disabled={isConnecting}
                >
                  <div className={styles.walletIcon}>🏦</div>
                  <div className={styles.walletInfo}>
                    <h3>Hiro Wallet</h3>
                    <p>Connect using Hiro Wallet browser extension</p>
                  </div>
                  <div className={styles.arrow}>→</div>
                </button>

                <button 
                  className={styles.walletOption}
                  onClick={handleWalletConnectConnect}
                  disabled={isConnecting}
                >
                  <div className={styles.walletIcon}>📱</div>
                  <div className={styles.walletInfo}>
                    <h3>WalletConnect</h3>
                    <p>Connect using mobile wallet via QR code</p>
                  </div>
                  <div className={styles.arrow}>→</div>
                </button>
              </div>

              <div className={styles.helpSection}>
                <p className={styles.helpText}>
                  Don't have a Stacks wallet?{' '}
                  <button 
                    className={styles.helpLink}
                    onClick={handleInstallHiro}
                  >
                    Install Hiro Wallet
                  </button>
                </p>
              </div>
            </>
          )}

          {connectionStep === 'connecting' && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <h3>Connecting to wallet...</h3>
              <p>Please check your wallet and approve the connection request</p>
            </div>
          )}

          {connectionStep === 'success' && walletInfo && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✅</div>
              <h3>Wallet Connected Successfully!</h3>
              
              <div className={styles.walletDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Address:</span>
                  <span className={styles.value}>
                    {`${walletInfo.address.slice(0, 8)}...${walletInfo.address.slice(-8)}`}
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Balance:</span>
                  <span className={styles.value}>{walletInfo.balance} STX</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Network:</span>
                  <span className={styles.value}>{walletInfo.network}</span>
                </div>
              </div>

              <p className={styles.autoClose}>Closing automatically...</p>
            </div>
          )}

          {connectionStep === 'error' && (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>❌</div>
              <h3>Connection Failed</h3>
              <p className={styles.errorMessage}>{errorMessage}</p>
              
              {errorMessage.includes('not installed') && (
                <div className={styles.errorActions}>
                  <Button 
                    variant="primary" 
                    onClick={handleInstallHiro}
                    size="sm"
                  >
                    Install Hiro Wallet
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleRetry}
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!errorMessage.includes('not installed') && (
                <div className={styles.errorActions}>
                  <Button 
                    variant="primary" 
                    onClick={handleRetry}
                    size="sm"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={onClose}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.securityNote}>
            <span className={styles.securityIcon}>🔒</span>
            <span>Your wallet information is secure and never stored on our servers</span>
          </div>
        </div>
      </div>
    </div>
  );
};