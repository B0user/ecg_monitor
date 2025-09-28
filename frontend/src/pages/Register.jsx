import React, { useState } from 'react';
import { Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'sender' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(form);
      setSuccess('Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Card sx={{ width: 480 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Register</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField name="username" label="Username" value={form.username} onChange={onChange} required />
              <TextField name="email" label="Email" type="email" value={form.email} onChange={onChange} required />
              <TextField name="password" label="Password" type="password" value={form.password} onChange={onChange} required />
              <TextField select name="role" label="Role" value={form.role} onChange={onChange}>
                <MenuItem value="sender">Sender</MenuItem>
                <MenuItem value="reviewer">Reviewer</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" disabled={loading}>Register</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
