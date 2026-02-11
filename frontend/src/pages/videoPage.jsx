import React from 'react';
import VideoSidebar from '../components/VideoSidebar';
import VideoLanding from '../components/VideoLanding';

/*
  Videos Page Layout
  - Displays selected video + comments
  - Shows recommended videos on large screens
*/

const VideoPage = () => {
  return (
    <div className="w-full min-h-screen bg-yt-bg">
      
      {/* Centered container for ultra-wide screens */}
      <div className="max-w-425 mx-auto flex flex-col lg:flex-row gap-4 px-0 sm:px-4 py-4">
        
        {/* Main video content section */}
        <main className="flex-1 lg:basis-[70%]">
          <VideoLanding />
        </main>

        {/* Recommendation sidebar (visible only on lg and above) */}
        <aside className="hidden lg:block lg:basis-[30%]">
          <VideoSidebar/>
        </aside>

      </div>
    </div>
  );
};

export default VideoPage;
