import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const VideoSidebar = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const cachedVideos = localStorage.getItem("yt_videos_cache");
    if (cachedVideos) {
      try {
        setVideos(JSON.parse(cachedVideos));
      } catch (err) {
        console.error("Failed to parse cached videos", err);
      }
    }
  }, [id]);

  return (
    <div className="flex flex-col gap-2 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-yt pr-2">
      {videos.slice(0, 15).map(video => (
        <Link
          key={video._id}
          to={`/watch/${video._id}`}
          className="flex gap-2 group p-1 rounded-lg hover:bg-yt-surface transition-colors"
        >
          {/* Thumbnail */}
          <div className="w-40 h-24 flex-shrink-0 relative">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Video Info */}
          <div className="flex flex-col gap-1 overflow-hidden flex-1">
            <h4 className="text-sm font-bold text-yt-text line-clamp-2 leading-tight group-hover:text-yt-text">
              {video.title}
            </h4>
            <p className="text-xs text-yt-muted truncate">
              {video.channel?.channelName || 'Unknown'}
            </p>
            <div className="text-xs text-yt-muted">
              {video.views?.toLocaleString() || 0} views • 1 day ago
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VideoSidebar;
