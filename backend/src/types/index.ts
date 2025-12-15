// Group Investment Type
export interface GroupInvestment {
  id: string;
  group_id: string;
  user_id: string;
  asset_type: string;
  amount_invested: number;
  profit_or_loss?: number;
  investment_timestamp: string;
}

// Group Invitation Type
export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_user_id?: string;
  invited_email?: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_by: string;
  invitation_timestamp: string;
}
// Basic API Response Types for Demo
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Database User Type (matches PostgreSQL schema)
export interface User {
  id: string;
  wallet_address: string;
  display_name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  joined_groups: number;
  total_contributed: number;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

// Database Group Type (matches PostgreSQL schema)
export interface Group {
  id: string;
  title: string;
  description: string;
  contribution_amount: number;
  currency: string;
  current_members: number;
  max_members: number;
  type: 'public' | 'private';
  status: 'open' | 'active' | 'settled' | 'closed';
  time_remaining: string;
  total_contributed: number;
  risk_level: 'low' | 'medium' | 'high';
  created_by: string;
  created_at: string;
  updated_at: string;
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