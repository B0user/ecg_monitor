import { register, login } from '../services/authService.js';

export const registerController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    const user = await register({ username, email, password, role });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const data = await login({ email, password });
    res.json(data);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
