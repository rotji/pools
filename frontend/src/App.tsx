/**
 * Main App Component with Authentication
 * Manages routing and authentication state
 */

import React, { useState } from 'react';
import ApiTest from './components/ApiTest';
import Header from './components/Header';
// import { UserProfile } from './components/auth/UserProfile';
// import { AuthProvider } from './contexts/AuthContext';
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
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {renderPage()}
      </main>
    </div>
  );
};

// Main App without Auth Provider for plain prototype
const App: React.FC = () => {
  return <AppContent />;
};

export default App;