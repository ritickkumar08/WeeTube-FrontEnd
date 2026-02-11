import { Outlet } from "react-router-dom";

import './App.css'
import NavBar from "./components/NavBar";
import Sidebar from "./components/SideMenu";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar/>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl">Home Page</h2>
        </main>
      </div>
    </div>
  );
}

export default App


