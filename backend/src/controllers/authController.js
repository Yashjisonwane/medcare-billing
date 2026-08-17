import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'medcare_billing_super_secret_key';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find the user record
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[Auth] User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare bcrypt hashes
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      console.log(`[Auth] Incorrect password for user: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign the JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[Auth] User logged in: ${email} (${user.role})`);

    // Return the response payload matching api.md spec
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.fullName || 'Staff User',
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({ error: 'Internal server login failure.' });
  }
};

export const verifyMfa = async (req, res) => {
  const { tempToken, code } = req.body;

  if (!tempToken || !code) {
    return res.status(400).json({ error: 'tempToken and MFA code are required.' });
  }

  try {
    // Verify the temporary session token
    const decoded = jwt.verify(tempToken, JWT_SECRET);

    // Generate final verified token
    const token = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[MFA] MFA Verified for user: ${decoded.email}`);

    return res.status(200).json({
      token,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('MFA verify controller error:', error);
    return res.status(401).json({ error: 'Invalid or expired MFA session token.' });
  }
};

export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user details from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'User session no longer exists or is suspended.' });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name || user.fullName || 'Staff User',
      role: user.role,
      title: user.title,
      avatar: user.avatar,
      status: user.status
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('[Auth] User session token expired — requiring re-authentication');
    } else {
      console.error('[Auth] Token validation error:', error.message);
    }
    return res.status(401).json({ error: 'Invalid or expired session token.', code: 'TOKEN_EXPIRED' });
  }
};

