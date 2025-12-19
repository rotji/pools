/**
 * Main App Component with Authentication
 * Manages routing and authentication state
 */


import React, { useEffect, useState } from 'react';
import ApiTest from './components/ApiTest';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import { Profile } from './pages';
import About from './pages/About';
import { CreateGroupSelector, CreatePrivateGroup, CreatePublicGroup } from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import { Groups } from './pages/Groups';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

type PageType = 'home' | 'about' | 'signup' | 'login' | 'groups' | 'create' | 'create-public' | 'create-private' | 'profile' | 'group-detail' | 'api-test';

// Auth-aware App Content
const AppContent: React.FC = () => {
  // Authentication logic removed for prototype: always show main app shell and pages
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Main authenticated app
  const handleViewGroupDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentPage('group-detail');
  };


  // Navigation functions
  const navigationProps = {
    onNavigateHome: () => setCurrentPage('home'),
    onNavigateAbout: () => setCurrentPage('about'),
    onNavigateSignup: () => setCurrentPage('signup'),
    onNavigateLogin: () => setCurrentPage('login'),
    onNavigateGroups: () => setCurrentPage('groups'),
    onNavigateCreate: () => setCurrentPage('create'),
    onNavigateProfile: () => setCurrentPage('profile')
  };

  // Intercept header link clicks for client-side routing
  useEffect(() => {
    const navHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.closest('nav')) {
        const href = (target as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          switch (href) {
            case '/': setCurrentPage('home'); break;
            case '/about': setCurrentPage('about'); break;
            case '/signup': setCurrentPage('signup'); break;
            case '/login': setCurrentPage('login'); break;
            case '/groups': setCurrentPage('groups'); break;
            case '/create': setCurrentPage('create'); break;
            default: setCurrentPage('home'); break;
          }
        }
      }
    };
    document.addEventListener('click', navHandler);
    return () => document.removeEventListener('click', navHandler);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'signup':
        return <Signup />;
      case 'login':
        return <Login />;
      case 'groups':
        return <Groups onViewGroupDetail={handleViewGroupDetail} />;
      case 'create':
        return (
          <CreateGroupSelector
            onSelectPublic={() => setCurrentPage('create-public')}
            onSelectPrivate={() => setCurrentPage('create-private')}
          />
        );
      case 'create-public':
        return <CreatePublicGroup onNavigateGroups={navigationProps.onNavigateGroups} />;
      case 'create-private':
        return <CreatePrivateGroup {...navigationProps} />;
      case 'profile':
        return <Profile {...navigationProps} />;
      case 'group-detail':
        return selectedGroupId ? (
          <GroupDetail
            groupId={selectedGroupId}
            {...navigationProps}
          />
        ) : (
          <div>Group not found</div>
        );
      case 'api-test':
        return <ApiTest />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Header onConnectWallet={() => setShowWalletModal(true)} walletAddress={walletAddress} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {renderPage()}
      </main>
      <WalletConnect
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={address => {
          setWalletAddress(address);
          setShowWalletModal(false);
        }}
      />
    </div>
  );
};

// Main App without Auth Provider for plain prototype
const App: React.FC = () => {
  return <AppContent />;
};

export default App;