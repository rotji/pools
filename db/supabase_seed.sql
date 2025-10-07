-- Sample data for Supabase demo/prototype
-- Run this AFTER the schema setup

-- Insert demo users
INSERT INTO users (wallet_address, display_name, bio, reputation_score) VALUES
('SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', 'Alice The Investor', 'Experienced DeFi investor focused on yield farming', 95),
('SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60', 'Bob The Trader', 'Day trader with expertise in technical analysis', 87),
('SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9', 'Carol The HODLer', 'Long-term investor in blockchain technology', 92),
('SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A', 'Dave The Newbie', 'New to crypto, learning and investing safely', 75);

-- Insert demo groups
INSERT INTO groups (
    title, 
    description, 
    contribution_amount, 
    currency, 
    max_members, 
    type, 
    status, 
    time_remaining, 
    risk_level, 
    created_by
) VALUES
(
    'STX Growth Pool #42',
    'Medium-risk investment pool focusing on STX ecosystem growth. Perfect for those looking to diversify in the Stacks ecosystem.',
    100.00,
    'STX',
    10,
    'public',
    'open',
    '3 days',
    'medium',
    (SELECT id FROM users WHERE wallet_address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7')
),
(
    'Conservative Crypto Fund',
    'Low-risk crypto investment focusing on established coins like BTC and ETH. Great for beginners!',
    250.00,
    'STX',
    15,
    'public',
    'active',
    '1 week',
    'low',
    (SELECT id FROM users WHERE wallet_address = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60')
),
(
    'DeFi Yield Farming Pool',
    'Advanced yield farming strategies across multiple protocols. High risk, high reward potential.',
    500.00,
    'STX',
    8,
    'public',
    'open',
    '5 days',
    'high',
    (SELECT id FROM users WHERE wallet_address = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9')
),
(
    'Beginner Friendly Pool',
    'Perfect for newcomers to crypto investing. Educational resources included and low minimum.',
    50.00,
    'STX',
    20,
    'public',
    'open',
    '2 weeks',
    'low',
    (SELECT id FROM users WHERE wallet_address = 'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A')
);

-- Add some members to groups
INSERT INTO group_members (group_id, user_id, wallet_address) VALUES
-- STX Growth Pool members
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 
 (SELECT id FROM users WHERE wallet_address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'),
 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 
 (SELECT id FROM users WHERE wallet_address = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 
 (SELECT id FROM users WHERE wallet_address = 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9'),
 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KTX9'),

-- Conservative Crypto Fund members
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 
 (SELECT id FROM users WHERE wallet_address = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 
 (SELECT id FROM users WHERE wallet_address = 'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A'),
 'SP2TZK01NKDC89J6TA56SA47SDF7RTHYEQ79AAB9A');

-- Add tags to groups
INSERT INTO group_tags (group_id, tag_name) VALUES
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 'DeFi'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 'Growth'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 'STX'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'), 'Public'),

((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 'Conservative'),
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 'BTC'),
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 'ETH'),
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'), 'Stable'),

((SELECT id FROM groups WHERE title = 'DeFi Yield Farming Pool'), 'DeFi'),
((SELECT id FROM groups WHERE title = 'DeFi Yield Farming Pool'), 'Yield'),
((SELECT id FROM groups WHERE title = 'DeFi Yield Farming Pool'), 'Advanced'),
((SELECT id FROM groups WHERE title = 'DeFi Yield Farming Pool'), 'High-Risk'),

((SELECT id FROM groups WHERE title = 'Beginner Friendly Pool'), 'Beginner'),
((SELECT id FROM groups WHERE title = 'Beginner Friendly Pool'), 'Educational'),
((SELECT id FROM groups WHERE title = 'Beginner Friendly Pool'), 'Low-Risk'),
((SELECT id FROM groups WHERE title = 'Beginner Friendly Pool'), 'Community');

-- Update group statistics based on members
UPDATE groups SET 
    current_members = (
        SELECT COUNT(*) 
        FROM group_members 
        WHERE group_members.group_id = groups.id
    ),
    total_contributed = (
        current_members * contribution_amount
    );

-- Insert some sample transactions
INSERT INTO transactions (group_id, user_id, amount, transaction_type, status) VALUES
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'),
 (SELECT id FROM users WHERE wallet_address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'),
 100.00, 'contribution', 'confirmed'),
((SELECT id FROM groups WHERE title = 'STX Growth Pool #42'),
 (SELECT id FROM users WHERE wallet_address = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
 100.00, 'contribution', 'confirmed'),
((SELECT id FROM groups WHERE title = 'Conservative Crypto Fund'),
 (SELECT id FROM users WHERE wallet_address = 'SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60'),
 250.00, 'contribution', 'confirmed');

-- Success message with counts
SELECT 
    'Sample data inserted successfully! 🎉' as message,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM groups) as total_groups,
    (SELECT COUNT(*) FROM group_members) as total_memberships;