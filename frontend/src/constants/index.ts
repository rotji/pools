// Constants for landing page content
export const LANDING_PAGE_CONTENT = {
  hero: {
    title: "Reduce Risk. Share Rewards.",
    subtitle: "A platform for group investing in stocks, forex, crypto, betting, gambling, and commodities.",
    description: "Create or join a group where each person invests equally in any asset. All profits and losses—no matter who makes them—are shared equally among group members. Lower your risk, maximize your opportunity, and invest together.",
    ctaText: "Get Started",
    secondaryCtaText: "How It Works"
  },
  stats: {
    liveGroups: "24",
    totalVolume: "1.2M STX",
    payoutsDelivered: "156"
  },
  features: [
    {
      title: "Fair Risk Sharing",
      description: "Everyone contributes equally, profits and losses are shared among all group members.",
      icon: "⚖️"
    },
    {
      title: "Blockchain Transparency",
      description: "All transactions and settlements are recorded on the Stacks blockchain for full transparency.",
      icon: "🔗"
    },
    {
      title: "Smart Contract Security",
      description: "Automated settlements through audited smart contracts ensure fair distribution.",
      icon: "🛡️"
    }
  ]
} as const;

export const ROUTES = {
  HOME: '/',
  GROUPS: '/groups',
  CREATE: '/create',
  PROFILE: '/profile',
  CONNECT: '/connect'
} as const;

// Group status types
export type GroupStatus = 'active' | 'pending' | 'settling' | 'completed';

// Group visibility types
export type GroupType = 'public' | 'private';

// Mock data for groups
export const MOCK_GROUPS = [
  {
    id: '1',
    title: 'STX Growth Pool #42',
    description: 'Medium-risk investment pool focusing on STX ecosystem growth',
    contributionAmount: 100,
    currency: 'STX',
    currentMembers: 8,
    type: 'public' as GroupType,
    status: 'active' as GroupStatus,
    timeRemaining: '2d 14h 30m',
    totalContributed: 800,
    riskLevel: 'medium',
    createdBy: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    createdAt: new Date('2025-10-03'),
    tags: ['DeFi', 'Growth', 'STX', 'Public']
  },
  {
    id: '2',
    title: 'Bitcoin Hodl Alliance',
    description: 'Conservative long-term Bitcoin investment strategy',
    contributionAmount: 250,
    currency: 'STX',
    currentMembers: 15,
    type: 'public' as GroupType,
    status: 'active' as GroupStatus,
    timeRemaining: '5d 8h 15m',
    totalContributed: 3750,
    riskLevel: 'low',
    createdBy: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    createdAt: new Date('2025-10-01'),
    tags: ['Bitcoin', 'Conservative', 'HODL', 'Public']
  },
  {
    id: '3',
    title: 'DeFi Yield Hunters',
    description: 'High-yield DeFi strategies across multiple protocols',
    contributionAmount: 500,
    currency: 'STX',
    currentMembers: 6,
    type: 'private' as GroupType,
    status: 'pending' as GroupStatus,
    timeRemaining: '1d 6h 45m',
    totalContributed: 3000,
    riskLevel: 'high',
    createdBy: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
    createdAt: new Date('2025-10-04'),
    tags: ['DeFi', 'Yield', 'High-Risk', 'Private']
  },
  {
    id: '4',
    title: 'NFT Marketplace Sprint',
    description: 'Quick flip opportunities in trending NFT collections',
    contributionAmount: 75,
    currency: 'STX',
    currentMembers: 4,
    type: 'public' as GroupType,
    status: 'active' as GroupStatus,
    timeRemaining: '12h 20m',
    totalContributed: 300,
    riskLevel: 'high',
    createdBy: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    createdAt: new Date('2025-10-05'),
    tags: ['NFT', 'Quick-Flip', 'Trending', 'Public']
  },
  {
    id: '5',
    title: 'Stable Yield Collective',
    description: 'Low-risk stable coin yield farming with consistent returns',
    contributionAmount: 200,
    currency: 'STX',
    currentMembers: 12,
    type: 'private' as GroupType,
    status: 'settling' as GroupStatus,
    timeRemaining: 'Settling...',
    totalContributed: 2400,
    riskLevel: 'low',
    createdBy: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
    createdAt: new Date('2025-09-28'),
    tags: ['Stable', 'Yield', 'Conservative', 'Private']
  },
  {
    id: '6',
    title: 'Meme Coin Moonshot',
    description: 'High-risk, high-reward meme token investments',
    contributionAmount: 50,
    currency: 'STX',
    currentMembers: 20,
    type: 'public' as GroupType,
    status: 'completed' as GroupStatus,
    timeRemaining: 'Completed',
    totalContributed: 1000,
    riskLevel: 'high',
    createdBy: 'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK',
    createdAt: new Date('2025-09-25'),
    tags: ['Meme', 'Moonshot', 'Speculative', 'Public']
  },
  {
    id: '7',
    title: 'Elite Traders Circle',
    description: 'Exclusive private group for experienced traders with proven track records',
    contributionAmount: 1000,
    currency: 'STX',
    currentMembers: 3,
    type: 'private' as GroupType,
    status: 'active' as GroupStatus,
    timeRemaining: '7d 12h 45m',
    totalContributed: 3000,
    riskLevel: 'high',
    createdBy: 'ST1ELITE123TRADER456PRIVATE789ABC',
    createdAt: new Date('2025-10-05'),
    tags: ['Elite', 'Experienced', 'High-Stakes', 'Private']
  },
  {
    id: '8',
    title: 'Friends & Family Pool',
    description: 'Private investment group for close friends and family members only',
    contributionAmount: 150,
    currency: 'STX',
    currentMembers: 7,
    type: 'private' as GroupType,
    status: 'active' as GroupStatus,
    timeRemaining: '3d 18h 30m',
    totalContributed: 1050,
    riskLevel: 'medium',
    createdBy: 'ST2FAMILY789FRIENDS123PRIVATE456',
    createdAt: new Date('2025-10-04'),
    tags: ['Family', 'Friends', 'Trust', 'Private']
  }
] as const;