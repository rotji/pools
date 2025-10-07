import pool from '../config/database';
import { Group } from '../types/index';

export class GroupService {
  // Get all groups with tags and creator info
  static async findAll(): Promise<any[]> {
    try {
      const query = `
        SELECT 
          g.*,
          u.display_name as created_by_name,
          u.wallet_address as created_by_wallet,
          COALESCE(gt.tags, ARRAY[]::text[]) as tags
        FROM groups g
        LEFT JOIN users u ON g.created_by = u.id
        LEFT JOIN (
          SELECT group_id, ARRAY_AGG(tag_name) as tags
          FROM group_tags
          GROUP BY group_id
        ) gt ON g.id = gt.group_id
        ORDER BY g.created_at DESC
      `;
      const result = await pool.query(query);
      
      // Transform to match frontend expectations
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        contributionAmount: parseFloat(row.contribution_amount),
        currency: row.currency,
        currentMembers: row.current_members,
        maxMembers: row.max_members,
        type: row.type,
        status: row.status,
        timeRemaining: row.time_remaining,
        totalContributed: parseFloat(row.total_contributed),
        riskLevel: row.risk_level,
        createdBy: row.created_by_wallet,
        createdAt: row.created_at,
        tags: row.tags || [],
        members: [] // Will be populated separately if needed
      }));
    } catch (error) {
      console.error('Error finding all groups:', error);
      throw error;
    }
  }

  // Find group by ID
  static async findById(id: string): Promise<any | null> {
    try {
      const query = `
        SELECT 
          g.*,
          u.display_name as created_by_name,
          u.wallet_address as created_by_wallet,
          COALESCE(gt.tags, ARRAY[]::text[]) as tags,
          COALESCE(gm.members, ARRAY[]::text[]) as members
        FROM groups g
        LEFT JOIN users u ON g.created_by = u.id
        LEFT JOIN (
          SELECT group_id, ARRAY_AGG(tag_name) as tags
          FROM group_tags
          GROUP BY group_id
        ) gt ON g.id = gt.group_id
        LEFT JOIN (
          SELECT group_id, ARRAY_AGG(wallet_address) as members
          FROM group_members
          GROUP BY group_id
        ) gm ON g.id = gm.group_id
        WHERE g.id = $1
      `;
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) return null;
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        contributionAmount: parseFloat(row.contribution_amount),
        currency: row.currency,
        currentMembers: row.current_members,
        maxMembers: row.max_members,
        type: row.type,
        status: row.status,
        timeRemaining: row.time_remaining,
        totalContributed: parseFloat(row.total_contributed),
        riskLevel: row.risk_level,
        createdBy: row.created_by_wallet,
        createdAt: row.created_at,
        tags: row.tags || [],
        members: row.members || []
      };
    } catch (error) {
      console.error('Error finding group by ID:', error);
      throw error;
    }
  }

  // Create new group
  static async create(groupData: {
    title: string;
    description: string;
    contributionAmount: number;
    currency?: string;
    maxMembers?: number;
    type?: 'public' | 'private';
    riskLevel?: 'low' | 'medium' | 'high';
    tags?: string[];
    createdBy: string; // wallet address
  }): Promise<any> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get user ID from wallet address
      const userQuery = 'SELECT id FROM users WHERE wallet_address = $1';
      const userResult = await client.query(userQuery, [groupData.createdBy]);
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userResult.rows[0].id;

      // Insert group
      const groupQuery = `
        INSERT INTO groups (
          title, description, contribution_amount, currency, 
          max_members, type, risk_level, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const groupValues = [
        groupData.title,
        groupData.description,
        groupData.contributionAmount,
        groupData.currency || 'STX',
        groupData.maxMembers || 10,
        groupData.type || 'public',
        groupData.riskLevel || 'medium',
        userId
      ];
      
      const groupResult = await client.query(groupQuery, groupValues);
      const newGroup = groupResult.rows[0];

      // Add tags if provided
      if (groupData.tags && groupData.tags.length > 0) {
        for (const tag of groupData.tags) {
          await client.query(
            'INSERT INTO group_tags (group_id, tag_name) VALUES ($1, $2)',
            [newGroup.id, tag]
          );
        }
      }

      // Add creator as first member
      await client.query(
        'INSERT INTO group_members (group_id, user_id, wallet_address) VALUES ($1, $2, $3)',
        [newGroup.id, userId, groupData.createdBy]
      );

      // Update group stats
      await client.query(
        'UPDATE groups SET current_members = 1, total_contributed = contribution_amount WHERE id = $1',
        [newGroup.id]
      );

      await client.query('COMMIT');

      // Return the created group in the expected format
      return {
        id: newGroup.id,
        title: newGroup.title,
        description: newGroup.description,
        contributionAmount: parseFloat(newGroup.contribution_amount),
        currency: newGroup.currency,
        currentMembers: 1,
        maxMembers: newGroup.max_members,
        type: newGroup.type,
        status: newGroup.status,
        timeRemaining: newGroup.time_remaining,
        totalContributed: parseFloat(newGroup.contribution_amount),
        riskLevel: newGroup.risk_level,
        createdBy: groupData.createdBy,
        createdAt: newGroup.created_at,
        tags: groupData.tags || [],
        members: [groupData.createdBy]
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating group:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Join a group
  static async joinGroup(groupId: string, walletAddress: string): Promise<any> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get user ID
      const userQuery = 'SELECT id FROM users WHERE wallet_address = $1';
      const userResult = await client.query(userQuery, [walletAddress]);
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userResult.rows[0].id;

      // Check if group exists and has space
      const groupQuery = 'SELECT * FROM groups WHERE id = $1';
      const groupResult = await client.query(groupQuery, [groupId]);
      
      if (groupResult.rows.length === 0) {
        throw new Error('Group not found');
      }
      
      const group = groupResult.rows[0];
      
      if (group.current_members >= group.max_members) {
        throw new Error('Group is full');
      }

      // Check if user already joined
      const memberCheck = await client.query(
        'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      
      if (memberCheck.rows.length > 0) {
        throw new Error('Already a member of this group');
      }

      // Add member
      await client.query(
        'INSERT INTO group_members (group_id, user_id, wallet_address) VALUES ($1, $2, $3)',
        [groupId, userId, walletAddress]
      );

      // Update group stats
      await client.query(`
        UPDATE groups SET 
          current_members = current_members + 1,
          total_contributed = total_contributed + contribution_amount,
          status = CASE 
            WHEN current_members + 1 >= max_members THEN 'active'
            ELSE status
          END
        WHERE id = $1
      `, [groupId]);

      await client.query('COMMIT');

      // Return updated group
      return await this.findById(groupId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error joining group:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Leave a group
  static async leaveGroup(groupId: string, walletAddress: string): Promise<any> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get user ID
      const userQuery = 'SELECT id FROM users WHERE wallet_address = $1';
      const userResult = await client.query(userQuery, [walletAddress]);
      
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userResult.rows[0].id;

      // Check if user is a member
      const memberCheck = await client.query(
        'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );
      
      if (memberCheck.rows.length === 0) {
        throw new Error('Not a member of this group');
      }

      // Remove member
      await client.query(
        'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
      );

      // Update group stats
      await client.query(`
        UPDATE groups SET 
          current_members = current_members - 1,
          total_contributed = total_contributed - contribution_amount,
          status = CASE 
            WHEN current_members - 1 < max_members AND status = 'active' THEN 'open'
            ELSE status
          END
        WHERE id = $1
      `, [groupId]);

      await client.query('COMMIT');

      // Return updated group
      return await this.findById(groupId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error leaving group:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}