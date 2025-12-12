/**
 * Main App Component with Authentication
 * Manages routing and authentication state
 */

import React, { useState } from 'react';
import ApiTest from './components/ApiTest';
import { UserProfile } from './components/auth/UserProfile';
import { WalletConnect } from './components/auth/WalletConnect';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Profile } from './pages';
import { CreateGroupSelector, CreatePrivateGroup, CreatePublicGroup } from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import { Groups } from './pages/Groups';
import { LandingPage } from './pages/Landing';
import type { User } from './services/userService';

type PageType = 'landing' | 'groups' | 'create' | 'create-public' | 'create-private' | 'profile' | 'group-detail' | 'api-test';

// Auth-aware App Content
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [authError, setAuthError] = useState<string>('');

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p>Loading Investment Pools...</p>
        </div>
        <style>
          {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Show wallet connection if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <header style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem 0',
          textAlign: 'center',
          color: 'white'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              🏊‍♀️ Investment Pools
            </h1>
            <p style={{
              margin: '0',
              fontSize: '1.1rem',
              opacity: 0.9
            }}>
              Connect your wallet to get started
            </p>
          </div>
        </header>

        <main>
          <WalletConnect
            onAuthSuccess={(user: User) => {
              login(user);
              setAuthError('');
            }}
            onAuthError={setAuthError}
          />

          {authError && (
            <div style={{
              maxWidth: '400px',
              margin: '1rem auto',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              textAlign: 'center'
            }}>
              ❌ {authError}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Main authenticated app
  const handleViewGroupDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentPage('group-detail');
  };

  const navigationProps = {
    onNavigateHome: () => setCurrentPage('landing'),
    onNavigateGroups: () => setCurrentPage('groups'),
    onNavigateCreate: () => setCurrentPage('create'),
    onNavigateProfile: () => setCurrentPage('profile'),
    onNavigateApiTest: () => setCurrentPage('api-test'),
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'groups':
        return <Groups onViewGroupDetail={handleViewGroupDetail} />;
      case 'create':
        return (
          <CreateGroupSelector
            {...navigationProps}
            onSelectPublic={() => setCurrentPage('create-public')}
            onSelectPrivate={() => setCurrentPage('create-private')}
          />
        );
      case 'create-public':
        return <CreatePublicGroup {...navigationProps} />;
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
        return <LandingPage {...navigationProps} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1
              onClick={() => setCurrentPage('landing')}
              style={{
                margin: '0',
                fontSize: '1.5rem',
                color: '#1f2937',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#3b82f6'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#1f2937'}
            >
              🏊‍♀️ Investment Pools
            </h1>
          </div>
          <div>
            <UserProfile />
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {renderPage()}
      </main>
    </div>
  );
};

// Main App with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;