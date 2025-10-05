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