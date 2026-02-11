// This layout wraps all authenticated/main pages.
// It provides Header + Sidebar structure consistently.

import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/SideMenu";

const Main = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <NavBar />

      {/* Body Section */}
      <div className="flex">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Routed page content renders here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
