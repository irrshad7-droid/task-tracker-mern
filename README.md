# TaskTracker (MERN Stack)

A modern, production-quality Task Management application built with the MERN stack (MongoDB, Express, React, Node.js). 

Designed to be lightweight, responsive, and completely scalable, featuring a custom CSS design system, optimistic UI updates, and robust error handling.

## 🚀 Live Demos
* **Frontend (Vercel)**: https://task-tracker-mern-livid.vercel.app
* **Backend API (Render)**: https://task-tracker-mern-n7gt.onrender.com

---

## ✨ Key Features
- **Full CRUD Operations**: Create, Read, Update, and Delete tasks seamlessly.
- **Optimistic UI Updates**: Instant visual feedback without waiting for full page reloads.
- **Debounced Search**: Find tasks by title instantly with 400ms debounced API queries.
- **Dynamic Filtering**: Filter tasks by Status (Pending/Completed) or Priority (High/Medium/Low).
- **Advanced Sorting**: Sort tasks by Newest, Oldest, Due Date, or Custom Priority mapping via MongoDB aggregation.
- **Responsive Design**: Flawless UI across mobile, tablet, and desktop devices.
- **Robust Validation**: Client-side form validation paired with rigorous `express-validator` backend constraints.
- **Elegant UX**: Integrated loaders, dynamic empty states, CSS-only micro-animations, and `react-hot-toast` notifications.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** (bootstrapped with Vite)
- **State Management**: React Context API + `useReducer`
- **Data Fetching**: Axios (centralised instance with interceptors)
- **Styling**: Vanilla CSS with custom properties (CSS variables) and BEM methodology (No external UI libraries)
- **Notifications**: `react-hot-toast`

### Backend (Server)
- **Node.js & Express.js**: RESTful API architecture
- **MongoDB & Mongoose**: Database and ODM
- **express-validator**: Middleware for strict input validation
- **cors & dotenv**: Security and environment configuration

---

## 📂 Project Structure

This repository uses a monorepo-style structure separating the client and server.

```text
task-tracker-mern/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance and API calls
│   │   ├── components/     # Reusable UI, Layout, and Feature components
│   │   ├── context/        # TaskContext and TaskReducer
│   │   ├── hooks/          # Custom hooks (e.g., useTasks)
│   │   ├── pages/          # Page components (Home.jsx)
│   │   ├── utils/          # Pure helper functions
│   │   ├── App.jsx         # Root component and layout wiring
│   │   └── index.css       # Global design system
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database connection logic
│   ├── controllers/        # Request handling and business logic
│   ├── middleware/         # Error handlers and validation rules
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── server.js           # Express entry point
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 💻 Local Installation

### Prerequisites
- Node.js (v18+)
- A MongoDB cluster (e.g., MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/irrshad7-droid/task-tracker-mern.git
cd task-tracker-mern
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (refer to `server/.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory (refer to `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint           | Description                                  |
|--------|--------------------|----------------------------------------------|
| GET    | `/api/tasks`       | Fetch all tasks (supports query params)      |
| POST   | `/api/tasks`       | Create a new task                            |
| PUT    | `/api/tasks/:id`   | Update a task by ID                          |
| DELETE | `/api/tasks/:id`   | Delete a task by ID                          |
| GET    | `/api/health`      | Health check endpoint (for deployment pings) |

**Supported Query Parameters (`GET /api/tasks`)**:
- `search`: Filter by title (string matching)
- `status`: `Pending` | `Completed`
- `priority`: `High` | `Medium` | `Low`
- `sort`: `newest` | `oldest` | `priority` | `dueDate`

---

## 🔮 Future Improvements
While the application is fully functional, potential future features include:
- User Authentication (JWT)
- Drag-and-drop task reordering
- Dark Mode toggle
- Pagination for massive task lists
