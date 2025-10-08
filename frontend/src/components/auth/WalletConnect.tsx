/**
 * Wallet Connect Component
 * Demo-friendly wallet connection with easy testing
 */

import React, { useState } from 'react';
import type { User } from '../../services/userService';
import { UserService } from '../../services/userService';
import styles from './WalletConnect.module.css';

interface WalletConnectProps {
  onAuthSuccess: (user: User) => void;
  onAuthError: (error: string) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onAuthSuccess, onAuthError }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleConnect = async () => {
    if (!walletAddress.trim()) {
      onAuthError('Please enter a wallet address');
      return;
    }

    setIsConnecting(true);

    try {
      // First try to authenticate (login)
      const authResponse = await UserService.authenticate({
        walletAddress: walletAddress.trim(),
        // Demo mode: no signature required
        message: `Sign in to Pools with wallet ${walletAddress}`,
        signature: 'demo_signature'
      });

      if (authResponse.success && authResponse.data) {
        onAuthSuccess(authResponse.data.user);
      } else {
        // User doesn't exist, show registration
        setIsNewUser(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // If authentication fails, assume user needs to register
      setIsNewUser(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRegister = async () => {
    if (!walletAddress.trim() || !username.trim()) {
      onAuthError('Please enter both wallet address and username');
      return;
    }

    setIsConnecting(true);

    try {
      const registerResponse = await UserService.register({
        walletAddress: walletAddress.trim(),
        username: username.trim(),
        message: `Sign up for Pools with wallet ${walletAddress}`,
        signature: 'demo_signature'
      });

      if (registerResponse.success && registerResponse.data) {
        onAuthSuccess(registerResponse.data.user);
      } else {
        onAuthError('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      onAuthError('Failed to register. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className={styles.walletConnect}>
      <div className={styles.walletConnectCard}>
        <h2>🔗 Connect Your Wallet</h2>
        <p className={styles.demoNote}>
          📝 <strong>Demo Mode:</strong> Enter any wallet address to test the platform
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="walletAddress">Wallet Address:</label>
          <input
            id="walletAddress"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
            disabled={isConnecting}
            className={styles.walletInput}
          />
        </div>

        {isNewUser && (
          <div className={styles.inputGroup}>
            <label htmlFor="username">Choose Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isConnecting}
              className={styles.walletInput}
            />
          </div>
        )}

        <div className={styles.buttonGroup}>
          {!isNewUser ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting || !walletAddress.trim()}
              className={styles.connectButton}
            >
              {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
            </button>
          ) : (
            <>
              <button
                onClick={handleRegister}
                disabled={isConnecting || !walletAddress.trim() || !username.trim()}
                className={styles.registerButton}
              >
                {isConnecting ? '🔄 Registering...' : '✨ Create Account'}
              </button>
              <button
                onClick={() => {
                  setIsNewUser(false);
                  setUsername('');
                }}
                disabled={isConnecting}
                className={styles.backButton}
              >
                ← Back to Login
              </button>
            </>
          )}
        </div>

        <div className={styles.demoExamples}>
          <p><strong>Demo Wallet Examples:</strong></p>
          <button
            onClick={() => setWalletAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')}
            className={styles.exampleButton}
            disabled={isConnecting}
          >
            Use Alice's Wallet
          </button>
          <button
            onClick={() => setWalletAddress('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')}
            className={styles.exampleButton}
            disabled={isConnecting}
          >
            Use Bob's Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;