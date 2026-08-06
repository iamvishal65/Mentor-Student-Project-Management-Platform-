# Mentor–Student Project Management Platform

A full-stack web application that enables structured mentorship by allowing students to apply to mentors, collaborate on projects, and communicate in real time — all managed through a role-based access system.

**Live Demo:** [https://mentor-student-project-management-s8jm.onrender.com/]()

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Recoil |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-time | WebSockets (ws) |
| Deployment | Vercel |

---

## Features

### Role-Based Access
Three roles — **Student**, **Mentor**, and **Admin** — are managed under a single unified user schema with layered access logic. No duplicate models; authorization is resolved at the middleware level.

### Mentor Application Workflow
Students can apply to become mentors through a state-driven workflow:
- Applications move through defined states: `pending → accepted / rejected`
- Cooldown-based reapplication: rejected applicants must wait a time-bound period before reapplying, enforced server-side to prevent bypass
- Prevents spam and enforces controlled retry behavior

### Real-Time Messaging
- Bidirectional chat built on WebSockets
- Supports multiple concurrent sessions per user
- In-memory socket registry enables O(1) message dispatch — no database polling for live messages

### State Management
- Recoil atoms scoped per resource on the client
- Eliminates redundant re-renders and reduces API calls on dashboard-heavy views

### Validation & Error Handling
- Centralized middleware-level validation pipeline
- Uniform API contracts across all routes
- Blocks invalid state transitions before reaching business logic

---

## Project Structure

```
├── backend/
│   ├── routes/         # Express route handlers
│   ├── models/         # Mongoose schemas
│   ├── middleware/      # Auth, validation, error handling
│   └── socket/         # WebSocket logic
├── frontend/
│   ├── components/     # React components
│   ├── store/          # Recoil atoms and selectors
│   └── pages/          # Route-level views
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/iamvishal65/Mentor-Student-Project-Management-Platform-.git
cd Mentor-Student-Project-Management-Platform-

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running Locally

```bash
# Start backend
cd backend && npm run dev

# Start frontend (in a new terminal)
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/mentors` | List all mentors |
| POST | `/api/apply` | Submit mentor application |
| GET | `/api/messages/:userId` | Fetch chat history |

---

## Author

**Vishal** — [github.com/iamvishal65](https://github.com/iamvishal65)
