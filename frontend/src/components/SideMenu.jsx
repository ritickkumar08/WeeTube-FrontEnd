import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  HouseHeart,
  Home,
  Clock,
  ThumbsUp,
  Video,
  ChevronDown,
  UserCircle,
  ThumbsDown,
} from "lucide-react";


/*
  Sidebar component for primary navigation and user-related links.
  Handles mobile toggle state and subscription expansion.
*/
const Sidebar = ({ isOpen, onClose }) => {

  // Access authenticated user from redux store
  const user = useSelector((state) => state.auth?.user);

  // Controls subscription expand/collapse
  const [showAllSubs, setShowAllSubs] = useState(false);

  // Ensure subscriptions is always an array
  const subscriptions = user?.subscribedChannels || [];

  // Show first 6 or full list depending on toggle
  const visibleSubs = showAllSubs
    ? subscriptions
    : subscriptions.slice(0, 6);

  // Static navigation items
  const youItems = [
    { icon: Clock, label: "History" },
    { icon: Clock, label: "Watch Later" },
    { icon: ThumbsUp, label: "Liked videos" },
    { icon: ThumbsDown, label: "Disliked Videos" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-14 left-0
          w-64 h-[calc(100vh-3.5rem)]
          overflow-y-auto scrollbar-yt
          z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
    
          flex flex-col
        `}
      >
        <div className="px-3 py-2 flex-1">

          {/* Home */}
          <Link
            to="/"
            className="flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-yt-surface text-yt-text"
          >
            <HouseHeart size={22} strokeWidth={2} />
            <span className="text-sm font-medium">Home</span>
          </Link>

          {/* Explore */}
          <Link
            to="/explore"
            className="flex items-center gap-5 px-3 py-2.5 rounded-lg hover:bg-yt-surface text-yt-text"
          >
            <Video size={22} strokeWidth={2} />
            <span className="text-sm font-medium">Explore</span>
          </Link>

          <div className="h-px my-3 bg-yt-border" />

          {/* You Section */}
          <div className="px-3 py-2 text-yt-text">
            <h2 className="text-[15px] font-semibold">You</h2>
          </div>

          <div className="space-y-1">

            {/* Channel / Create Channel */}
            {user && (
              <Link
                to={
                  user.channel
                    ? typeof user.channel === "string"
                      ? `/channel/${user.channel}`
                      : `/channel/${user.channel._id}`
                    : "/studio/createChannel"
                }
                className="flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-yt-surface text-yt-text"
              >
                <UserCircle size={22} strokeWidth={2} />
                <span className="text-sm font-medium">
                  {user.channel ? "Your channel" : "Create Channel"}
                </span>
              </Link>
            )}

            {/* Account-related links */}
            {youItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to="/studio/manageAccount"
                  className="flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-yt-surface text-yt-text"
                >
                  <Icon size={22} strokeWidth={2} />
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="h-px my-3 bg-yt-border" />

          {/* Subscriptions */}
          <div className="px-3 py-2 text-yt-text">
            <h2 className="text-[15px] font-semibold">Subscriptions</h2>
          </div>

          <div className="space-y-1">

            {visibleSubs.map((sub) => (
              <Link
                key={sub._id || sub.channelName}
                to={`/channel/${sub._id}`}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-yt-surface text-yt-text"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-yt-border bg-yt-bg">
                  <img
                    src={
                      sub.channelBanner ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${sub.channelName}`
                    }
                    className="w-full h-full object-cover"
                    alt={sub.channelName}
                  />
                </div>
                <span className="text-sm flex-1 truncate">
                  {sub.channelName}
                </span>
              </Link>
            ))}

            {/* Show More / Less */}
            {subscriptions.length > 6 && (
              <button
                onClick={() => setShowAllSubs((prev) => !prev)}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-yt-surface text-yt-text"
              >
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    showAllSubs ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {showAllSubs ? "Show less" : "Show more"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 mt-auto text-[11px] font-medium text-yt-muted border-t border-yt-border">
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
            <a href="#" className="hover:text-yt-text">About</a>
            <a href="#" className="hover:text-yt-text">Press</a>
            <a href="#" className="hover:text-yt-text">Copyright</a>
          </div>
          <p>© 2026 WeeTube IN</p>
        </footer>
      </aside>
    </>
  );
}


export default Sidebar;