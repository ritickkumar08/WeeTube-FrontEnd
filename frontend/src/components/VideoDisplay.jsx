import React from 'react';
import { ThumbsUp, ThumbsDown, MoreVertical, UserCircle, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * VideoGrid Component
 * Displays a responsive grid of video cards.
 * Shows empty state UI if no videos are available.
 */
const VideoDisplay = ({ videos = [], className = '' }) => {
  const navigate = useNavigate();

  // Empty state when no videos are found
  if (!videos.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-transparent p-6 text-center">
        {/* Empty State Icon */}
        <div className="mb-6 rounded-full bg-yt-surface p-8 ring-8 ring-yt-border/10">
          <Search size={48} className="text-yt-muted opacity-50" />
        </div>

        {/* Empty State Text */}
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-yt-text md:text-3xl">
            No videos found
          </h2>
          <p className="text-base text-yt-muted">
            Try different keywords or explore trending videos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-yt-border px-4 py-2 text-sm font-medium text-yt-text transition hover:bg-yt-surface active:scale-95"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-yt-text px-6 py-2 text-sm font-medium text-yt-bg transition hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        grid grid-cols-1 gap-x-6 gap-y-10 p-4
        sm:grid-cols-2
        lg:grid-cols-3
        max-w-[1400px] mx-auto
        md:p-6
        ${className}
      `}
    >
      {videos.map((video, index) => (
        <VideoCard key={video?._id || index} video={video} index={index} />
      ))}
    </div>
  );
};

/**
 * VideoCard Component
 * Displays individual video thumbnail and metadata.
 */
const VideoCard = ({ video, index }) => {
  const {
    title,
    thumbnailUrl,
    category,
    views = 0,
    likes = 0,
    dislikes = 0,
    channel,
    uploader
  } = video || {};

  const animationDelay = `${index * 50}ms`;

  return (
    <div
      className="group animate-slide-up flex flex-col bg-yt-bg border border-yt-border transition-all duration-300 hover:shadow-xl hover:z-10"
      style={{ animationDelay }}
    >
      {/* Thumbnail Section */}
      <Link
        to={`/watch/${video?._id}`}
        className="relative aspect-video w-full overflow-hidden bg-yt-surface border-b border-yt-border"
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-yt-primary p-3 shadow-lg">
              <div className="ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-white border-t-transparent" />
            </div>
          </div>
        </div>

        {/* Static Duration Placeholder */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-white tracking-wider">
          12:45
        </div>

        {/* Live Badge */}
        {category?.toUpperCase().includes('LIVE') && (
          <div className="absolute left-2 top-2 flex items-center gap-1 bg-yt-primary px-2 py-0.5 text-[10px] font-black text-white animate-live-pulse">
            <div className="h-1 w-1 rounded-full bg-white" />
            LIVE
          </div>
        )}
      </Link>

      {/* Video Metadata Section */}
      <div className="flex gap-3 bg-yt-bg p-4 transition-colors group-hover:bg-yt-surface/30">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {uploader?.avatar || channel?.owner?.avatar ? (
            <img
              src={uploader?.avatar || channel?.owner?.avatar}
              className="h-9 w-9 rounded-full border border-yt-border object-cover"
              alt="avatar"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-yt-border bg-yt-surface text-yt-muted">
              <UserCircle size={24} strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-yt-text transition-colors group-hover:text-yt-primary">
              {title}
            </h3>

            <button className="h-fit rounded-full p-1 text-yt-text opacity-0 transition-opacity hover:bg-yt-surface group-hover:opacity-100">
              <MoreVertical size={16} />
            </button>
          </div>

          {/* Channel Name */}
          <p className="mt-1 truncate text-xs font-semibold text-yt-muted transition-colors hover:text-yt-text cursor-pointer">
            {channel?.channelName || uploader?.username || 'Unknown Channel'}
          </p>

          {/* Engagement Stats */}
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-yt-muted">
            <span>{views.toLocaleString()} views</span>
            <span className="opacity-40">•</span>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 transition-colors group-hover:text-yt-primary">
                <ThumbsUp size={12} />
                <span>{likes.toLocaleString()}</span>
              </span>

              <span className="flex items-center gap-1">
                <ThumbsDown size={12} />
                <span>{dislikes.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
