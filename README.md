# Real-Time Polling App

## Features
- Create polls with multiple options
- Users can vote in real-time
- Live updates using WebSocket

## Tech Stack
- React.js + Vite
- Node.js + Express
- PostgreSQL + Prisma
- Socket.io for real-time updates

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
# no need to create `.env` file as i already provided, to run the app easily(ignore up to 6th command)
4. Create `.env` with:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="give-any-random-string-to-enhance-the-security"
PORT=5000
```
4. `npx prisma generate`
5. `npx prisma db push`
6. `npm run dev`

API routes:
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/auth/me` Bearer token
- GET `/api/polls`
- POST `/api/polls` Bearer token { question, options: ["A","B",...] }
- GET `/api/polls/:id`
- POST `/api/votes` Bearer token { optionId }

Socket.IO events:
- Client joins a poll room: `joinPoll` with pollId
- Server emits `updatePoll` with updated poll after votes

# Create a New Terminal
### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
  
# Frontend Will Run On Available Port(Probably 5173), Directly Click On The Link And You Will Be
# Redirected To The Frontend Page

### Please Provide Feedback After Review
