import express from 'express';
import { UserService } from '../services/userService';

const router = express.Router();

// POST /api/auth/register (wallet or email)
router.post('/register', async (req, res) => {
    const { walletAddress, email, password, displayName } = req.body;
    try {
        if (walletAddress) {
            // Wallet-based registration
            const user = await UserService.createOrConnect({ walletAddress, displayName });
            return res.json({ success: true, user });
        } else if (email && password) {
            // Email/password registration (simple demo, no hashing for now)
            const user = await UserService.createWithEmail({ email, password, displayName });
            return res.json({ success: true, user });
        } else {
            return res.status(400).json({ success: false, message: 'walletAddress or email/password required' });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }
});

// POST /api/auth/login (wallet or email)
router.post('/login', async (req, res) => {
    const { walletAddress, email, password } = req.body;
    try {
        if (walletAddress) {
            // Wallet-based login
            const user = await UserService.findByWalletAddress(walletAddress);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            return res.json({ success: true, user });
        } else if (email && password) {
            // Email/password login (simple demo, no hashing for now)
            const user = await UserService.findByEmailAndPassword(email, password);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            return res.json({ success: true, user });
        } else {
            return res.status(400).json({ success: false, message: 'walletAddress or email/password required' });
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
});

export default router;
