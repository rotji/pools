/**
 * Group Service
 * Handles all group-related API operations
 */

import { api } from './api';
import type { ApiResponse } from './api';

// Group data types
export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  targetAmount: number;
  currentAmount: number;
  memberCount: number;
  maxMembers: number;
  investmentPeriod: number; // in days
  createdBy: string;
  createdAt: string;
  status: 'active' | 'closed' | 'completed';
  joinCode?: string; // for private groups
}

export interface CreateGroupData {
  name: string;
  description: string;
  type: 'public' | 'private';
  category: string;
  targetAmount: number;
  maxMembers: number;
  investmentPeriod: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  walletAddress: string;
  contributionAmount: number;
  joinedAt: string;
  status: 'active' | 'pending' | 'withdrawn';
}

export interface JoinGroupData {
  groupId: string;
  contributionAmount: number;
  joinCode?: string; // for private groups
}

// Group API service
export class GroupService {
  /**
   * Get all public groups with optional filtering
   */
  static async getPublicGroups(filters?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ groups: Group[]; total: number; page: number; limit: number }>> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/groups${queryString ? `?${queryString}` : ''}`;
    
    return api.get(url);
  }

  /**
   * Get a specific group by ID
   */
  static async getGroupById(groupId: string): Promise<ApiResponse<Group>> {
    return api.get(`/groups/${groupId}`);
  }

  /**
   * Create a new group
   */
  static async createGroup(groupData: CreateGroupData): Promise<ApiResponse<Group>> {
    return api.post('/groups', groupData);
  }

  /**
   * Join a group
   */
  static async joinGroup(joinData: JoinGroupData): Promise<ApiResponse<{ message: string }>> {
    return api.post(`/groups/${joinData.groupId}/join`, {
      contributionAmount: joinData.contributionAmount,
      joinCode: joinData.joinCode,
    });
  }

  /**
   * Get group members
   */
  static async getGroupMembers(groupId: string): Promise<ApiResponse<GroupMember[]>> {
    return api.get(`/groups/${groupId}/members`);
  }

  /**
   * Get user's groups
   */
  static async getUserGroups(userId?: string): Promise<ApiResponse<Group[]>> {
    const url = userId ? `/users/${userId}/groups` : '/users/me/groups';
    return api.get(url);
  }

  /**
   * Leave a group
   */
  static async leaveGroup(groupId: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete(`/groups/${groupId}/members/me`);
  }

  /**
   * Update group (owner only)
   */
  static async updateGroup(groupId: string, updates: Partial<CreateGroupData>): Promise<ApiResponse<Group>> {
    return api.put(`/groups/${groupId}`, updates);
  }

  /**
   * Close group (owner only)
   */
  static async closeGroup(groupId: string): Promise<ApiResponse<{ message: string }>> {
    return api.post(`/groups/${groupId}/close`);
  }

  /**
   * Get group statistics
   */
  static async getGroupStats(groupId: string): Promise<ApiResponse<{
    totalContributions: number;
    averageContribution: number;
    memberGrowth: Array<{ date: string; count: number }>;
    contributionHistory: Array<{ date: string; amount: number }>;
  }>> {
    return api.get(`/groups/${groupId}/stats`);
  }
}

export default GroupService;