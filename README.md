# Chatting Application

A full-stack chatting application built with a Node.js backend, React frontend, and Tailwind CSS for styling.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)
- nodemon (install globally using `npm install -g nodemon`)

---

## How to Run the Application

Follow these steps to set up and run the backend and frontend:

### Step 1: Start the Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
2. Start the server using nodemon:
   ```bash
   nodemon server
3. Navigate to the `frontend` directory:
   ```bash
   cd frontend
4. Start the frontend development server:
   ```bash
   npm run dev
5. Navigate to the frontend directory:
   ```bash
   cd frontend
6. Start the Tailwind CSS watcher to compile styles:
   ```bash
   npx tailwindcss -i ./src/index.css -o output.css --watch
