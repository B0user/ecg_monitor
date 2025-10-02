import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/utils/db.js';
import User from '../src/models/User.js';
import ECGRequest from '../src/models/ECGRequest.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const run = async () => {
  await connectDB();
  const senderEmail = 'sender@example.com';
  const reviewerEmail = 'reviewer@example.com';

  const senderPass = 'password123';
  const reviewerPass = 'password123';

  const senderHash = await bcrypt.hash(senderPass, 10);
  const reviewerHash = await bcrypt.hash(reviewerPass, 10);

  const ops = [];
  ops.push(
    User.updateOne(
      { email: senderEmail },
      { $setOnInsert: { username: 'sender1', email: senderEmail, passwordHash: senderHash, role: 'sender' } },
      { upsert: true }
    )
  );
  ops.push(
    User.updateOne(
      { email: reviewerEmail },
      { $setOnInsert: { username: 'reviewer1', email: reviewerEmail, passwordHash: reviewerHash, role: 'reviewer' } },
      { upsert: true }
    )
  );

  await Promise.all(ops);

  // Fetch created users
  const sender = await User.findOne({ email: senderEmail });
  const reviewer = await User.findOne({ email: reviewerEmail });

  // Ensure placeholder files exist
  const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const placeholders = [
    { name: 'sample1.pdf', content: '%PDF-1.4\n% placeholder pdf' },
    { name: 'sample2.jpg', content: 'JPEG_PLACEHOLDER' },
    { name: 'sample3.png', content: 'PNG_PLACEHOLDER' },
    { name: 'sample4.dcm', content: 'DICM_PLACEHOLDER' },
    { name: 'sample5.pdf', content: '%PDF-1.4\n% placeholder pdf 2' },
  ];
  for (const f of placeholders) {
    const p = path.join(uploadsDir, f.name);
    if (!fs.existsSync(p)) fs.writeFileSync(p, f.content);
  }

  // Clear previous demo ECGRequests to avoid duplicates
  await ECGRequest.deleteMany({ description: { $regex: '^SEED_', $options: 'i' } });

  // Create 5 ECG requests with various statuses
  const now = new Date();
  const make = (file, type, status, desc, reviewerId) => ({
    senderId: sender._id,
    reviewerId: reviewerId || undefined,
    filePath: `/uploads/${file}`,
    fileType: type,
    status,
    description: desc || '',
    createdAt: now,
    updatedAt: now,
  });

  const records = [
    make('sample1.pdf', 'pdf', 'uploaded', 'SEED_uploaded_pdf'),
    make('sample2.jpg', 'image', 'uploaded', 'SEED_uploaded_image'),
    make('sample3.png', 'image', 'in_review', 'SEED_in_review', reviewer._id),
    make('sample5.pdf', 'pdf', 'described', 'SEED_report: Normal sinus rhythm', reviewer._id),
    make('sample4.dcm', 'dicom', 'described', 'SEED_report: DICOM case described', reviewer._id),
  ];

  await ECGRequest.insertMany(records);
  console.log('Seed complete');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
