import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, UserCircle } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import useFetch from '../hooks/useFetch'
import { updateUser } from "../store/authSlice";
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';
import Loading from '../components/Loading'

/* ------------------- Reducer for video state ------------------- */
const videoReducer = (state, action) => {
  switch(action.type) {
    case 'SET_VIDEO':
      return action.payload;
    case 'UPDATE_LIKES':
      return { ...state, likes: action.payload.likes };
    case 'UPDATE_CHANNEL':
      return { 
        ...state, 
        channel: { ...state.channel, subscribers: action.payload.subscribers }
      };
    default:
      return state;
  }
};

const VideoLanding = () => {
    const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const watchLoggedRef = useRef(false);
  const [video, videoDispatch] = useReducer(videoReducer, null);

  /* ---------------- Fetch Video ---------------- */
  const { data: fetchedVideo, loading: videoLoading } = useFetch(`/video/${id}`);

  useEffect(() => {
    if (fetchedVideo) {
      videoDispatch({ type: 'SET_VIDEO', payload: fetchedVideo });
      watchLoggedRef.current = false;
    }
  }, [fetchedVideo]);

  /* ---------------- Auth Headers ---------------- */
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }), []);

  /* ---------------- Triggers ---------------- */
  const [trigger, setTrigger] = React.useState({ type: null, url: null });

  const { data: triggerRes } = useFetch(
    trigger.url,
    trigger.type === 'POST' ? 'POST' : 'GET',
    trigger.type === 'POST' ? trigger.body : null,
    headers
  );

  /* ---------------- Effect for triggers ---------------- */
  useEffect(() => {
    if (!triggerRes) return;

    const { type } = trigger;
    if (triggerRes.user) {
      dispatch(updateUser(triggerRes.user));
    }

    if (type === 'like' || type === 'dislike') {
      if (triggerRes.video) {
        videoDispatch({ type: 'UPDATE_LIKES', payload: { likes: triggerRes.video.likes } });
      }
    }

    if (type === 'subscribe' && triggerRes.channel) {
      videoDispatch({ type: 'UPDATE_CHANNEL', payload: { subscribers: triggerRes.channel.subscribers } });
    }

    setTrigger({ type: null, url: null });
  }, [triggerRes, trigger.type, dispatch]);

  /* ---------------- Derived States ---------------- */
  const isLiked = useMemo(
    () => user?.likedVideos?.some(v => v._id === id),
    [user, id]
  );

  const isDisliked = useMemo(
    () => user?.dislikedVideos?.some(v => v._id === id),
    [user, id]
  );

  const isSubscribed = useMemo(
    () => user?.subscribedChannels?.some(c => c._id === video?.channel?._id),
    [user, video]
  );

  const isInWatchLater = useMemo(
    () => user?.watchLater?.some(v => v._id === id),
    [user, id]
  );

  /* ---------------- Handlers ---------------- */
  const requireAuth = useCallback((callback) => {
    if (!user) return alert("Login required");
    callback();
  }, [user]);

  const handleLike = useCallback(() => requireAuth(() => setTrigger({ type: 'like', url: '/other/likes', body: { videoId: id } })), [requireAuth, id]);
  const handleDislike = useCallback(() => requireAuth(() => setTrigger({ type: 'dislike', url: '/other/dislikes', body: { videoId: id } })), [requireAuth, id]);
  const handleSubscribe = useCallback(() => requireAuth(() => setTrigger({ type: 'subscribe', url: '/other/subscribe', body: { channelId: video?.channel?._id } })), [requireAuth, video]);
  const handleWatchLater = useCallback(() => requireAuth(() => setTrigger({ type: 'later', url: '/other/watchlater', body: { videoId: id } })), [requireAuth, id]);

  /* ---------------- Render ---------------- */
  if (videoLoading) return <Loading variant="spinner" size="lg" text="Loading video..." />;

  if (!video) return <div className="p-10 text-center text-yt-text">Video not found.</div>;

  return (
    <div className="w-full flex flex-col gap-4 bg-yt-bg text-yt-text transition-colors duration-300">
      
      {/* Video Player */}
      <div className="w-full aspect-video bg-black overflow-hidden rounded-none sm:rounded-xl">
        <VideoPlayer src={video.videoUrl} />
      </div>

      <div className="px-4 sm:px-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 line-clamp-2">
          {video.title}
        </h1>

        {/* Channel + Subscribe */}
        <div className="flex items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-3">
            {video.channel?.owner?.avatar ? (
              <img
                src={video.channel.owner.avatar}
                alt="Channel"
                className="h-10 w-10 rounded-full object-cover border border-yt-border"
              />
            ) : <UserCircle size={40} className="text-yt-muted" />}

            <div>
              <h3 className="font-bold">{video.channel?.channelName || "Unknown Channel"}</h3>
              <p className="text-xs text-yt-muted">{video.channel?.subscribers?.toLocaleString() || 0} subscribers</p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              isSubscribed ? "bg-yt-surface border border-yt-border" : "bg-yt-text text-yt-bg"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden">
            <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 border-r border-yt-border ${isLiked ? "bg-white/10" : ""}`}>
              <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-bold">{video.likes?.toLocaleString()}</span>
            </button>
            <button onClick={handleDislike} className={`px-4 py-2 ${isDisliked ? "bg-white/10" : ""}`}>
              <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
            </button>
          </div>

          <button onClick={handleWatchLater} className={`px-4 py-2 rounded-full border text-sm font-bold ${isInWatchLater ? "bg-yt-surface text-yt-primary border-yt-primary" : "bg-yt-surface border-yt-border"}`}>
            <Clock size={18} className="inline mr-2" />
            {isInWatchLater ? "Saved" : "Watch Later"}
          </button>

          <button onClick={() => navigate(`/channel/${video.channel?._id}`)} className="px-4 py-2 bg-yt-surface rounded-full border border-yt-border text-sm font-bold">
            Channel
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mx-4 sm:mx-0 bg-yt-surface rounded-xl p-4 border border-yt-border text-sm">
        <div className="flex flex-wrap gap-3 font-bold mb-2 text-xs">
          <span>{video.views?.toLocaleString()} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          <span className="text-yt-muted">#{video.category}</span>
        </div>
        <p className="whitespace-pre-line line-clamp-3">{video.description}</p>
      </div>

      {/* Comments */}
      <div className="mx-4 sm:mx-0">
        <CommentSection currentUser={user} videoId={video._id} />
      </div>
    </div>
  );
};


export default VideoLanding;
