import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authRequired, requireRole } from '../middleware/auth.js';
import { uploadEcgController, listMineController, listPendingController, describeController, getOneController } from '../controllers/ecgController.js';

const router = Router();

// Ensure uploads dir exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
const rootUploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(rootUploadsDir)) fs.mkdirSync(rootUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rootUploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.dcm'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  return cb(new Error('Only .pdf, .png, .jpg, .jpeg, .dcm allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Routes
router.post('/upload', authRequired, requireRole('sender'), upload.single('file'), uploadEcgController);
router.get('/mine', authRequired, requireRole('sender'), listMineController);
router.get('/pending', authRequired, requireRole('reviewer'), listPendingController);
router.post('/:id/describe', authRequired, requireRole('reviewer'), describeController);
router.get('/:id', authRequired, getOneController);

export default router;
