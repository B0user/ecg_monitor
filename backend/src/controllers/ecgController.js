import { createUpload, listMine, listPending, describeEcg } from '../services/ecgService.js';
import path from 'path';
import ECGRequest from '../models/ECGRequest.js';

export const uploadEcgController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'image';
    if (ext === '.pdf') fileType = 'pdf';
    else if (ext === '.dcm') fileType = 'dicom';
    else fileType = 'image';
    const rec = await createUpload({ senderId: req.user.id, filePath: `/uploads/${req.file.filename}`, fileType });
    res.status(201).json(rec);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listMineController = async (req, res) => {
  try {
    const list = await listMine({ senderId: req.user.id });
    res.json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listPendingController = async (req, res) => {
  try {
    const list = await listPending();
    res.json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const describeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Description required' });
    const item = await describeEcg({ id, reviewerId: req.user.id, description });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOneController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ECGRequest.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
