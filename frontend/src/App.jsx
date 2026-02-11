import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import NavBar from "./components/NavBar";
import Sidebar from "./components/SideMenu";
import Homepage from "./pages/homePage";
import VideoPage from "./pages/videoPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <NavBar/>
        <div className="flex">
          <Sidebar/>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Homepage/>}/>
              <Route path="/video/:id" element={<VideoPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App
