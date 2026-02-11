github repo - https://github.com/ritickkumar08/WeeTube-FrontEnd
hosted link - 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


WeeTube Frontend:
The frontend of WeeTube, a YouTube clone, built with React, Redux Toolkit, React Router DOM, and Tailwind CSS. Handles all UI, state management, and API integration with the backend.

Features

1.Home Page
Video grid with thumbnail, title, channel name, views, and date.Responsive layout with Tailwind breakpoints (sm, md, lg).Skeleton and loading states for smoother UX.

2.Channel Pages
ChannelProfile: displays channel banner, avatar, name, subscriber count, and videos.Owners can edit or delete channel and manage videos.Video cards with menu for edit/delete (conditional rendering for owners).

3.Video Watch Page
Video player with title, views, and channel info.VideoSideBar with recommended videos fetched from localStorage cache for performance.Supports navigation between videos without page reload.

4.Loading & Error Handling
Loading component with variants: spinner, dots, pulse, skeleton.ErrorPage handles both routing errors (404, 403, 500) and application/network errors.RouteErrorBoundary wraps routes to catch React Router errors.

5.Navbar & Sidebar
Fully responsive navigation bar with search, links, and user info.Sidebar supports sticky scrolling for recommended videos.

6.Reusable Components
Buttons, Cards, Modals, Toasts, Loading placeholders.Designed for scalability and reusability across pages.


Tech Stack

React 18+
Redux Toolkit
React Router DOM v6
Tailwind CSS
Lucide-react Icons
Axios (for API calls)

Project Structure
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Navbar.jsx             # Main navigation bar
│  │  ├─ SideBar.jsx            # Sidebar for recommendations
│  │  ├─ VideoCard.jsx          # Reusable video card
│  │  ├─ ChannelProfile.jsx     # Channel overview & video management
│  │  ├─ VideoSideBar.jsx       # Video watch page sidebar
│  │  ├─ Loading.jsx            # Loading spinner, pulse, dots, skeleton
│  │  ├─ Error.jsx              # Error page component
│  │  └─ SecureDeleteChannel.jsx # Delete confirmation modal for channels
│  │
│  ├─ hooks/
│  │  └─ useFetch.js            # Custom fetch hook with loading & error handling
│  │
│  ├─ pages/
│  │  ├─ Home.jsx               # Home page with video grid
│  │  ├─ WatchVideo.jsx         # Video watch page
│  │  └─ StudioPages/
│  │     ├─ CreateVideo.jsx     # Create new video form
│  │     └─ UpdateVideo.jsx     # Update video form
│  │
│  ├─ store/
│  │  └─ authSlice.js           # Redux slice for user authentication state
│  │
│  ├─ App.jsx                    # Root app with routing
│  └─ main.jsx                   # Entry point for React + Vite
├─ package.json
├─ tailwind.config.js
└─ vite.config.js



Installation & Setup

1. Clone the repository
git clone https://github.com/ritickkumar08/WeeTube-FrontEnd
cd weetube-frontend

2. Install dependencies
npm install

3. Start development server
npm run dev


Available Components

Navbar – top navigation with links and search
SideBar – sticky sidebar with recommended videos
VideoCard – reusable card for displaying videos
ChannelProfile – channel overview with video management
VideoSideBar – sidebar on video pages for recommendations
Loading – spinner, dots, pulse, or skeleton variants
Error – centralized error page for routing and API errors

- Ritick Kumar