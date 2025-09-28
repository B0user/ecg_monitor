import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/utils/db.js';
import User from '../src/models/User.js';

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
  console.log('Seed complete');
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
