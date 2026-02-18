# WeeTube-FrontEnd
Weetube Frontend
A modern video-streaming UI built with React, Vite, Tailwind, and Redux Toolkit.
This project focuses on performance, modular architecture, and a clean developer experience while integrating with a backend API for data and authentication.

Frontend Setup

Navigate to the frontend directory
cd frontend

Install dependencies
npm install

Create a .env file and add your backend URL
VITE_BACKEND_SERVER= [http://localhost:5000](https://weetube.onrender.com)

Start the development server
npm run dev

The app will be available at
http://localhost:5173


-----------------------------------------------------------------------------------------------------
Pages

Login.jsx
Handles authentication UI, validation, and API integration.

Register.jsx
User signup flow with real-time validation and feedback.

Homepage.jsx
Video feed and discovery UI with lazy loading and caching.

VideoPage.jsx
Video player screen with engagement actions and recommendations.

-----------------------------------------------------------------------------------------------------
Reusable Components

Header.jsx
Top navigation with search, user menu, and responsive layout.

VideoCard.jsx
Reusable video preview card with hover interactions and metadata.

CommentSection.jsx
Threaded comments UI with posting and updates.

Toast.jsx
Global notification system for success and error states.

PlayerControls.jsx
Custom video controls (play, pause, progress, volume).

-----------------------------------------------------------------------------------------------------

State Management -> Redux Toolkit

Handles global state such as
Video data
UI state
Caching
Playback state
Context API
userContext.jsx manages
Auth session
User info
Global user actions
Service Layer
services/api.js
Centralized API client that provides
Axios instance
Request interceptors (auth headers)
Response error handling
Retry logic

Folder Structure
src/
 ├─ components/
 ├─ pages/
 ├─ layouts/
 ├─ services/
 ├─ store/
 ├─ contexts/
 ├─ hooks/
 └─ utils/

-----------------------------------------------------------------------------------------------------
Technology Stack
Core

React (UI library)
Vite (build tool)
JavaScript (ESNext)
-----------------------------------------------------------------------------------------------------

Styling
Tailwind CSS
Responsive utility design
Dark/light theme support
State & Routing
Redux Toolkit
React Router
Data Fetching
Axios
Custom hooks (useFetch)
