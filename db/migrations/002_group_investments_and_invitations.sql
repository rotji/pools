-- Migration: Add group_investments and group_invitations tables for pooled investment logic

-- 1. Table to track each member's individual investments in a group
CREATE TABLE IF NOT EXISTS group_investments (
    id SERIAL PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(64) NOT NULL,
    amount_invested NUMERIC(20, 8) NOT NULL,
    profit_or_loss NUMERIC(20, 8), -- can be NULL until settlement
    investment_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (group_id, user_id, asset_type, investment_timestamp)
);

-- 2. Table to manage invitations for private groups
CREATE TABLE IF NOT EXISTS group_invitations (
    id SERIAL PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    invited_user_id UUID REFERENCES users(id),
    invited_email VARCHAR(255),
    status VARCHAR(16) DEFAULT 'pending', -- pending, accepted, rejected
    invited_by UUID REFERENCES users(id),
    invitation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_group_investments_group_id ON group_investments(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_group_id ON group_invitations(group_id);
