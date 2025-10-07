import express from 'express';
import { UserService } from '../services/userService';

const router = express.Router();

// GET /api/users - Get all users (for demo purposes)
router.get('/', async (req, res) => {
  try {
    const users = await UserService.findAll();
    
    res.json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        groupCount: user.joined_groups,
        joinedAt: user.created_at,
        reputationScore: user.reputation_score
      })),
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// GET /api/users/:walletAddress - Get user by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await UserService.findByWalletAddress(req.params.walletAddress);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        joinedGroups: user.joined_groups,
        totalContributed: user.total_contributed,
        reputationScore: user.reputation_score,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// POST /api/users - Create or connect user (simplified registration)
router.post('/', async (req, res) => {
  try {
    const { walletAddress, displayName } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const user = await UserService.createOrConnect({
      walletAddress,
      displayName
    });

    const isNewUser = user.created_at === user.updated_at;

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      data: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        joinedGroups: user.joined_groups,
        totalContributed: user.total_contributed,
        reputationScore: user.reputation_score,
        createdAt: user.created_at
      },
      message: isNewUser ? 'User created successfully' : 'User connected successfully'
    });
  } catch (error) {
    console.error('Error creating/connecting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create or connect user'
    });
  }
});

// PUT /api/users/:walletAddress - Update user profile
router.put('/:walletAddress', async (req, res) => {
  try {
    const { displayName, bio, avatarUrl } = req.body;
    
    const user = await UserService.updateProfile(req.params.walletAddress, {
      displayName,
      bio,
      avatarUrl
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        walletAddress: user.wallet_address,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        joinedGroups: user.joined_groups,
        totalContributed: user.total_contributed,
        reputationScore: user.reputation_score,
        createdAt: user.created_at
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// GET /api/users/:walletAddress/groups - Get user's groups
router.get('/:walletAddress/groups', async (req, res) => {
  try {
    const user = await UserService.findByWalletAddress(req.params.walletAddress);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const groups = await UserService.getUserGroups(req.params.walletAddress);

    res.json({
      success: true,
      data: {
        userId: user.id,
        walletAddress: user.wallet_address,
        joinedGroups: groups,
        groupCount: groups.length
      }
    });
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user groups'
    });
  }
});

export default router;