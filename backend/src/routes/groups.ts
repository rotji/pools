import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock data store (in production this would be a database)
interface Group {
  id: string;
  title: string;
  description: string;
  contributionAmount: number;
  currency: string;
  currentMembers: number;
  maxMembers: number;
  type: 'public' | 'private';
  status: 'open' | 'active' | 'settled' | 'closed';
  timeRemaining: string;
  totalContributed: number;
  riskLevel: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: string;
  tags: string[];
  members: string[];
}

// Mock groups storage
let groups: Group[] = [
  {
    id: '1',
    title: 'STX Growth Pool #42',
    description: 'Medium-risk investment pool focusing on STX ecosystem growth',
    contributionAmount: 100,
    currency: 'STX',
    currentMembers: 8,
    maxMembers: 10,
    type: 'public',
    status: 'open',
    timeRemaining: '3 days',
    totalContributed: 800,
    riskLevel: 'medium',
    createdBy: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    createdAt: new Date().toISOString(),
    tags: ['DeFi', 'Growth', 'STX', 'Public'],
    members: []
  },
  {
    id: '2',
    title: 'Conservative Crypto Fund',
    description: 'Low-risk crypto investment with focus on established coins',
    contributionAmount: 250,
    currency: 'STX',
    currentMembers: 12,
    maxMembers: 15,
    type: 'public',
    status: 'active',
    timeRemaining: '1 week',
    totalContributed: 3000,
    riskLevel: 'low',
    createdBy: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    createdAt: new Date().toISOString(),
    tags: ['Conservative', 'BTC', 'ETH', 'Stable'],
    members: []
  }
];

// GET /api/groups - Get all groups
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: groups,
    count: groups.length
  });
});

// GET /api/groups/:id - Get specific group
router.get('/:id', (req, res) => {
  const group = groups.find(g => g.id === req.params.id);
  
  if (!group) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  res.json({
    success: true,
    data: group
  });
});

// POST /api/groups - Create new group
router.post('/', (req, res) => {
  const {
    title,
    description,
    contributionAmount,
    currency = 'STX',
    maxMembers = 10,
    type = 'public',
    riskLevel = 'medium',
    tags = [],
    createdBy
  } = req.body;

  // Basic validation
  if (!title || !description || !contributionAmount || !createdBy) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: title, description, contributionAmount, createdBy'
    });
  }

  const newGroup: Group = {
    id: uuidv4(),
    title,
    description,
    contributionAmount: Number(contributionAmount),
    currency,
    currentMembers: 0,
    maxMembers: Number(maxMembers),
    type,
    status: 'open',
    timeRemaining: '7 days', // Default
    totalContributed: 0,
    riskLevel,
    createdBy,
    createdAt: new Date().toISOString(),
    tags: Array.isArray(tags) ? tags : [],
    members: []
  };

  groups.push(newGroup);

  res.status(201).json({
    success: true,
    data: newGroup,
    message: 'Group created successfully'
  });
});

// POST /api/groups/:id/join - Join a group
router.post('/:id/join', (req, res) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  const groupIndex = groups.findIndex(g => g.id === req.params.id);
  
  if (groupIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  const group = groups[groupIndex];

  // Check if group is full
  if (group.currentMembers >= group.maxMembers) {
    return res.status(400).json({
      success: false,
      message: 'Group is full'
    });
  }

  // Check if user already joined
  if (group.members.includes(walletAddress)) {
    return res.status(400).json({
      success: false,
      message: 'Already a member of this group'
    });
  }

  // Add member
  group.members.push(walletAddress);
  group.currentMembers += 1;
  group.totalContributed += group.contributionAmount;

  // Update status if group is full
  if (group.currentMembers >= group.maxMembers) {
    group.status = 'active';
  }

  groups[groupIndex] = group;

  res.json({
    success: true,
    data: group,
    message: 'Successfully joined group'
  });
});

// DELETE /api/groups/:id/leave - Leave a group
router.delete('/:id/leave', (req, res) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  const groupIndex = groups.findIndex(g => g.id === req.params.id);
  
  if (groupIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  const group = groups[groupIndex];

  // Check if user is a member
  const memberIndex = group.members.indexOf(walletAddress);
  if (memberIndex === -1) {
    return res.status(400).json({
      success: false,
      message: 'Not a member of this group'
    });
  }

  // Remove member
  group.members.splice(memberIndex, 1);
  group.currentMembers -= 1;
  group.totalContributed -= group.contributionAmount;

  // Update status
  if (group.currentMembers < group.maxMembers && group.status === 'active') {
    group.status = 'open';
  }

  groups[groupIndex] = group;

  res.json({
    success: true,
    data: group,
    message: 'Successfully left group'
  });
});

export default router;