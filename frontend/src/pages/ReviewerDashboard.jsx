import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Card, CardContent, Grid, Stack, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Link as MLink } from '@mui/material';

export default function ReviewerDashboard() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    const res = await axios.get('/api/ecg/pending');
    setPending(res.data);
  };

  useEffect(() => {
    fetchPending().catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  const openDescribe = (item) => {
    setSelected(item);
    setDescription(item.description || '');
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
      await axios.post(`/api/ecg/${selected._id}/describe`, { description });
      setSelected(null);
      setDescription('');
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
                    <MLink href={item.filePath} target="_blank" rel="noreferrer">View</MLink>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" onClick={() => openDescribe(item)}>Describe</Button>
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
              <Typography variant="body2">File: <MLink href={selected.filePath} target="_blank" rel="noreferrer">Open</MLink></Typography>
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
