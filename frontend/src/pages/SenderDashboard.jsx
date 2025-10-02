import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Box, Button, Card, CardContent, LinearProgress, Stack, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Link as MLink, Chip } from '@mui/material';
import { API_URL } from '../config.js';
import { API } from '../api/index.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function SenderDashboard() {
  const { t } = useI18n();
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [list, setList] = useState([]);

  const fetchMine = async () => {
    const res = await API.listMine();
    setList(res);
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
      await API.upload(file);
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
          <Typography variant="h6" gutterBottom>{t('sender.upload.title')}</Typography>
          {submitting && <LinearProgress sx={{ mb: 2 }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={onUpload}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button variant="outlined" component="label">
                {t('sender.upload.title')}
                <input hidden type="file" accept=".pdf,.png,.jpg,.jpeg,.dcm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
              <TextField value={file?.name || ''} placeholder="No file chosen" InputProps={{ readOnly: true }} sx={{ flex: 1 }} />
              <Button type="submit" variant="contained" disabled={submitting}>Upload</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>{t('sender.myrequests')}</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('table.created')}</TableCell>
                <TableCell>{t('table.file')}</TableCell>
                <TableCell>{t('table.status')}</TableCell>
                <TableCell>{t('table.type')}</TableCell>
                <TableCell>{t('table.description')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <MLink href={`${API_URL}${item.filePath}`} target="_blank" rel="noreferrer">View</MLink>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {item.fileType === 'dicom' && <Chip label="DICOM" size="small" color="primary" />}
                    {item.fileType === 'pdf' && <Chip label="PDF" size="small" />}
                    {item.fileType === 'image' && <Chip label="Image" size="small" />}
                  </TableCell>
                  <TableCell>
                    {item.status === 'described' ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ maxWidth: 360, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</Typography>
                        <Button size="small" onClick={() => downloadDescription(item)}>Download</Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">{t('table.nodata')}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary">{t('table.nodata')}</Typography>
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
