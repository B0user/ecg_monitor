import axios from 'axios';
import { DEMO } from '../config.js';
import { mockApi } from './mock.js';

const realApi = {
  login: (email, password) => axios.post('/auth/login', { email, password }).then(r => r.data),
  register: (payload) => axios.post('/auth/register', payload).then(r => r.data),
  listMine: () => axios.get('/ecg/mine').then(r => r.data),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return axios.post('/ecg/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  listPending: () => axios.get('/ecg/pending').then(r => r.data),
  describe: (id, description) => axios.post(`/ecg/${id}/describe`, { description }).then(r => r.data),
  getOne: (id) => axios.get(`/ecg/${id}`).then(r => r.data),
};

export const API = DEMO ? mockApi : realApi;
