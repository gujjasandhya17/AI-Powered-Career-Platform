# AI-Powered Career Preparation Platform

A production-ready full-stack web app to help users prepare for jobs with:

- Secure authentication (JWT + bcrypt)
- Resume analysis (PDF/TXT or pasted text)
- Mock MCQ tests with score tracking
- Personalized dashboard with resume + quiz insights

## Tech Stack

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs
- **Deployment:** Vercel (frontend), Render/Railway (backend)

---

## Project Structure

```text
AI Powered Career Platform/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  └─ services/
│  ├─ .env.example
│  ├─ vercel.json
│  └─ package.json
└─ API_DOCS.md
```

---

## Local Development

### 1) Backend Setup

1. Go to backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create/update `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<your_strong_secret>
   JWT_EXPIRES_IN=7d
   FRONTEND_URLS=http://localhost:5173
   ```
4. Run backend:
   ```bash
   npm run dev
   ```

### 2) Frontend Setup

1. Go to frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Run frontend:
   ```bash
   npm run dev
   ```

---

## Deployment Guide

## A) MongoDB Atlas

1. Create MongoDB Atlas cluster.
2. Create database user and password.
3. In **Network Access**, allow backend host IP (or temporary `0.0.0.0/0` while testing).
4. Copy connection URI and use it as `MONGODB_URI` on backend hosting platform.

## B) Backend on Render

1. Push project to GitHub.
2. On Render, create **Web Service** from the repository.
3. Set root directory to `backend`.
4. Build command:
   ```bash
   npm install
   ```
5. Start command:
   ```bash
   npm start
   ```
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=10000` (or leave platform default)
   - `MONGODB_URI=...`
   - `JWT_SECRET=...`
   - `JWT_EXPIRES_IN=7d`
   - `FRONTEND_URLS=https://<your-vercel-domain>`
7. Deploy and verify:
   - `GET https://<backend-domain>/api/health`

## C) Backend on Railway (Alternative)

1. Create new project from GitHub repo.
2. Select `backend` as service root.
3. Add same backend env vars as above.
4. Deploy and test `/api/health`.

## D) Frontend on Vercel

1. Import repository into Vercel.
2. Set project root to `frontend`.
3. Framework preset: **Vite**.
4. Add env var:
   - `VITE_API_BASE_URL=https://<your-backend-domain>/api`
5. Deploy.
6. Because `vercel.json` exists, React Router routes will work on refresh.

## E) Final Production Check

1. Open frontend URL.
2. Sign up / login.
3. Analyze resume (text + file).
4. Add quiz questions and submit quiz.
5. Confirm dashboard shows latest resume score and quiz history.

---

## API Reference

See full endpoint documentation in [API_DOCS.md](API_DOCS.md).

---

## Suggested Improvements

1. Add role-based access (`admin`) for creating quiz questions.
2. Add email verification + password reset.
3. Add rate limiting and request validation (`express-validator`/`zod`).
4. Add unit + integration tests (Jest + Supertest).
5. Add CI pipeline (GitHub Actions) for lint/build/test.
6. Improve resume NLP with embeddings or LLM-based analysis.

---

## License

For learning and portfolio use.
