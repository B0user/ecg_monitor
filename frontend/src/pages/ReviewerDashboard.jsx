import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Link as MLink } from '@mui/material';
import { API_URL } from '../config.js';
import { API } from '../api/index.js';

export default function ReviewerDashboard() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    const res = await API.listPending();
    setPending(res);
  };

  useEffect(() => {
    fetchPending().catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  const openDescribe = (item) => {
    setSelected(item);
    setDescription(item.description || '');
  };

  // Structured report fields for demo mode
  const [hr, setHr] = useState('72');
  const [rhythm, setRhythm] = useState('Normal sinus rhythm');
  const [pr, setPr] = useState('160 ms');
  const [qrs, setQrs] = useState('90 ms');
  const [qt, setQt] = useState('400 ms');
  const [findings, setFindings] = useState({ st: 'No ST changes', axis: 'Normal axis', hypertrophy: 'No LVH' });

  const generateReport = () => {
    const parts = [
      `Heart rate: ${hr} bpm`,
      `Rhythm: ${rhythm}`,
      `Intervals: PR ${pr}, QRS ${qrs}, QT ${qt}`,
      `Axis: ${findings.axis}`,
      `ST-T: ${findings.st}`,
      `Hypertrophy: ${findings.hypertrophy}`,
    ];
    setDescription(parts.join('\n'));
  };

  const onDescribe = async () => {
    if (!selected) return;
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await API.describe(selected._id, description);
      setSelected(null);
      setDescription('');
      setHr('72'); setRhythm('Normal sinus rhythm'); setPr('160 ms'); setQrs('90 ms'); setQt('400 ms');
      await fetchPending();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Pending ECGs</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Uploaded</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <MLink href={`${API_URL}${item.filePath}`} target="_blank" rel="noreferrer">View</MLink>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="contained" onClick={() => openDescribe(item)}>Describe</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary">No pending items.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Describe ECG</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2">File: <MLink href={`${API_URL}${selected.filePath}`} target="_blank" rel="noreferrer">Open</MLink></Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField label="Heart rate (bpm)" value={hr} onChange={(e)=>setHr(e.target.value)} /></Grid>
                <Grid item xs={6}><TextField label="Rhythm" value={rhythm} onChange={(e)=>setRhythm(e.target.value)} /></Grid>
                <Grid item xs={4}><TextField label="PR" value={pr} onChange={(e)=>setPr(e.target.value)} /></Grid>
                <Grid item xs={4}><TextField label="QRS" value={qrs} onChange={(e)=>setQrs(e.target.value)} /></Grid>
                <Grid item xs={4}><TextField label="QT" value={qt} onChange={(e)=>setQt(e.target.value)} /></Grid>
                <Grid item xs={4}><TextField label="Axis" value={findings.axis} onChange={(e)=>setFindings({...findings, axis: e.target.value})} /></Grid>
                <Grid item xs={4}><TextField label="ST-T" value={findings.st} onChange={(e)=>setFindings({...findings, st: e.target.value})} /></Grid>
                <Grid item xs={4}><TextField label="Hypertrophy" value={findings.hypertrophy} onChange={(e)=>setFindings({...findings, hypertrophy: e.target.value})} /></Grid>
              </Grid>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={generateReport}>Auto-generate</Button>
              </Stack>
              <TextField
                label="Description"
                multiline
                minRows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your report..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={onDescribe} disabled={submitting}>Mark Described</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
