import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ErrorPage from '../pages/ErrorPage';
import SuccesToastMessage from './SuccesToastMessage';
import { PlusCircle, MoreVertical, Edit2, Trash2, Video as VideoIcon } from 'lucide-react';
import DeleteChannel from './DeleteChannel';
import Loading from '../components/Loading'


const ChannelProfile = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  // UI States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [localVideos, setLocalVideos] = useState([]);

  const menuRef = useRef();

  // Fetch Channel Data
  const { data: fetchedData, loading: channelLoading, error: fetchError } = useFetch(`/channel/${channelId}`);

  // Delete Video Hook
  const headers = useMemo(() => ({ Authorization: `Bearer ${localStorage.getItem('token')}` }), []);
  const { data: deleteRes, error: deleteError, loading: deleteLoading } = useFetch(
    videoToDelete ? `/video/${videoToDelete}` : null,
    'DELETE',
    null,
    headers
  );

  // Sync local video state when fetched
  useEffect(() => {
    if (fetchedData?.videos) setLocalVideos(fetchedData.videos);
  }, [fetchedData]);

  // Handle delete response
  useEffect(() => {
    if (deleteRes) {
      setLocalVideos(prev => prev.filter(v => v._id !== videoToDelete));
      setVideoToDelete(null);
      setActiveMenu(null);
    }
    if (deleteError) {
      alert("Failed to delete video: " + deleteError.message);
      setVideoToDelete(null);
    }
  }, [deleteRes, deleteError, videoToDelete]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (channelLoading) return <Loading variant="spinner" size="full" text="Loading Channel..." />;
  if (fetchError || !fetchedData) return <ErrorPage status="404" title="Channel Not Found" message="The channel you are looking for does not exist." />;

  const { channel } = fetchedData;
  const isOwner = String(user?.id) === String(channel.owner._id);

  const handleDeleteClick = (videoId) => setVideoToDelete(videoId);

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr));

  return (
    <div className="bg-yt-bg text-yt-text min-h-screen transition-colors duration-300">
      {toast && <SuccesToastMessage type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      {/* Banner */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-yt-surface overflow-hidden">
        {channel.channelBanner && <img src={channel.channelBanner} className="w-full h-full object-cover" alt="Banner" />}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Channel Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pb-8 border-b border-yt-border">
          <div className="flex items-center gap-4">
            <img src={channel.owner.avatar} className="w-20 h-20 rounded-full border-2 border-yt-border" alt="Avatar" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{channel.channelName}</h1>
              <p className="text-yt-muted text-sm">
                @{channel.owner.username} • {localVideos.length} Video{localVideos.length !== 1 ? 's' : ''}
              </p>
              <p className="text-yt-muted text-xs mt-1">{channel.subscribers?.toLocaleString() || 0} subscribers</p>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/studio/updateChannel', { state: { channel } })}
                className="bg-yt-surface border border-yt-border px-4 py-2 rounded-full text-sm font-bold hover:bg-yt-border transition-all"
              >
                Edit Channel
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-yt-primary/10 text-yt-primary border border-yt-primary/20 px-4 py-2 rounded-full text-sm font-bold hover:bg-yt-primary hover:text-white transition-all"
              >
                Delete Channel
              </button>
            </div>
          )}
        </div>

        {isDeleteModalOpen && <DeleteChannel channelId={channel._id} onClose={() => setIsDeleteModalOpen(false)} />}

        {/* Videos Section */}
        <div className="flex justify-between items-center mt-8 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <VideoIcon size={20} className="text-yt-primary" />
            {isOwner ? 'Manage Your Videos' : 'Videos'}
          </h2>
          {isOwner && (
            <button
              onClick={() => navigate('/studio/CreateVideo')}
              className="flex items-center gap-2 bg-yt-text text-yt-bg px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <PlusCircle size={18} /> Create Video
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-10">
          {localVideos.map((video) => (
            <div key={video._id} className="flex flex-col gap-2 relative group">
              <div className="relative aspect-video bg-yt-surface rounded-xl overflow-hidden border border-yt-border">
                <Link to={`/watch/${video._id}`}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail')}
                  />
                </Link>

                {isOwner && (
                  <div className="absolute top-2 right-2 z-20" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveMenu(activeMenu === video._id ? null : video._id);
                      }}
                      className="p-1.5 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === video._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-yt-surface border border-yt-border rounded-lg shadow-xl z-30 overflow-hidden">
                        <button
                          onClick={() => navigate('/studio/updateVideo', { state: { video } })}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-yt-border text-yt-text"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(video._id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-500"
                          disabled={deleteLoading && videoToDelete === video._id}
                        >
                          <Trash2 size={14} /> {deleteLoading && videoToDelete === video._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-1">
                <Link to={`/watch/${video._id}`}>
                  <h3 className="font-bold text-sm sm:text-base line-clamp-2 hover:text-yt-primary transition-colors">
                    {video.title}
                  </h3>
                </Link>
                <p className="text-yt-muted text-xs mt-1">
                  {video.views?.toLocaleString() || 0} views • {formatDate(video.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {localVideos.length === 0 && (
          <div className="text-center py-16 text-yt-muted">
            <VideoIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No videos yet</p>
            {isOwner && (
              <button
                onClick={() => navigate('/studio/CreateVideo')}
                className="bg-yt-primary text-white px-4 py-2 rounded-full font-bold hover:opacity-90 transition-all"
              >
                Create Your First Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



export default ChannelProfile;
