# ECG Outsourcing MVP

Minimal MERN app for remote ECG outsourcing.

## Stack
- Backend: Node.js + Express (port 2099)
- Frontend: React + Vite (port 3099)
- DB: MongoDB (Mongoose)
- Auth: JWT

## Setup

### Prereqs
- Node 18+
- MongoDB running locally or Atlas

### Backend
1. `cd backend`
2. Copy `.env.example` to `.env` and adjust:
```
PORT=2099
MONGODB_URI=mongodb://127.0.0.1:27017/ecg_outsourcing
JWT_SECRET=supersecretjwtkey
```
3. Install deps and seed users:
```
npm i
npm run seed
```
4. Start server:
```
npm run dev
```
API runs at `http://localhost:2099`. Static uploads served at `/uploads`.

Seeded users:
- sender@example.com / password123 (role: sender)
- reviewer@example.com / password123 (role: reviewer)

### Frontend
1. In another terminal: `cd frontend`
2. Install deps: `npm i`
3. Start dev server: `npm run dev`
4. Open `http://localhost:3099`

The Vite dev server proxies `/api` and `/uploads` to the backend.

## Features
- Sender can upload ECG (.pdf/.png/.jpg/.dcm), view status, and download description when ready.
- Reviewer sees pending ECGs, opens one, writes description, and marks as "described".
- DICOM support: DICOM files are stored under `uploads/` and can be viewed via a simple Cornerstone-based viewer at `/viewer/:id` (reviewer only).

## Project Structure

```
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
  uploads/
  seed/seed.js
  .env.example
  package.json
frontend/
  src/
    context/
    pages/
      DicomViewer.jsx
    App.jsx
    main.jsx
  index.html
  vite.config.js
  package.json
```

## Notes
- Files are stored locally in `backend/uploads/` and served via `/uploads/<filename>`.
- JWT is required on protected routes. In the frontend, token is stored in localStorage.
- This is an MVP; no complex reviewer assignment.
- Seed includes 5 ECG requests (2 uploaded, 1 in_review, 2 described) and one DICOM example (`sample4.dcm`). For proper viewing, replace `backend/uploads/sample4.dcm` with a real DICOM file (any `.dcm`) before testing the viewer.
