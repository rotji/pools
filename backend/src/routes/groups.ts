import express from 'express';
import { GroupService } from '../services/groupService';

const router = express.Router();

// GET /api/groups - Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await GroupService.findAll();
    
    res.json({
      success: true,
      data: groups,
      count: groups.length
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch groups'
    });
  }
});

// GET /api/groups/:id - Get specific group
router.get('/:id', async (req, res) => {
  try {
    const group = await GroupService.findById(req.params.id);
    
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
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch group'
    });
  }
});

// POST /api/groups - Create new group
router.post('/', async (req, res) => {
  try {
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

    const newGroup = await GroupService.create({
      title,
      description,
      contributionAmount: Number(contributionAmount),
      currency,
      maxMembers: Number(maxMembers),
      type,
      riskLevel,
      tags: Array.isArray(tags) ? tags : [],
      createdBy
    });

    res.status(201).json({
      success: true,
      data: newGroup,
      message: 'Group created successfully'
    });
  } catch (error) {
    console.error('Error creating group:', error);
    
    if (error instanceof Error && error.message === 'User not found') {
      return res.status(400).json({
        success: false,
        message: 'Creator wallet address not found. Please create user account first.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create group'
    });
  }
});

// POST /api/groups/:id/join - Join a group
router.post('/:id/join', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const updatedGroup = await GroupService.joinGroup(req.params.id, walletAddress);

    res.json({
      success: true,
      data: updatedGroup,
      message: 'Successfully joined group'
    });
  } catch (error) {
    console.error('Error joining group:', error);
    
    const errorMessages: Record<string, string> = {
      'User not found': 'Wallet address not found. Please create user account first.',
      'Group not found': 'Group not found',
      'Group is full': 'Group is full',
      'Already a member of this group': 'Already a member of this group'
    };
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const message = errorMessages[errorMessage] || 'Failed to join group';
    const statusCode = errorMessage === 'Group not found' ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// DELETE /api/groups/:id/leave - Leave a group
router.delete('/:id/leave', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const updatedGroup = await GroupService.leaveGroup(req.params.id, walletAddress);

    res.json({
      success: true,
      data: updatedGroup,
      message: 'Successfully left group'
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    
    const errorMessages: Record<string, string> = {
      'User not found': 'Wallet address not found',
      'Not a member of this group': 'Not a member of this group'
    };
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const message = errorMessages[errorMessage] || 'Failed to leave group';
    const statusCode = errorMessage === 'User not found' ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

export default router;