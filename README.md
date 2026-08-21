# CrowdMailer

A MERN stack (MongoDB, Express, React, Node.js) application for sending and managing email campaigns.

## Structure
- `frontend/` — React app (UI)
- `backend/` — Express API (auth, campaigns, subscribers, stats, email sending)

## Local Development
1. Backend: `cd backend && npm install && npm run dev` (needs a `.env` with `MONGODB_URI`, etc.)
2. Frontend: `cd frontend && npm install && npm start` (optionally set `REACT_APP_API_URL` in a `.env` file to point to your local backend, e.g. `http://localhost:5000/api`)

## Deployment (Vercel)
This project is deployed as a single Vercel project containing both the frontend (static build) and backend (serverless function). `vercel.json` routes `/api/*` requests to the backend and everything else to the frontend. Make sure required environment variables (e.g. `MONGODB_URI`) are set in the Vercel project settings.
