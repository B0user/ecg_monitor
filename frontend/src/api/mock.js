// Simple demo-mode mock API: returns in-memory sample data
import { v4 as uuid } from 'uuid';

// Build some demo records
const now = Date.now();
const make = (over = {}) => ({
  _id: uuid(),
  senderId: 'demo-sender',
  reviewerId: null,
  filePath: '/uploads/sample1.pdf',
  fileType: 'pdf',
  status: 'uploaded',
  description: '',
  createdAt: new Date(now - Math.floor(Math.random() * 7) * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  ...over,
});

let mine = [
  make({ filePath: '/uploads/sample1.pdf', fileType: 'pdf', status: 'uploaded' }),
  make({ filePath: '/uploads/sample2.jpg', fileType: 'image', status: 'in_review' }),
  make({ filePath: '/uploads/sample5.pdf', fileType: 'pdf', status: 'described', description: 'Normal sinus rhythm; no acute changes.' }),
];

let pending = [
  make({ filePath: '/uploads/sample3.png', fileType: 'image', status: 'uploaded' }),
  make({ filePath: '/uploads/sample2.jpg', fileType: 'image', status: 'in_review' }),
];

export const mockApi = {
  login: async (email, password) => {
    const role = /reviewer/i.test(email) ? 'reviewer' : 'sender';
    return {
      token: 'demo-token',
      user: { id: role === 'reviewer' ? 'demo-reviewer' : 'demo-sender', username: role, email, role },
    };
  },
  register: async (payload) => ({ user: { id: 'demo-user', ...payload } }),
  listMine: async () => mine,
  upload: async (file) => {
    const rec = make({ filePath: `/uploads/${file.name}`, fileType: inferType(file.name), status: 'uploaded' });
    mine = [rec, ...mine];
    return rec;
  },
  listPending: async () => pending,
  describe: async (id, description) => {
    pending = pending.map((p) => (p._id === id ? { ...p, status: 'described', description } : p));
    return pending.find((p) => p._id === id) || null;
  },
  getOne: async (id) => [...mine, ...pending].find((x) => x._id === id) || null,
};

function inferType(name) {
  const ext = name.toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
  if (ext === 'dcm') return 'dicom';
  return 'image';
}
