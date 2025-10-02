import React, { useMemo } from 'react';
import { Card, CardContent, Grid, Stack, Typography, Chip, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

function StatCard({ label, value, color = 'primary' }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">{label}</Typography>
          <Typography variant="h5">{value}</Typography>
          <Chip size="small" color={color} label="Sample" sx={{ alignSelf: 'start' }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  // Sample aggregated metrics
  const stats = {
    total: 128,
    uploaded: 34,
    inReview: 21,
    described: 73,
  };

  const weeklyData = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      labels,
      datasets: [
        { label: 'Uploads', data: [5, 7, 4, 10, 6, 3, 4], borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.2)', tension: 0.3 },
        { label: 'Described', data: [3, 5, 2, 7, 5, 2, 3], borderColor: '#2e7d32', backgroundColor: 'rgba(46,125,50,0.2)', tension: 0.3 },
      ],
    };
  }, []);

  const perTypeData = useMemo(() => ({
    labels: ['PDF', 'Image', 'DICOM'],
    datasets: [{
      label: 'By File Type',
      data: [52, 61, 15],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffb74d'],
    }],
  }), []);

  const tatData = useMemo(() => ({
    labels: ['< 2h', '2-6h', '6-12h', '12-24h', '> 24h'],
    datasets: [{
      label: 'Turnaround Time (cases)',
      data: [18, 24, 16, 9, 6],
      backgroundColor: '#7e57c2',
    }],
  }), []);

  const goMain = () => {
    if (!user) return navigate('/login');
    navigate(user.role === 'reviewer' ? '/reviewer' : '/sender');
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">{t('dashboard.title')} ({t('dashboard.subtitle')})</Typography>
            <Button variant="contained" size="large" onClick={goMain} fullWidth sx={{ py: 2 }}>
              {user?.role === 'reviewer' ? t('dashboard.cta.reviewer') : t('dashboard.cta.sender')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><StatCard label="Total ECGs" value={stats.total} color="primary" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Uploaded" value={stats.uploaded} color="info" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="In Review" value={stats.inReview} color="warning" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Described" value={stats.described} color="success" /></Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Weekly Volume</Typography>
              <Line data={weeklyData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>By File Type</Typography>
              <Doughnut data={perTypeData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Turnaround Time Distribution</Typography>
              <Bar data={tatData} options={{ scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider />
      <Typography variant="body2" color="text.secondary">All values above are mock data for demonstration.</Typography>
    </Stack>
  );
}
