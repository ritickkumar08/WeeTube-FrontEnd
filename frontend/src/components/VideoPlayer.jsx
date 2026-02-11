import React, { useCallback, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";


const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Toggle Play/Pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Update Progress Bar
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  // Seeking Logic
  const handleSeek = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(e.target.value);
  }, []);

  // Volume Logic
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const muted = !isMuted;
    video.muted = muted;
    setIsMuted(muted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  // Fullscreen Logic
  const toggleFullScreen = useCallback(() => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="group relative w-full aspect-video bg-black overflow-hidden border border-yt-border transition-all duration-300">
      <video
        ref={videoRef}
        // src={src}
        className="w-full h-full cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 md:p-4">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1.5 mb-3 accent-yt-primary cursor-pointer hover:h-2 transition-all"
        />

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            <div className="flex items-center gap-5 group/volume">
              <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-16 md:group-hover/volume:w-20 transition-all accent-white cursor-pointer h-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleFullScreen} className="hover:scale-110 transition-transform">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default VideoPlayer;
