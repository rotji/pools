/**
 * Main App Component with Authentication
 * Manages routing and authentication state
 */

import React, { useState } from 'react';
import ApiTest from './components/ApiTest';
import { UserProfile } from './components/auth/UserProfile';
import { AuthProvider } from './contexts/AuthContext';
import { Profile } from './pages';
import { CreateGroupSelector, CreatePrivateGroup, CreatePublicGroup } from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import { Groups } from './pages/Groups';
import { LandingPage } from './pages/Landing';

type PageType = 'landing' | 'groups' | 'create' | 'create-public' | 'create-private' | 'profile' | 'group-detail' | 'api-test';

// Auth-aware App Content
const AppContent: React.FC = () => {
  // Authentication logic removed for prototype: always show main app shell and pages
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [selectedGroupId, setSelectedGroupId] = useState<string>();

  // Main authenticated app
  const handleViewGroupDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentPage('group-detail');
  };

  // Navigation functions
  const navigationProps = {
    onNavigateHome: () => setCurrentPage('landing'),
    onNavigateGroups: () => setCurrentPage('groups'),
    onNavigateCreate: () => setCurrentPage('create'),
    onNavigateProfile: () => setCurrentPage('profile')
  };

  const renderPage = () => {
    switch (currentPage) {
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
        return <CreatePublicGroup />;
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
        return <LandingPage />;
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

          {/* Navigation Menu */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentPage('landing')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'landing' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === 'landing' ? 'bold' : 'normal'
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setCurrentPage('groups')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'groups' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === 'groups' ? 'bold' : 'normal'
              }}
            >
              📊 Groups
            </button>
            <button
              onClick={() => setCurrentPage('create')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'create' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === 'create' ? 'bold' : 'normal'
              }}
            >
              ➕ Create
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'profile' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === 'profile' ? 'bold' : 'normal'
              }}
            >
              👤 Profile
            </button>
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