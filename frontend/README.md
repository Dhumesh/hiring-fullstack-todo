# TaskFlow Frontend

React + Vite frontend for the TaskFlow TODO app.

## Setup

```powershell
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Screens

- Login
- Signup
- User task page
- Admin dashboard
- Admin users page
- Admin tasks page
- Admin report page

## Behavior

- Normal users only see the task page.
- Admin users only see the admin area.
- The UI calls the backend at `http://localhost:5000` by default.
- To use a different backend URL, create a frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Checks

```powershell
npm run lint
npm run build
```
