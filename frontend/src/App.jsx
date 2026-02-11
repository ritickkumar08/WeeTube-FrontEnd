import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'

import Homepage from "./pages/homePage";
import VideoPage from "./pages/videoPage";
import Login from "./pages/loginPage";
import Main from "./layouts/Main";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadPage from "./pages/UploadPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RegisterPage />} />

        {/* Layout wrapped routes */}
        <Route element={<Main />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/video/:id" element={<VideoPage />} />

          {/* Protected route inside layout */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
