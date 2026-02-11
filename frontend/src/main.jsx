import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import appStore from './store/appStore.js'
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Lazy pages
const HomePage = lazy(() => import('./pages/homePage.jsx'))
const VideoPage = lazy(() => import('./pages/videoPage.jsx'))
const ChannelProfile = lazy(() => import('./components/ChannelProfile.jsx'))
const ChannelList = lazy(() => import('./components/ChannelList.jsx'))
const Login = lazy(() => import('./pages/loginPage.jsx'))
const Register = lazy(() => import('./pages/RegisterPage.jsx'))
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'))
const RouteErrorBoundary = lazy(() => import('./components/RouteErrorBoundary.jsx'))

// Studio components
import CreateVideo from './components/CreateVideo'
import UpdateVideo from './components/UpdateVideo.jsx'
import CreateChannel from './components/CreateChannel.jsx'
import UpdateChannel from './components/UpdateChannel.jsx'
import UpdateProfile from './components/UpdateProfile.jsx'
import Loading from './components/Loading.jsx'


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "watch/:id", element: <VideoPage /> },

      {
        path: "channel",
        children: [
          { index: true, element: <ChannelList /> },
          { path: ":channelId", element: <ChannelProfile /> }
        ]
      },

      {
        path: "studio",
        children: [
          { path: "createVideo", element: <CreateVideo /> },
          { path: "updateVideo", element: <UpdateVideo /> },
          { path: "updateChannel", element: <UpdateChannel /> },
          { path: "createChannel", element: <CreateChannel /> },
          { path: "updateProfile", element: <UpdateProfile /> },
          ]
      }
    ]
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/error", element: <ErrorPage /> },
  {
    path: "*",
    element: (
      <ErrorPage
        status="404"
        title="Page Not Found"
        message="The page you are looking for does not exist."
      />
    )
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Suspense fallback={<Loading variant="spinner" size="full" text="Loading..." />}>
        <RouterProvider router={appRouter} />
      </Suspense>
    </Provider>
  </StrictMode>,
)
