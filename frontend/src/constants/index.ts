// Constants for landing page content
export const LANDING_PAGE_CONTENT = {
  hero: {
    title: "Invest Together. Win Together.",
    subtitle: "Risk-pooling powered by Stacks Blockchain",
    description: "Join investment groups, share equal contributions, and split all profits and losses fairly through smart contracts.",
    ctaText: "Connect Wallet",
    secondaryCtaText: "Learn More"
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

// Mock data for groups
export const MOCK_GROUPS = [
  {
    id: '1',
    title: 'STX Growth Pool #42',
    description: 'Medium-risk investment pool focusing on STX ecosystem growth',
    contributionAmount: 100,
    currency: 'STX',
    currentMembers: 8,
    maxMembers: 12,
    status: 'active' as GroupStatus,
    timeRemaining: '2d 14h 30m',
    totalContributed: 800,
    targetAmount: 1200,
    riskLevel: 'medium',
    createdBy: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    createdAt: new Date('2025-10-03'),
    tags: ['DeFi', 'Growth', 'STX']
  },
  {
    id: '2',
    title: 'Bitcoin Hodl Alliance',
    description: 'Conservative long-term Bitcoin investment strategy',
    contributionAmount: 250,
    currency: 'STX',
    currentMembers: 15,
    maxMembers: 20,
    status: 'active' as GroupStatus,
    timeRemaining: '5d 8h 15m',
    totalContributed: 3750,
    targetAmount: 5000,
    riskLevel: 'low',
    createdBy: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    createdAt: new Date('2025-10-01'),
    tags: ['Bitcoin', 'Conservative', 'HODL']
  },
  {
    id: '3',
    title: 'DeFi Yield Hunters',
    description: 'High-yield DeFi strategies across multiple protocols',
    contributionAmount: 500,
    currency: 'STX',
    currentMembers: 6,
    maxMembers: 10,
    status: 'pending' as GroupStatus,
    timeRemaining: '1d 6h 45m',
    totalContributed: 3000,
    targetAmount: 5000,
    riskLevel: 'high',
    createdBy: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
    createdAt: new Date('2025-10-04'),
    tags: ['DeFi', 'Yield', 'High-Risk']
  },
  {
    id: '4',
    title: 'NFT Marketplace Sprint',
    description: 'Quick flip opportunities in trending NFT collections',
    contributionAmount: 75,
    currency: 'STX',
    currentMembers: 4,
    maxMembers: 8,
    status: 'active' as GroupStatus,
    timeRemaining: '12h 20m',
    totalContributed: 300,
    targetAmount: 600,
    riskLevel: 'high',
    createdBy: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    createdAt: new Date('2025-10-05'),
    tags: ['NFT', 'Quick-Flip', 'Trending']
  },
  {
    id: '5',
    title: 'Stable Yield Collective',
    description: 'Low-risk stable coin yield farming with consistent returns',
    contributionAmount: 200,
    currency: 'STX',
    currentMembers: 12,
    maxMembers: 15,
    status: 'settling' as GroupStatus,
    timeRemaining: 'Settling...',
    totalContributed: 2400,
    targetAmount: 3000,
    riskLevel: 'low',
    createdBy: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
    createdAt: new Date('2025-09-28'),
    tags: ['Stable', 'Yield', 'Conservative']
  },
  {
    id: '6',
    title: 'Meme Coin Moonshot',
    description: 'High-risk, high-reward meme token investments',
    contributionAmount: 50,
    currency: 'STX',
    currentMembers: 20,
    maxMembers: 25,
    status: 'completed' as GroupStatus,
    timeRemaining: 'Completed',
    totalContributed: 1000,
    targetAmount: 1250,
    riskLevel: 'high',
    createdBy: 'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK',
    createdAt: new Date('2025-09-25'),
    tags: ['Meme', 'Moonshot', 'Speculative']
  }
] as const;