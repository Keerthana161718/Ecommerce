# Demo Frontend

Minimal React + Vite frontend to work with the provided backend.

Quick start:

1. cd frontend
2. npm install
3. Ensure backend is running. By default this project backend uses port `8080` (see `backend/.env`).
	You can either start backend on port 8080 or set `VITE_API_URL` in a `.env` file to point to your backend.
	Example `.env` (frontend):
	VITE_API_URL=http://localhost:8080/api
4. npm run dev

Features included:
- Product listing and detail pages
- Login / Register (stores token in localStorage)
- Simple cart view (uses backend `/api/cart`)

Notes:
- This is a minimal scaffold. You can extend components and error handling as needed.
