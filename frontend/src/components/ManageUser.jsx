import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  History,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Users,
  PlaySquare,
  ChevronRight,
  Trash2
} from 'lucide-react';
import useFetch from '../hooks/useFetch'
import { clearAuth, updateUser } from '../store/authSlice';


const ManageUser = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');

  // Stable auth headers
  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Account delete trigger
  const [deleteAccTrigger, setDeleteAccTrigger] = useState(null);
  const { data: deleteAccData, error: deleteAccError } = useFetch(
    deleteAccTrigger,
    'DELETE',
    null,
    headers
  );

  // Remove item trigger
  const [removeItemTrigger, setRemoveItemTrigger] = useState(null);
  const { data: removeItemData, error: removeItemError } = useFetch(
    removeItemTrigger?.path || null,
    'DELETE',
    removeItemTrigger?.body || null,
    headers
  );

  // Account delete effect
  useEffect(() => {
    if (deleteAccData) {
      setDeleteAccTrigger(null);
      dispatch(clearAuth());
      navigate('/register', { replace: true });
    }

    if (deleteAccError) {
      alert(
        deleteAccError?.response?.data?.message ||
        'Failed to delete account'
      );
      setDeleteAccTrigger(null);
    }
  }, [deleteAccData, deleteAccError, dispatch, navigate]);

  // Remove item effect
  useEffect(() => {
    if (removeItemData?.user) {
      dispatch(updateUser(removeItemData.user));
      setRemoveItemTrigger(null);
    }

    if (removeItemError) {
      alert(
        removeItemError?.response?.data?.message ||
        'Failed to remove item'
      );
      setRemoveItemTrigger(null);
    }
  }, [removeItemData, removeItemError, dispatch]);

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure? This permanently deletes your account and channel.'
      )
    ) {
      setDeleteAccTrigger('user/delete');
    }
  };

  const handleRemoveItem = (e, videoId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Remove this video from the list?')) return;

    let path = '';

    if (activeTab === 'History') {
      path = '/other/watchhistory';
    } else if (activeTab === 'Watch Later') {
      path = '/other/watchlater';
    }

    if (!path) return;

    setRemoveItemTrigger({
      path,
      body: { videoId }
    });
  };

  if (!user) {
    return (
      <div className="bg-yt-bg min-h-screen text-yt-text p-10">
        Please log in.
      </div>
    );
  }

  const tabs = [
    {
      name: 'History',
      icon: <History size={18} />,
      data: (user.watchHistory || [])
        .filter(item => item?.video)
        .map(item => ({
          ...item.video,
          watchedAt: item.watchedAt
        }))
    },
    {
      name: 'Subscriptions',
      icon: <Users size={18} />,
      data: user.subscribedChannels || []
    },
    {
      name: 'Liked',
      icon: <ThumbsUp size={18} />,
      data: user.likedVideos || []
    },
    {
      name: 'Disliked',
      icon: <ThumbsDown size={18} />,
      data: user.dislikedVideos || []
    },
    {
      name: 'Watch Later',
      icon: <Clock size={18} />,
      data: user.watchLater || []
    }
  ];

  const currentTabObj = tabs.find(t => t.name === activeTab);
  const currentData = currentTabObj?.data || [];

  return (
    <div className="bg-yt-bg min-h-screen text-yt-text pb-20">
      <div className="max-w-7xl mx-auto px-4 xxs:px-8">

        {/* Profile Header */}
        <div className="flex flex-col xs:flex-row items-center gap-6 py-10 border-b border-yt-border">
          <img
            src={user.avatar}
            className="w-28 h-28 rounded-full border-4 border-yt-surface shadow-xl object-cover"
            alt="Profile"
          />

          <div className="text-center xs:text-left">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-yt-muted text-sm mb-4">{user.email}</p>

            <div className="flex flex-wrap justify-center xs:justify-start gap-2">
              <button
                onClick={() => navigate('/studio/updateProfile')}
                className="bg-yt-surface border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold hover:bg-yt-border/40"
              >
                Customize Profile
              </button>

              <button
                onClick={() => {
                  dispatch(clearAuth());
                  navigate('/', { replace: true });
                }}
                className="bg-yt-surface border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold hover:bg-yt-border/40"
              >
                Sign Out
              </button>

              <button
                onClick={handleDeleteAccount}
                className="bg-yt-surface border border-yt-border px-4 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 hover:text-white transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-4 overflow-x-auto border-b border-yt-border">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap ${
                activeTab === tab.name
                  ? 'border-b-2 border-yt-primary text-yt-text'
                  : 'text-yt-muted hover:text-yt-text'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 uppercase">
              {currentTabObj?.icon} {activeTab}
            </h2>
            <span className="text-yt-muted text-xs font-bold">
              {currentData.length}{' '}
              {activeTab === 'Subscriptions' ? 'Channels' : 'Videos'}
            </span>
          </div>

          {currentData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-yt-surface/30 rounded-3xl border border-dashed border-yt-border">
              <div className="w-20 h-20 bg-yt-surface rounded-full flex items-center justify-center text-yt-muted mb-6">
                <PlaySquare size={32} />
              </div>
              <h3 className="text-lg font-bold">
                Nothing in {activeTab} yet
              </h3>
            </div>
          ) : activeTab === 'Subscriptions' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentData.map(channel => (
                <Link
                  key={channel._id}
                  to={`/channel/${channel._id}`}
                  className="flex items-center gap-4 p-4 bg-yt-surface rounded-xl border border-yt-border hover:border-yt-primary/50 group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-yt-border bg-yt-bg">
                    <img
                      src={
                        channel.channelBanner ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${channel.channelName}`
                      }
                      className="w-full h-full object-cover"
                      alt={channel.channelName}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate group-hover:text-yt-primary">
                      {channel.channelName}
                    </h3>
                    <p className="text-xs text-yt-muted">
                      {channel.subscribers?.length || 0} subscribers
                    </p>
                  </div>

                  <ChevronRight size={20} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentData.map(video => (
                <Link
                  key={video._id}
                  to={`/watch/${video._id}`}
                  className="flex flex-col gap-2 group relative"
                >
                  <div className="relative aspect-video bg-yt-surface rounded-xl overflow-hidden border border-yt-border">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {(activeTab === 'History' ||
                      activeTab === 'Watch Later') && (
                      <button
                        onClick={e =>
                          handleRemoveItem(e, video._id)
                        }
                        className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-yt-primary">
                    {video.title}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ManageUser;
