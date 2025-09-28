import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sender@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'sender' ? '/sender' : '/reviewer');
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" variant="contained" disabled={loading}>Login</Button>
              <Typography variant="body2" color="text.secondary">
                Tip: Use sender@example.com or reviewer@example.com with password123 (from seed)
              </Typography>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
