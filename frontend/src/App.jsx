import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SenderDashboard from './pages/SenderDashboard.jsx';
import ReviewerDashboard from './pages/ReviewerDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

function NavBar() {
  const { user, logout } = useAuth();
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>ECG Outsourcing</Typography>
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
        {user && (
          <>
            {user.role === 'sender' && (
              <Button color="inherit" component={Link} to="/sender">Sender</Button>
            )}
            {user.role === 'reviewer' && (
              <Button color="inherit" component={Link} to="/reviewer">Reviewer</Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'sender' ? '/sender' : '/reviewer'} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <NavBar />
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sender" element={<ProtectedRoute role="sender"><SenderDashboard /></ProtectedRoute>} />
          <Route path="/reviewer" element={<ProtectedRoute role="reviewer"><ReviewerDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Typography>Not Found</Typography>} />
        </Routes>
      </Container>
    </>
  );
}
