import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {clearAuth} from '../store/authSlice'
/**
 * Global application header.
 * Handles navigation, search input, theme toggle, and user actions.
 */
function NavBar({ onMenuClick, searchInput, setSearchInput }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Sync theme preference with root element
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleLogout = () => {
        dispatch(clearAuth());
    };
    return (
         <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-yt-border bg-yt-bg/95 backdrop-blur-md px-2 sm:px-4">
      
      {/* Left: Menu + Brand */}
      <div className={`flex items-center gap-2 sm:gap-4 ${isSearchActive ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={onMenuClick}
          className="rounded-full p-2 text-yt-text hover:bg-yt-surface transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-1 group">
          <div className="rounded-lg bg-yt-primary p-1 transition-transform group-active:scale-90">
            <svg className="h-4 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <span className="hidden xxs:block text-xl font-bold tracking-tighter text-yt-text">
            YouTube
            <sup className="ml-0.5 text-[10px] font-medium text-yt-muted">IN</sup>
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className={`grow justify-center px-4 ${isSearchActive ? 'flex' : 'hidden sm:flex'}`}>
        <div className="flex w-full max-w-150 items-center">
          {isSearchActive && (
            <button
              onClick={() => setIsSearchActive(false)}
              className="mr-2 p-2 text-yt-text sm:hidden"
              aria-label="Close search"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="flex w-full overflow-hidden rounded-full border border-yt-border bg-yt-surface/30 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearch}
              placeholder="Search"
              autoFocus={isSearchActive}
              className="w-full bg-transparent px-4 py-1.5 text-sm text-yt-text outline-none placeholder-yt-muted"
            />
            <button className="border-l border-yt-border bg-yt-surface px-5 hover:bg-yt-border/50 transition-colors">
              <Search className="h-5 w-5 text-yt-text" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className={`flex items-center gap-1 sm:gap-2 ${isSearchActive ? 'hidden sm:flex' : 'flex'}`}>
        <button
          onClick={() => setIsSearchActive(true)}
          className="rounded-full p-2 text-yt-text hover:bg-yt-surface sm:hidden"
          aria-label="Open search"
        >
          <Search size={20} />
        </button>

        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="rounded-full p-2 text-yt-text hover:bg-yt-surface transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
        </button>

        {!user ? (
          <button
            onClick={() => navigate('/login')}
            className="ml-2 rounded-full border border-yt-border px-3 py-1.5 text-sm font-medium text-yt-primary hover:bg-yt-primary/10"
          >
            Sign in
          </button>
        ) : (
          <UserMenu user={user} onLogout={handleLogout} />
        )}
      </div>
    </nav>
  );
};

/**
 * Authenticated user dropdown menu.
 */
const UserMenu = ({ user, onLogout }) => (
  <div className="relative ml-1 flex items-center gap-4 py-2 group sm:ml-4">
    <span className="hidden md:block text-sm font-medium text-yt-text">
      {user.username}
    </span>

    <img
      src={user.avatar || 'https://via.placeholder.com/32'}
      alt="User avatar"
      className="h-8 w-8 cursor-pointer rounded-full border border-yt-border object-cover transition hover:ring-4 hover:ring-yt-surface"
    />

    <div className="invisible absolute right-0 top-full z-[200] mt-1 w-72 translate-y-2 rounded-2xl border border-yt-border bg-yt-bg opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="flex items-center gap-4 border-b border-yt-border bg-yt-surface/20 p-4">
        <img src={user.avatar} className="h-12 w-12 rounded-full object-cover" />
        <div className="overflow-hidden">
          <p className="truncate font-bold text-yt-text">{user.username}</p>
          <p className="truncate text-xs text-yt-muted">{user.email}</p>
        </div>
      </div>

      <div className="p-2">
        <MenuLink to="/studio/manageAccount" icon={<Settings size={18} />} label="Manage Profile" />
        <MenuLink to="/studio/updateProfile" icon={<UserPen size={18} />} label="Update Profile" />

        <div className="my-2 border-t border-yt-border" />

        <MenuLink
          to={user.channel ? `/channel/${user.channel._id}` : '/studio/createChannel'}
          icon={<MonitorPlay size={18} className="text-yt-primary" />}
          label={user.channel ? 'Your Channel' : 'Create a Channel'}
        />

        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  </div>
);

/**
 * Reusable dropdown navigation item.
 */
const MenuLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-yt-text hover:bg-yt-surface"
  >
    <span className="text-yt-muted">{icon}</span>
    {label}
  </Link>
);

export default NavBar
