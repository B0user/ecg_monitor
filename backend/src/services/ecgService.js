import path from 'path';
import ECGRequest from '../models/ECGRequest.js';

export const createUpload = async ({ senderId, filePath }) => {
  return ECGRequest.create({ senderId, filePath });
};

export const listMine = async ({ senderId }) => {
  return ECGRequest.find({ senderId }).sort({ createdAt: -1 });
};

export const listPending = async () => {
  return ECGRequest.find({ status: { $in: ['uploaded', 'in_review'] } }).sort({ createdAt: 1 });
};

export const describeEcg = async ({ id, reviewerId, description }) => {
  const item = await ECGRequest.findById(id);
  if (!item) throw new Error('Not found');
  item.reviewerId = reviewerId;
  item.description = description;
  item.status = 'described';
  await item.save();
  return item;
};
