# HiFive 🤚

> **Lower the barrier. Make the connection. Meet in person.**

HiFive is a proximity-based social app designed to strengthen real-world connections — not replace them. It removes the anxiety of approaching someone new by using shared interests and physical proximity to facilitate genuine human interaction.

---

## The Problem

Meeting new people is hard. Social media optimizes for follower counts, likes, and online engagement — not real friendships. The decision barrier to introducing yourself to someone nearby is too high, and existing apps do nothing to lower it.

---

## What We Built

HiFive provides two distinct pathways for connection, both designed to end at the same place: **an in-person conversation.**

### 🤚 HiFive (Proximity-Based Discovery)
- Your phone silently pings your GPS location every 30 seconds in the background
- When another HiFive user is within **50 meters** of you, the encounter is recorded
- The more times you cross paths with someone, the higher they appear in your **Suggestions** feed
- You can send them a friend request (a "HiFive") directly from the app

### 👥 Manual Friend Requests
- Search for users by name and send a friend request
- The recipient must **manually accept** — no auto-approvals
- Once connected, you can open a real-time chat

### 💬 Real-Time Messaging
- WebSocket-powered messaging via Socket.IO
- Messages are persisted in the database so they survive page reloads
- Chat windows are contained and mobile-friendly

### 👤 Profile Management
- Edit your first name, last name, and interests
- Auth0 handles sign-in — no passwords to manage

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** (with Vite) | UI framework |
| **React Router DOM** | Client-side routing |
| **Tailwind CSS v4** | Styling and responsive design |
| **Socket.IO Client** | Real-time WebSocket communication |
| **Auth0 (`@auth0/auth0-react`)** | Authentication and JWT management |
| **GitHub Pages** | Static frontend hosting |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js / Express** | REST API server |
| **Socket.IO** | WebSocket server for real-time chat |
| **PostgreSQL** | Primary database (users, friendships, messages, encounters) |
| **`pg` (node-postgres)** | Database client |
| **`express-oauth2-jwt-bearer`** | Auth0 JWT validation middleware |
| **DigitalOcean App Platform** | Hosting and managed database |

### Infrastructure
| Technology | Purpose |
|---|---|
| **GitHub Actions** | CI/CD pipeline — auto-deploys frontend to GitHub Pages on push |
| **Auth0** | Identity provider (OAuth2 / JWT) |
| **DigitalOcean** | Backend API hosting + managed PostgreSQL |

---

## How Proximity Detection Works

```
Phone A (you)          Backend                  Phone B (nearby user)
     |                    |                            |
     |-- POST /location/ping (lat, lng) -->            |
     |                    |<-- POST /location/ping ----|
     |                    |                            |
     |          Haversine formula:                     |
     |          distance(A, B) <= 50m?                 |
     |                    |                            |
     |          encounters.encounter_count++           |
     |                    |                            |
     |<-- suggestions sorted by encounter_count -------|
```

Every 30 seconds, each app silently sends its current GPS coordinates to the backend. The backend uses the **Haversine formula** to compute the distance between all recently-active users and records an encounter for any pair within 50 meters of each other. The **Suggestions** tab in the app then surfaces the people you've encountered the most — people you've physically been near, but may not have spoken to yet.

---

## AI Used to Build This

This project was built with significant assistance from **Google Gemini** (via [Antigravity](https://antigravity.ai)), an AI coding agent. The AI contributed to:

- **Architecture design** — proposing the full tech stack and proximity detection approach
- **Backend API development** — writing and debugging all Express routes (`/friends`, `/location`, `/messages`, `/user`)
- **Real-time messaging** — implementing the Socket.IO server and client-side chat
- **Frontend React components** — building `Dashboard.jsx`, `Friends.jsx`, `Chat.jsx`, `ProfileSetup.jsx`, and `LocationTracker.jsx`
- **CI/CD pipeline** — writing the GitHub Actions workflow for auto-deployment to GitHub Pages
- **Mobile responsiveness** — diagnosing and fixing viewport issues across the entire app
- **Database schema** — designing the `users`, `friendships`, `encounters`, and `messages` tables

The human contributors focused on product decisions, design direction, testing, and refining features.

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    auth0_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    interests TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    last_ping_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Encounters (proximity pairings)
CREATE TABLE encounters (
    id SERIAL PRIMARY KEY,
    user_a_id INTEGER REFERENCES users(id),
    user_b_id INTEGER REFERENCES users(id),
    encounter_count INTEGER DEFAULT 1,
    last_seen_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_a_id, user_b_id)
);

-- Friendships
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id),
    addressee_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, addressee_id)
);

-- Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database
- Auth0 account (free tier works)

### Backend
```bash
cd backend
cp .env.example .env  # Fill in DATABASE_URL, AUTH0_AUDIENCE, AUTH0_ISSUER
npm install
npm run dev
```

### Frontend
```bash
cd frontend/hifive
cp .env.example .env  # Set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

---

## Core Design Principles

| Principle | What it means |
|---|---|
| **Profiles are private by default** | Info is only revealed when both users connect |
| **No follower counts** | Social clout is invisible — connections are interest-based |
| **Proximity-first discovery** | Suggestions prioritize people you've physically been near |
| **Manual opt-in** | No auto-accepted friend requests — both parties must agree |

---

*Built at HackDuke 2026 with the belief that the best connections happen face to face.*
