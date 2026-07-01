# ResQNet

**A real-time disaster response and emergency coordination platform** connecting citizens, field responders, and command-center admins the moment an emergency happens.

ResQNet is a real-time disaster response and emergency coordination platform that connects citizens, responders, and command-center administrators. Citizens can report emergencies with a single tap using their live GPS location. Each incident is instantly broadcast via Socket.io, automatically prioritized using a priority score, and assigned to the nearest available responder.
Administrators oversee the entire operation through a live command-center dashboard featuring interactive maps, real-time analytics, and emergency tracking, ensuring complete situational awareness.
 Responders navigate using a custom Dijkstra shortest path implementation, while evacuation scenarios receive intelligent shelter recommendations based on distance and available capacity.

---

## Live Demo

https://res-q-net-chi.vercel.app

---
## Table of contents

- [Features by role](#features-by-role)
- [How it decides things](#how-it-decides-things) — the algorithms
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Seeding demo data](#seeding-demo-data)
- [API reference](#api-reference)
- [Project structure](#project-structure)


---

## Features by role

### 🧍 Citizen
- Report an emergency (type, severity, description, affected people) with automatic GPS capture
- Track the live status of every report you've filed — pending → assigned → in progress → completed
- Browse safety resources and preparedness guides
- Leave feedback after an incident is resolved

### 🎯 Admin (command center)
- Live map of every active emergency across the city
- Emergencies triaged by priority score, completed ones kept out of the way
- One-click assignment of the nearest available responder
- Real-time stats: active, pending, in-progress, completed
- Shelter and responder directories with live availability

### 🚑 Responder
- Live-updating list of assigned missions, sorted by priority
- Accept a mission, then get a Dijkstra-optimized route with live distance/ETA
- Mark "reached site," then — for emergencies that require it (flood, earthquake, landslide, cyclone, wildfire with meaningful severity/impact) — get the nearest shelter with free capacity recommended and assign it
- Complete the mission, automatically becoming available for the next one

---

## How it decides things

| Problem | Approach | Where |
|---|---|---|
| Distance between two GPS points | **Haversine formula** (great-circle distance on a sphere) | `utils/haversine.js` |
| Which responder should take this emergency | Linear scan over available responders, haversine distance to each, pick the minimum | `controllers/missionController.js` |
| Which shelter should this emergency evacuate to | Filter shelters by `capacity > currentOccupancy`, haversine distance to each, pick the minimum | `controllers/shelterController.js` |
| Fastest path from responder to emergency | City locations + road connections modeled as a weighted graph (`utils/graphBuilder.js`), edge weights from haversine distance, shortest path via a **from-scratch Dijkstra implementation** | `utils/dijkstra.js`, `controllers/routeController.js` |
| Which emergency gets addressed first | `priorityScore = severity × 5 + affectedPeople × 3`, computed at report time and used to sort the admin/responder queues | `controllers/emergencyController.js` |
| Live updates without polling | Socket.io emits `newEmergency` on report creation and `newMission` on assignment; clients subscribe and patch state directly | `server.js`, `socket.js` |

---

## Tech stack

**Frontend**
- React 19 + Vite
- Redux Toolkit (auth state)
- React Router v7
- Tailwind CSS v4
- Framer Motion (page/section animation)
- React-Leaflet (live map, custom markers, route polylines)
- Axios, Socket.io-client, react-hot-toast

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.io (real-time events)
- JWT auth (`jsonwebtoken`) + `bcryptjs` password hashing
- Role-based middleware (`citizen` / `responder` / `admin`)

---

## Architecture

```
┌─────────────┐        REST + WebSocket        ┌──────────────┐
│   React SPA │ ◄─────────────────────────────► │  Express API │
│  (3 role-   │                                  │  + Socket.io │
│   based     │                                  └──────┬───────┘
│  dashboards)│                                         │
└─────────────┘                                         ▼
                                                   ┌─────────────┐
                                                   │   MongoDB   │
                                                   │ (Mongoose)  │
                                                   └─────────────┘
```

- **Auth:** stateless JWT, 7-day expiry, role embedded via `req.user` after `protect` middleware verifies the token and loads the user.
- **Authorization:** `authorize("admin")`, `authorize("responder")`, etc. middleware guards on top of `protect`, gating routes per role at the API level (not just hidden UI).
- **Real-time:** a single Socket.io instance attached to the Express `http.Server`; `newEmergency` and `newMission` events are broadcast to all connected clients and consumed by the relevant dashboards.

---

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd resqnet

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment variables

Create `server/.env` (see [Environment variables](#environment-variables) below).

### 3. Run it

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173`, register an account (defaults to the `citizen` role — see seeding below for responder/admin accounts), and go.

---

## Environment variables

`server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/resqnet
JWT_SECRET=replace-with-a-long-random-string
PORT=5000
```

The client points at `http://localhost:5000/api` by default (`client/src/services/*.js`) — update the `baseURL` in those files if your backend runs elsewhere.

---

## Seeding demo data

Two standalone seed scripts are included to get responders and shelters into the DB without manual signup:

```bash
cd server
node seeder/responderSeeder.js   # creates demo responder accounts
node seeder/shelterSeeder.js     # creates demo shelters with capacity/resources
```

Check each seeder file for the exact demo credentials/data it inserts before running — they wipe and reseed their respective collections.


---

## API reference

All routes are prefixed with `/api`. 🔒 = requires `Authorization: Bearer <token>`. Role in parentheses = restricted to that role.

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create a citizen account |
| POST | `/auth/login` | Log in, returns JWT + user |

### Emergencies
| Method | Route | Description |
|---|---|---|
| POST | `/emergencies` 🔒 | Report a new emergency |
| GET | `/emergencies` 🔒 (admin) | All emergencies, sorted by priority |
| GET | `/emergencies/mine` 🔒 | The signed-in citizen's own reports |
| GET | `/emergencies/stats` 🔒 (admin) | Active/pending/in-progress/completed counts |
| PUT | `/emergencies/:id/assign-shelter` 🔒 (responder) | Assign a shelter to an emergency |

### Missions
| Method | Route | Description |
|---|---|---|
| POST | `/missions` 🔒 (admin) | Create a mission, auto-assigns nearest available responder |
| GET | `/missions/my` 🔒 (responder) | The signed-in responder's missions |
| PUT | `/missions/:id/accept` 🔒 (responder) | Accept an assigned mission |
| PUT | `/missions/:id/start-navigation` 🔒 (responder) | Begin navigation, stores optimized route |
| PUT | `/missions/:id/reach-site` 🔒 (responder) | Mark arrival at the emergency |
| PUT | `/missions/:id/complete` 🔒 (responder) | Complete the mission, responder becomes available again |

### Shelters
| Method | Route | Description |
|---|---|---|
| GET | `/shelters` | List all shelters |
| POST | `/shelters/recommend` | Nearest shelter with available capacity for a given lat/lng |
| PUT | `/shelters/:id/occupancy` | Update a shelter's current occupancy |

### Routing
| Method | Route | Description |
|---|---|---|
| POST | `/routes/optimize` | Dijkstra shortest path between two location nodes |

### Users / Dashboard
| Method | Route | Description |
|---|---|---|
| GET | `/users/responders` 🔒 (admin) | List all responders with availability |
| GET | `/dashboard/citizen` 🔒 (citizen) | Role-check ping route |
| GET | `/dashboard/responder` 🔒 (responder) | Role-check ping route |
| GET | `/dashboard/admin` 🔒 (admin) | Role-check ping route |

---

## Project structure

```
resqnet/
├── client/
│   └── src/
│       ├── components/     # Navbar, Sidebar, StatCard, EmergencyMap
│       ├── layouts/        # DashboardLayout (shared shell)
│       ├── pages/          # LandingPage, Login, Register, role dashboards
│       │   └── citizen/    # ReportEmergency, MyReports, SafetyResources, Feedback
│       ├── redux/          # auth slice + store
│       ├── routes/         # PrivateRoute, RoleProtectedRoute guards
│       ├── services/       # axios wrappers per resource
│       └── socket.js        # Socket.io client instance
└── server/
    ├── controllers/        # request handlers per resource
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    ├── middleware/          # protect + authorize (JWT/RBAC)
    ├── utils/               # dijkstra, haversine, graphBuilder, nearestLocation
    ├── data/                # demo location graph + shelter seed data
    └── seeder/              # standalone data seed scripts
```

---

