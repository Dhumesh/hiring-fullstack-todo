# TaskFlow - Full Stack TODO App

TaskFlow is a full-stack TODO management app built with React, Node.js, Express, MongoDB, and Mongoose.

## Features

- User signup and login
- JWT-protected TODO APIs
- Users can create, view, edit, complete, and delete only their own tasks
- Admin account can view registered users and all tasks
- Admin can edit or remove users
- Admin can download a CSV report
- Swagger/OpenAPI documentation for backend routes
- Minimalist responsive UI inspired by the provided Stitch mockups

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas or local MongoDB
- ODM: Mongoose
- API docs: OpenAPI/Swagger UI

## Project Structure

```txt
backend/
  config/develop/
  controllers/develop/
  docs/develop/
  middleware/develop/
  models/develop/
  routes/develop/
frontend/
  src/develop/
```

## Backend Setup

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start backend:

```powershell
node server.js
```

Backend runs at:

```txt
http://localhost:5000
```

Swagger docs:

```txt
http://localhost:5000/api-docs
```

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## Admin Login

The admin account is created/updated automatically when logging in:

```txt
Email: admin123@gmail.com
Password: Admin@2026
```

## Main API Routes

Auth:

```txt
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

Todos:

```txt
GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id/done
DELETE /api/todos/:id
```

Admin:

```txt
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/todos
GET    /api/admin/reports/download
```

## Notes

- `backend/.env` is intentionally ignored and should not be committed.
- Normal users only see their own tasks.
- Admin users can see all users and all tasks.
- The frontend stores the login token in localStorage for the current browser session.

## Useful Commands

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```
