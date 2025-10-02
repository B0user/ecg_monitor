import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Button, Typography, IconButton, Drawer, List, ListItemButton, ListItemText, Divider, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import SenderDashboard from './pages/SenderDashboard.jsx';
import ReviewerDashboard from './pages/ReviewerDashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useI18n } from './i18n/I18nContext.jsx';

function NavBar({ onMenu }) {
  const { user, logout } = useAuth();
  const { t, toggle, lang } = useI18n();
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
        {user && (
          <IconButton color="inherit" onClick={onMenu} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{t('nav.title')}</Typography>
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">{t('nav.login')}</Button>
            <Button color="inherit" component={Link} to="/register">{t('nav.register')}</Button>
          </>
        )}
        {user && (
          <>
            <Button color="inherit" component={Link} to="/dashboard">{t('nav.dashboard')}</Button>
            {user.role === 'sender' && (
              <Button color="inherit" component={Link} to="/sender">{t('nav.sender')}</Button>
            )}
            {user.role === 'reviewer' && (
              <Button color="inherit" component={Link} to="/reviewer">{t('nav.reviewer')}</Button>
            )}
            <Button color="inherit" onClick={toggle}>{lang === 'en' ? 'RU' : 'EN'}</Button>
            <Button color="inherit" onClick={logout}>{t('nav.logout')}</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'sender' ? '/sender' : '/reviewer'} replace />;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = React.useState(false);

  const Sidebar = (
    <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        <ListItemButton component={Link} to="/dashboard"><ListItemText primary={t('nav.dashboard')} /></ListItemButton>
        {user?.role === 'sender' && (
          <ListItemButton component={Link} to="/sender"><ListItemText primary={t('nav.sender')} /></ListItemButton>
        )}
        {user?.role === 'reviewer' && (
          <ListItemButton component={Link} to="/reviewer"><ListItemText primary={t('nav.reviewer')} /></ListItemButton>
        )}
      </List>
      <Divider />
      <List>
        <ListItemButton component={Link} to="/login"><ListItemText primary={t('nav.login')} /></ListItemButton>
        <ListItemButton component={Link} to="/register"><ListItemText primary={t('nav.register')} /></ListItemButton>
      </List>
    </Box>
  );
  return (
    <>
      <NavBar onMenu={() => setOpen(true)} />
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        {Sidebar}
      </Drawer>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sender" element={<ProtectedRoute role="sender"><SenderDashboard /></ProtectedRoute>} />
          <Route path="/reviewer" element={<ProtectedRoute role="reviewer"><ReviewerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Typography>Not Found</Typography>} />
        </Routes>
      </Container>
    </>
  );
}
