/**
 * Demo Backend Server (No Database Required)
 * Simple mock API for testing frontend integration
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005; // Use different port for demo

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Mock data for demo
let mockGroups = [
  {
    id: '1',
    name: 'Tech Startup Investing',
    description: 'Pool funds to invest in promising tech startups',
    type: 'public',
    category: 'Technology',
    targetAmount: 50000,
    currentAmount: 25000,
    memberCount: 5,
    maxMembers: 10,
    investmentPeriod: 30,
    createdBy: 'demo_user_1',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    name: 'Green Energy Fund',
    description: 'Sustainable energy investments for the future',
    type: 'public',
    category: 'Energy',
    targetAmount: 100000,
    currentAmount: 15000,
    memberCount: 3,
    maxMembers: 15,
    investmentPeriod: 45,
    createdBy: 'demo_user_2',
    createdAt: new Date().toISOString(),
    status: 'active'
  }
];

let mockUsers = [
  {
    id: 'user-1',
    walletAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    username: 'alice_investor',
    email: 'alice@demo.com',
    totalContributions: 5000.50,
    activeGroups: 2,
    completedGroups: 3,
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'user-2', 
    walletAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    username: 'bob_trader',
    email: 'bob@demo.com',
    totalContributions: 3200.25,
    activeGroups: 1,
    completedGroups: 2,
    createdAt: '2024-01-20T14:30:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'demo_user_1',
    walletAddress: 'ST1DEMO1ABC123',
    username: 'DemoUser1',
    email: '',
    totalContributions: 25000,
    activeGroups: 1,
    completedGroups: 2,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// API Routes
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      message: 'Demo API is running!',
      features: ['groups', 'users', 'demo-mode']
    }
  });
});

// Groups endpoints
app.get('/api/v1/groups', (req, res) => {
  const { category, status, search } = req.query;
  
  let filteredGroups = [...mockGroups];
  
  if (category) {
    filteredGroups = filteredGroups.filter(g => g.category.toLowerCase() === category.toString().toLowerCase());
  }
  
  if (status) {
    filteredGroups = filteredGroups.filter(g => g.status === status);
  }
  
  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredGroups = filteredGroups.filter(g => 
      g.name.toLowerCase().includes(searchTerm) || 
      g.description.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json({
    success: true,
    data: {
      groups: filteredGroups,
      total: filteredGroups.length,
      page: 1,
      limit: 10
    }
  });
});

app.get('/api/v1/groups/:id', (req, res) => {
  const group = mockGroups.find(g => g.id === req.params.id);
  
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

app.post('/api/v1/groups', (req, res) => {
  const newGroup = {
    id: (mockGroups.length + 1).toString(),
    ...req.body,
    currentAmount: 0,
    memberCount: 1,
    createdBy: 'demo_user',
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  
  mockGroups.push(newGroup);
  
  res.status(201).json({
    success: true,
    data: newGroup,
    message: 'Group created successfully!'
  });
});

// User endpoints (Authentication)
app.post('/api/v1/auth/login', (req, res) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      error: 'Wallet address required'
    });
  }
  
  // Find existing user
  const user = mockUsers.find(u => u.walletAddress === walletAddress);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found. Please register first.'
    });
  }
  
  // Update last login
  user.lastLoginAt = new Date().toISOString();
  
  const token = `demo_token_${user.id}_${Date.now()}`;
  
  res.json({
    success: true,
    data: {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { walletAddress, username } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      error: 'Wallet address required'
    });
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.walletAddress === walletAddress);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'Wallet address already registered'
    });
  }
  
  // Create new user
  const newUser = {
    id: `user-${mockUsers.length + 1}`,
    walletAddress,
    username: username || `User${mockUsers.length + 1}`,
    email: '',
    totalContributions: 0,
    activeGroups: 0,
    completedGroups: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  const token = `demo_token_${newUser.id}_${Date.now()}`;
  
  res.json({
    success: true,
    data: {
      user: newUser,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

app.get('/api/v1/users/me', (req, res) => {
  // In demo mode, extract user ID from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      error: 'No authorization header' 
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('_');
  if (parts.length < 3) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token format' 
    });
  }
  
  const userId = parts[2];
  const user = mockUsers.find(u => u.id === userId || u.id === `user-${userId}`);
  
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ 
      success: false, 
      error: 'User not found' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🎭 Demo Mode: Authentication simplified for testing`);
  console.log(`👥 Users: ${mockUsers.length} demo users available`);
  console.log(`🌍 CORS enabled for: http://localhost:5173`);
});

export default app;