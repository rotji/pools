// Basic API Response Types for Demo
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Group Types - keeping it simple for demo
export interface Group {
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

// User Types - minimal for demo
export interface User {
  id: string;
  walletAddress: string;
  displayName?: string;
  joinedGroups: string[];
  createdAt: string;
  lastActive: string;
}

// Request Types
export interface CreateGroupRequest {
  title: string;
  description: string;
  contributionAmount: number;
  currency?: string;
  maxMembers?: number;
  type?: 'public' | 'private';
  riskLevel?: 'low' | 'medium' | 'high';
  tags?: string[];
  createdBy: string;
}

export interface JoinGroupRequest {
  walletAddress: string;
}

export interface CreateUserRequest {
  walletAddress: string;
  displayName?: string;
}