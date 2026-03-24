const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Resend } = require('resend');

exports.googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = await User.create({
                name,
                email: email.toLowerCase(),
                password: 'google-oauth',
                isGoogleUser: true
            });
        }
        res.json({ token: generateToken(user._id), user: { name: user.name, email: user.email, isAdmin: false } });
    } catch {
        res.status(500).json({ message: 'Google authentication failed' });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
        if (await User.findOne({ email: email.toLowerCase() })) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email: email.toLowerCase(), password: hashedPassword });
        await user.save();
        res.status(201).json({ token: generateToken(user._id), user: { name, email: user.email } });
    } catch {
        res.status(500).json({ message: 'Signup failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        if (email === 'admin@gmail.com' && password === 'admin123') {
            return res.json({ token: generateToken('admin'), user: { name: 'Admin', email, isAdmin: true } });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || user.isGoogleUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ token: generateToken(user._id), user: { name: user.name, email: user.email, isAdmin: false } });
    } catch {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const user = await User.findOne({ email: email.toLowerCase() });
        // Always return success to prevent email enumeration
        if (!user || user.isGoogleUser) {
            return res.json({ message: 'If that email exists, a reset link has been sent' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: 'Owen Express <onboarding@resend.dev>',
            to: user.email,
            subject: 'Password Reset — Owen Express',
            html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password. It expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, ignore this email.</p>`
        });
        if (error) {
            console.error('Resend error:', JSON.stringify(error));
            return res.status(500).json({ message: 'Failed to send reset email', error });
        }
        console.log('Resend success:', data?.id);
        res.json({ message: 'If that email exists, a reset link has been sent' });
    } catch (err) {
        console.error('forgotPassword error:', err.message);
        res.status(500).json({ message: 'Failed to send reset email', error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: 'Token and password are required' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
        const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.json({ message: 'Password reset successful' });
    } catch {
        res.status(500).json({ message: 'Password reset failed' });
    }
};

exports.verifyAuth = async (req, res) => {
    try {
        if (req.userId === 'admin') {
            return res.json({ user: { name: 'Admin', email: 'admin@gmail.com', isAdmin: true } });
        }
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: { name: user.name, email: user.email, isAdmin: false } });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed' });
    }
};
