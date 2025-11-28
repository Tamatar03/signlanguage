import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { dbCreateUser, dbGetUser } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !password || !displayName || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await dbGetUser(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await dbCreateUser({
      email,
      password: hashedPassword,
      displayName,
      role: role as 'student' | 'teacher'
    });

    // Don't send password to client
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Sign up error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
