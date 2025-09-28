import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Card, CardContent, LinearProgress, Stack, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Link as MLink } from '@mui/material';

export default function SenderDashboard() {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [list, setList] = useState([]);

  const fetchMine = async () => {
    const res = await axios.get('/api/ecg/mine');
    setList(res.data);
  };

  useEffect(() => {
    fetchMine().catch(() => {});
  }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('file', file);
      await axios.post('/api/ecg/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Upload successful');
      setFile(null);
      await fetchMine();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadDescription = (item) => {
    const blob = new Blob([item.description || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecg_${item._id}_description.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Upload ECG (.pdf, .png, .jpg)</Typography>
          {submitting && <LinearProgress sx={{ mb: 2 }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={onUpload}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button variant="outlined" component="label">
                Choose File
                <input hidden type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
              <TextField value={file?.name || ''} placeholder="No file chosen" InputProps={{ readOnly: true }} sx={{ flex: 1 }} />
              <Button type="submit" variant="contained" disabled={submitting}>Upload</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>My Requests</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Created</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <MLink href={item.filePath} target="_blank" rel="noreferrer">View</MLink>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {item.status === 'described' ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ maxWidth: 360, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</Typography>
                        <Button size="small" onClick={() => downloadDescription(item)}>Download</Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Not ready</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body2" color="text.secondary">No uploads yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
