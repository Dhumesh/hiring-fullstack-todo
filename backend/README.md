# TaskFlow Backend

Node.js + Express backend for TaskFlow.

## Setup

```powershell
npm install
```

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the server:

```powershell
node server.js
```

The API runs at:

```txt
http://localhost:5000
```

## Swagger

```txt
http://localhost:5000/api-docs
```

## Admin Account

The backend ensures this admin user exists during login:

```txt
Email: admin123@gmail.com
Password: Admin@2026
```

## Access Rules

- All TODO routes require a Bearer token.
- Normal users can only manage their own TODOs.
- Admin users can access `/api/admin/*` routes.
- Admin users can view all users, edit/remove users, view all tasks, and download reports.

## Main Routes

```txt
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

GET    /api/todos
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id/done
DELETE /api/todos/:id

GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/todos
GET    /api/admin/reports/download
```

## MongoDB Notes

The app uses Mongoose models:

- `User`
- `Todo`

Each todo stores an `owner` reference so normal users only receive their own tasks. Admin users can query all tasks.

## Assumptions and Limitations

- Admin credentials are fixed for the assessment.
- Report download is a CSV file generated on request.
- There is no password reset flow.
