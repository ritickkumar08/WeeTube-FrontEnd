import { Outlet } from "react-router-dom";
import './App.css'

import { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch} from "react-redux";
import useFetch from "./hooks/useFetch";
import { clearAuth, setAuth, setAuthLoading } from "./store/authSlice";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Sidebar from "./components/SideMenu";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  
  // Get token from storage
  const token = localStorage.getItem("token");

  // Memoize headers so the useFetch dependency check (JSON.stringify) stays stable
  const headers = useMemo(() => ({
    Authorization: token ? `Bearer ${token}` : undefined
  }), [token]);

  /**
   * Use the custom hook. 
   * It only fires if token exists, otherwise actionPath is null.
   */
  const { data: userData, loading: fetchLoading, error: fetchError } = useFetch(
    token ? "/user/me" : null, 
    "GET", 
    null, 
    headers
  );

  // Sync hook results with Redux store
  useEffect(() => {
    if (!token) {
      dispatch(clearAuth());
      dispatch(setAuthLoading(false));
      return;
    }

    if (userData) {
      dispatch(setAuth({ user: userData, token }));
      dispatch(setAuthLoading(false));
    } else if (fetchError) {
      console.error("Auth initialization failed:", fetchError);
      dispatch(clearAuth());
      dispatch(setAuthLoading(false));
    }
  }, [userData, fetchError, token, dispatch]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Use the loading state from the hook or the store
  if (fetchLoading && token) {
    return (
      <div className="mt-[25vh]">
        <Loading variant="spinner" size="lg" text="Initializing..." />
      </div>
    );
  }

  return (
    <div className="bg-yt-bg transition-colors duration-300">
      <NavBar 
        onMenuClick={() => { toggleSidebar(); }} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <div className="flex h-screen pt-14">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className={`
            flex-1 transition-all overflow-y-auto duration-300 ease-in-out bg-yt-surface
            ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
          `}>
          <Suspense fallback={<Loading variant="spinner" size="lg" text="Loading..." />}>
            <Outlet context={{ searchTerm }}/>
          </Suspense>
          </main>
      </div>
    </div>
  );
}

export default App
