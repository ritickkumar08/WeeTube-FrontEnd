import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, UserCircle } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import useFetch from '../hooks/useFetch'
import { updateUser } from "../store/authSlice";
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';
import Loading from '../components/Loading'

const VideoLanding = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [video, setVideo] = useState(null);
    const watchLoggedRef = useRef(false);

    /* ---------------- Fetch Video ---------------- */
    const { data: fetchedVideo, loading: videoLoading } = useFetch(`/video/${id}`);

    useEffect(() => {
        if (fetchedVideo) {
        setVideo(fetchedVideo);
        watchLoggedRef.current = false; // reset when video changes
        }
    }, [fetchedVideo]);

    /* ---------------- Auth Headers ---------------- */
    const headers = useMemo(() => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }), []);
  /* ===================== WATCH HISTORY ===================== */
  const { data: historyRes } = useFetch(
    user && video && !watchLoggedRef.current
      ? "/other/watchhistory"
      : null,
    "POST",
    { videoId: id },
    headers
  );

  useEffect(() => {
    if (historyRes?.user) {
      dispatch(updateUser(historyRes.user));
      watchLoggedRef.current = true;
    }
  }, [historyRes, dispatch]);

  /* ===================== LIKE ===================== */
  const [likeTrigger, setLikeTrigger] = useState(null);
  const { data: likeRes } = useFetch(
    likeTrigger,
    "POST",
    { videoId: id },
    headers
  );

  useEffect(() => {
    if (likeRes?.user && likeRes?.video) {
      dispatch(updateUser(likeRes.user));
      setVideo((prev) =>
        prev ? { ...prev, likes: likeRes.video.likes } : prev
      );
      setLikeTrigger(null);
    }
  }, [likeRes, dispatch]);

  /* ===================== DISLIKE ===================== */
  const [dislikeTrigger, setDislikeTrigger] = useState(null);
  const { data: dislikeRes } = useFetch(
    dislikeTrigger,
    "POST",
    { videoId: id },
    headers
  );

  useEffect(() => {
    if (dislikeRes?.user && dislikeRes?.video) {
      dispatch(updateUser(dislikeRes.user));
      setVideo((prev) =>
        prev ? { ...prev, likes: dislikeRes.video.likes } : prev
      );
      setDislikeTrigger(null);
    }
  }, [dislikeRes, dispatch]);

  /* ===================== SUBSCRIBE ===================== */
  const [subTrigger, setSubTrigger] = useState(null);
  const { data: subRes } = useFetch(
    subTrigger,
    "POST",
    { channelId: video?.channel?._id },
    headers
  );

  useEffect(() => {
    if (subRes?.user && subRes?.channel) {
      dispatch(updateUser(subRes.user));
      setVideo((prev) =>
        prev
          ? {
              ...prev,
              channel: {
                ...prev.channel,
                subscribers: subRes.channel.subscribers,
              },
            }
          : prev
      );
      setSubTrigger(null);
    }
  }, [subRes, dispatch]);

  /* ===================== WATCH LATER ===================== */
  const [laterTrigger, setLaterTrigger] = useState(null);
  const { data: laterRes } = useFetch(
    laterTrigger,
    "POST",
    { videoId: id },
    headers
  );

  useEffect(() => {
    if (laterRes?.user) {
      dispatch(updateUser(laterRes.user));
      setLaterTrigger(null);
    }
  }, [laterRes, dispatch]);

  /* ===================== DERIVED STATE ===================== */
  const isLiked = useMemo(
    () => user?.likedVideos?.some((v) => v._id === id),
    [user, id]
  );

  const isDisliked = useMemo(
    () => user?.dislikedVideos?.some((v) => v._id === id),
    [user, id]
  );

  const isSubscribed = useMemo(
    () =>
      user?.subscribedChannels?.some(
        (c) => c._id === video?.channel?._id
      ),
    [user, video]
  );

  const isInWatchLater = useMemo(
    () => user?.watchLater?.some((v) => v._id === id),
    [user, id]
  );

  /* ===================== HANDLERS ===================== */
  const requireAuth = (callback) => {
    if (!user) return alert("Login required");
    callback();
  };

  const handleLike = () =>
    requireAuth(() => setLikeTrigger("/other/likes"));

  const handleDislike = () =>
    requireAuth(() => setDislikeTrigger("/other/dislikes"));

  const handleSubscribe = () =>
    requireAuth(() => setSubTrigger("/other/subscribe"));

  const handleWatchLater = () =>
    requireAuth(() => setLaterTrigger("/other/watchlater"));

  /* ===================== RENDER STATES ===================== */
  if (videoLoading)
    return <Loading variant="spinner" size="lg" text="Loading video..." />;

  if (!video)
    return (
      <div className="p-10 text-center text-yt-text">
        Video not found.
      </div>
    );

  /* ===================== UI ===================== */
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
            ) : (
              <UserCircle size={40} className="text-yt-muted" />
            )}

            <div>
              <h3 className="font-bold">
                {video.channel?.channelName || "Unknown Channel"}
              </h3>
              <p className="text-xs text-yt-muted">
                {video.channel?.subscribers?.toLocaleString() || 0} subscribers
              </p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              isSubscribed
                ? "bg-yt-surface border border-yt-border"
                : "bg-yt-text text-yt-bg"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">

          <div className="flex items-center bg-yt-surface rounded-full border border-yt-border overflow-hidden">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 border-r border-yt-border ${
                isLiked ? "bg-white/10" : ""
              }`}
            >
              <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-bold">
                {video.likes?.toLocaleString()}
              </span>
            </button>

            <button
              onClick={handleDislike}
              className={`px-4 py-2 ${
                isDisliked ? "bg-white/10" : ""
              }`}
            >
              <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
            </button>
          </div>

          <button
            onClick={handleWatchLater}
            className={`px-4 py-2 rounded-full border text-sm font-bold ${
              isInWatchLater
                ? "bg-yt-surface text-yt-primary border-yt-primary"
                : "bg-yt-surface border-yt-border"
            }`}
          >
            <Clock size={18} className="inline mr-2" />
            {isInWatchLater ? "Saved" : "Watch Later"}
          </button>

          <button
            onClick={() => navigate(`/channel/${video.channel?._id}`)}
            className="px-4 py-2 bg-yt-surface rounded-full border border-yt-border text-sm font-bold"
          >
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
        <p className="whitespace-pre-line line-clamp-3">
          {video.description}
        </p>
      </div>

      {/* Comments */}
      <div className="mx-4 sm:mx-0">
        <CommentSection currentUser={user} videoId={video._id} />
      </div>
    </div>
  );
};


export default VideoLanding;
