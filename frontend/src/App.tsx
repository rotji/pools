import { useState } from 'react';
import { LandingPage } from './pages/Landing';
import { Groups } from './pages/Groups/Groups-new';

type PageType = 'landing' | 'groups' | 'create' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  const handleConnectWallet = () => {
    // TODO: Implement actual wallet connection with Stacks
    console.log('Connecting wallet...');
    setIsWalletConnected(true);
    setWalletAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
  };

  const navigationProps = {
    onNavigateHome: () => setCurrentPage('landing'),
    onNavigateGroups: () => setCurrentPage('groups'),
    onNavigateCreate: () => setCurrentPage('create'),
    onConnectWallet: handleConnectWallet,
    isWalletConnected,
    walletAddress
  };

  if (currentPage === 'groups') {
    return <Groups {...navigationProps} />;
  }

  if (currentPage === 'create') {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Create Group Page</h1>
        <p>This page will be built next!</p>
        <button onClick={() => setCurrentPage('landing')}>Back to Home</button>
      </div>
    );
  }

  return <LandingPage {...navigationProps} />;
}

export default App;
