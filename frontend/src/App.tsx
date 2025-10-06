import { useState } from 'react';
import { LandingPage } from './pages/Landing';
import { Groups } from './pages/Groups/Groups-new';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import { CreatePublicGroup, CreatePrivateGroup, CreateGroupSelector } from './pages/CreateGroup';
import { Profile } from './pages';

type PageType = 'landing' | 'groups' | 'create' | 'create-public' | 'create-private' | 'profile' | 'group-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  const handleConnectWallet = () => {
    // TODO: Implement actual wallet connection with Stacks
    console.log('Connecting wallet...');
    setIsWalletConnected(true);
    setWalletAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
  };

  const handleViewGroupDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentPage('group-detail');
  };

  const navigationProps = {
    onNavigateHome: () => setCurrentPage('landing'),
    onNavigateGroups: () => setCurrentPage('groups'),
    onNavigateCreate: () => setCurrentPage('create'), // Go to selector page
    onNavigateProfile: () => setCurrentPage('profile'),
    onConnectWallet: handleConnectWallet,
    isWalletConnected,
    walletAddress
  };

  if (currentPage === 'groups') {
    return <Groups {...navigationProps} onViewGroupDetail={handleViewGroupDetail} />;
  }

  if (currentPage === 'group-detail') {
    return <GroupDetail {...navigationProps} groupId={selectedGroupId} />;
  }

  if (currentPage === 'create') {
    return (
      <CreateGroupSelector 
        {...navigationProps} 
        onSelectPublic={() => setCurrentPage('create-public')}
        onSelectPrivate={() => setCurrentPage('create-private')}
      />
    );
  }

  if (currentPage === 'create-public') {
    return <CreatePublicGroup {...navigationProps} />;
  }

  if (currentPage === 'create-private') {
    return <CreatePrivateGroup {...navigationProps} />;
  }

  if (currentPage === 'profile') {
    return <Profile {...navigationProps} />;
  }

  return <LandingPage {...navigationProps} />;
}

export default App;
