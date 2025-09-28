import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async ({ username, email, password, role }) => {
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new Error('User already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash, role });
  return { id: user._id, username: user.username, email: user.email, role: user.role };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};
