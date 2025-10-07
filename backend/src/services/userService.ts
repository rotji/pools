import pool from '../config/database';
import { User } from '../types/index';

export class UserService {
  // Find user by wallet address
  static async findByWalletAddress(walletAddress: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE wallet_address = $1';
      const result = await pool.query(query, [walletAddress]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by wallet address:', error);
      throw error;
    }
  }

  // Create new user or connect existing user
  static async createOrConnect(userData: {
    walletAddress: string;
    displayName?: string;
  }): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.findByWalletAddress(userData.walletAddress);
      
      if (existingUser) {
        // Update last activity
        const updateQuery = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE wallet_address = $1 RETURNING *';
        const result = await pool.query(updateQuery, [userData.walletAddress]);
        return result.rows[0];
      }

      // Create new user
      const insertQuery = `
        INSERT INTO users (wallet_address, display_name)
        VALUES ($1, $2)
        RETURNING *
      `;
      const displayName = userData.displayName || `User ${userData.walletAddress.slice(-4)}`;
      const result = await pool.query(insertQuery, [userData.walletAddress, displayName]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating or connecting user:', error);
      throw error;
    }
  }

  // Get all users (for demo purposes)
  static async findAll(): Promise<User[]> {
    try {
      const query = `
        SELECT 
          id,
          wallet_address,
          display_name,
          bio,
          avatar_url,
          joined_groups,
          total_contributed,
          reputation_score,
          created_at
        FROM users 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(walletAddress: string, updates: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<User | null> {
    try {
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (updates.displayName !== undefined) {
        setClause.push(`display_name = $${paramCount}`);
        values.push(updates.displayName);
        paramCount++;
      }
      
      if (updates.bio !== undefined) {
        setClause.push(`bio = $${paramCount}`);
        values.push(updates.bio);
        paramCount++;
      }
      
      if (updates.avatarUrl !== undefined) {
        setClause.push(`avatar_url = $${paramCount}`);
        values.push(updates.avatarUrl);
        paramCount++;
      }

      if (setClause.length === 0) {
        return await this.findByWalletAddress(walletAddress);
      }

      setClause.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(walletAddress);

      const query = `
        UPDATE users 
        SET ${setClause.join(', ')}
        WHERE wallet_address = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user's joined groups
  static async getUserGroups(walletAddress: string): Promise<any[]> {
    try {
      const query = `
        SELECT g.*, gt.tags
        FROM users u
        JOIN group_members gm ON u.id = gm.user_id
        JOIN groups g ON gm.group_id = g.id
        LEFT JOIN (
          SELECT group_id, ARRAY_AGG(tag_name) as tags
          FROM group_tags
          GROUP BY group_id
        ) gt ON g.id = gt.group_id
        WHERE u.wallet_address = $1
        ORDER BY gm.joined_at DESC
      `;
      const result = await pool.query(query, [walletAddress]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  }
}