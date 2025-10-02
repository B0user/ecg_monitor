import mongoose from 'mongoose';

const ecgRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filePath: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'image', 'dicom'], default: 'image' },
    status: { type: String, enum: ['uploaded', 'in_review', 'described'], default: 'uploaded' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('ECGRequest', ecgRequestSchema);
