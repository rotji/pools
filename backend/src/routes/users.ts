import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock user data store
interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  joinedGroups: string[];
  createdAt: string;
  lastActive: string;
}

// Mock users storage
let users: User[] = [];

// GET /api/users - Get all users (for demo purposes)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users.map(user => ({
      id: user.id,
      walletAddress: user.walletAddress,
      displayName: user.displayName,
      groupCount: user.joinedGroups.length,
      joinedAt: user.createdAt
    })),
    count: users.length
  });
});

// GET /api/users/:walletAddress - Get user by wallet address
router.get('/:walletAddress', (req, res) => {
  const user = users.find(u => u.walletAddress === req.params.walletAddress);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - Create or connect user (simplified registration)
router.post('/', (req, res) => {
  const { walletAddress, displayName } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  // Check if user already exists
  let user = users.find(u => u.walletAddress === walletAddress);

  if (user) {
    // Update last active
    user.lastActive = new Date().toISOString();
    
    res.json({
      success: true,
      data: user,
      message: 'User connected successfully'
    });
  } else {
    // Create new user
    user = {
      id: uuidv4(),
      walletAddress,
      displayName: displayName || `User ${walletAddress.slice(-4)}`,
      joinedGroups: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    users.push(user);

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  }
});

// PUT /api/users/:walletAddress - Update user profile
router.put('/:walletAddress', (req, res) => {
  const { displayName } = req.body;
  
  const userIndex = users.findIndex(u => u.walletAddress === req.params.walletAddress);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const user = users[userIndex];
  
  if (displayName) {
    user.displayName = displayName;
  }
  
  user.lastActive = new Date().toISOString();
  users[userIndex] = user;

  res.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
});

// GET /api/users/:walletAddress/groups - Get user's groups
router.get('/:walletAddress/groups', (req, res) => {
  const user = users.find(u => u.walletAddress === req.params.walletAddress);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // In a real app, this would query the groups table
  // For now, just return the group IDs
  res.json({
    success: true,
    data: {
      userId: user.id,
      walletAddress: user.walletAddress,
      joinedGroups: user.joinedGroups,
      groupCount: user.joinedGroups.length
    }
  });
});

export default router;