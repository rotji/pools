import { useState } from 'react';
import { LandingPage } from './pages/Landing';
import { Groups } from './pages/Groups/Groups-new';

type PageType = 'landing' | 'groups' | 'create-public' | 'create-private' | 'profile';

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
    onNavigateCreate: () => setCurrentPage('create-public'), // Default to public
    onConnectWallet: handleConnectWallet,
    isWalletConnected,
    walletAddress
  };

  if (currentPage === 'groups') {
    return <Groups {...navigationProps} />;
  }

  if (currentPage === 'create-public') {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Create Public Group Page</h1>
        <p>Open to anyone - This page will be built next!</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => setCurrentPage('create-private')} style={{ padding: '10px 20px' }}>
            Switch to Private
          </button>
          <button onClick={() => setCurrentPage('landing')} style={{ padding: '10px 20px' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'create-private') {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Create Private Group Page</h1>
        <p>Invite-only groups - This page will be built next!</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={() => setCurrentPage('create-public')} style={{ padding: '10px 20px' }}>
            Switch to Public
          </button>
          <button onClick={() => setCurrentPage('landing')} style={{ padding: '10px 20px' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <LandingPage {...navigationProps} />;
}

export default App;
