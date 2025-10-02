import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config.js';
import { Box, Button, CircularProgress, Stack, Typography, Alert } from '@mui/material';

// Cornerstone stack
import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  useWebWorkers: false,
});

export default function DicomViewer() {
  const { id } = useParams();
  const elementRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    let disposed = false;
    const run = async () => {
      try {
        setLoading(true);
        setError('');
        // Get ECG record
        const res = await axios.get(`/ecg/${id}`); // baseURL set by AuthContext
        const item = res.data;
        setMeta(item);
        if (item.fileType !== 'dicom') {
          setError('Selected file is not a DICOM.');
          setLoading(false);
          return;
        }
        const url = `${API_URL}${item.filePath}`;
        const imageId = `wadouri:${url}`;

        const element = elementRef.current;
        cornerstone.enable(element);

        const image = await cornerstone.loadAndCacheImage(imageId);
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        cornerstone.displayImage(element, image, viewport);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        if (!disposed) setLoading(false);
      }
    };
    run();
    return () => {
      disposed = true;
      const el = elementRef.current;
      if (el) {
        try { cornerstone.disable(el); } catch {}
      }
    };
  }, [id]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Typography variant="h6">DICOM Viewer</Typography>
        <Button component={RouterLink} to="/reviewer" variant="outlined" size="small">Back</Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {loading && (
        <Stack alignItems="center" spacing={1}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Loading DICOM...</Typography>
        </Stack>
      )}
      <Box ref={elementRef} sx={{ width: '100%', height: 600, bgcolor: 'black' }} />
      {meta && (
        <Typography variant="body2" color="text.secondary">Source: {API_URL}{meta.filePath}</Typography>
      )}
    </Stack>
  );
}
