import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3005;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Mock users database
const users = new Map();
const sessions = new Map();

// Generate a simple token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Mock user data
function createMockUser(walletAddress) {
  return {
    id: `user_${Date.now()}`,
    walletAddress: walletAddress,
    username: `user_${walletAddress.slice(-4)}`,
    email: `${walletAddress.slice(-4)}@example.com`,
    profileImage: `https://avatar.dicebear.com/api/robohash/${walletAddress}.svg`,
    totalContributions: Math.floor(Math.random() * 10000),
    activeGroups: Math.floor(Math.random() * 5),
    completedGroups: Math.floor(Math.random() * 10),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
}

// Routes
app.post('/api/auth/register', (req, res) => {
  try {
    console.log('📝 Registration request:', req.body);
    
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress) {
      console.log('❌ Missing wallet address');
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    // Check if user already exists
    if (users.has(walletAddress)) {
      console.log('⚠️ User already exists:', walletAddress);
      return res.status(409).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Create new user
    const newUser = createMockUser(walletAddress);
    users.set(walletAddress, newUser);
    
    // Create session
    const token = generateToken();
    sessions.set(token, { userId: newUser.id, walletAddress, createdAt: Date.now() });
    
    console.log('✅ User registered successfully:', newUser.id);
    
    res.json({
      success: true,
      user: newUser,
      token: token
    });
  } catch (error) {
    console.error('💥 Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    console.log('🔐 Login request:', req.body);
    
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Wallet address is required' 
      });
    }

    // Get existing user
    const user = users.get(walletAddress);
    if (!user) {
      console.log('❌ User not found:', walletAddress);
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    users.set(walletAddress, user);
    
    // Create session
    const token = generateToken();
    sessions.set(token, { userId: user.id, walletAddress, createdAt: Date.now() });
    
    console.log('✅ User logged in successfully:', user.id);
    
    res.json({
      success: true,
      user: user,
      token: token
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    const { token } = req.body;
    
    if (token && sessions.has(token)) {
      sessions.delete(token);
      console.log('✅ User logged out successfully');
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('💥 Logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.get('/api/auth/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !sessions.has(token)) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
    
    const session = sessions.get(token);
    const user = users.get(session.walletAddress);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('💥 Profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    users: users.size,
    sessions: sessions.size
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Demo server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});