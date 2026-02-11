import {
  LogOut,
  Search,
  Sun,
  Moon,
  Settings,
  UserPen,
  MonitorPlay,
  ChevronLeft
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../store/authSlice';


function NavBar({ onMenuClick, searchTerm, setSearchTerm }) {

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Dark mode sync + persist
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearAuth());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-yt-bg/95 backdrop-blur-md px-2 sm:px-4">

      {/* Left Section */}
      <div className={`flex items-center gap-2 ${isSearchOpen ? 'hidden sm:flex' : ''}`}>
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-yt-surface"
        >
          <svg 
          xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-logs-icon lucide-logs"><path d="M3 5h1"/><path d="M3 12h1"/><path d="M3 19h1"/><path d="M8 5h1"/><path d="M8 12h1"/><path d="M8 19h1"/><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/>
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="rounded bg-yt-primary p-1 shadow-sm shadow-red-600 ">
            <svg className="h-4 w-6 text-white " fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="hidden sm:block font-bold text-xl text-yt-text text-shadow-sm text-shadow-white">
            WeeTube
          </span>
        </Link>
      </div>
      {/* Center Search */}
      <div className={`grow px-4 ${isSearchOpen ? 'flex' : 'hidden sm:flex'} justify-center`}>
        <div className="flex w-full max-w-150 items-center">
          {isSearchOpen && (
            <button
              onClick={() => setIsSearchOpen(false)}
              className="mr-2 sm:hidden"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex w-full overflow-hidden rounded-full border border-yt-border bg-yt-surface">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search"
              className="w-full bg-transparent px-4 py-1.5 text-sm text-yt-text outline-none"
            />
            <button className="border-l border-yt-border px-4 hover:bg-yt-border/40">
              <Search size={18} color='white'/>
            </button>
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className={`flex items-center gap-2 ${isSearchOpen ? 'hidden sm:flex' : ''}`}>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 sm:hidden"
        >
          <Search size={20} />
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-yt-surface rounded-full"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className="ml-2 rounded-full border border-yt-border px-3 py-1.5 text-sm text-yt-primary hover:bg-yt-primary/10"
          >
            Sign in
          </button>
          ) : (
          <div className="relative group flex items-center gap-3">
            <img
              src={user.avatar || 'https://via.placeholder.com/32'}
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
              alt="Profile"
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-yt-border bg-yt-bg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-4 border-b border-yt-border">
                <p className="font-semibold text-yt-text">{user.username}</p>
                <p className="text-xs text-yt-muted">{user.email}</p>
              </div>

              <div className="p-2">
                <MenuLink to="/studio/manageAccount" icon={<Settings size={16} />} label="Manage Profile" />
                <MenuLink to="/studio/updateProfile" icon={<UserPen size={16} />} label="Update Profile" />
                <MenuLink
                  to={user.channel ? `/channel/${user.channel._id}` : "/studio/createChannel"}
                  icon={<MonitorPlay size={16} />}
                  label={user.channel ? "Your Channel" : "Create Channel"}
                />
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const MenuLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-yt-surface"
  >
    {icon}
    {label}
  </Link>
);

export default NavBar