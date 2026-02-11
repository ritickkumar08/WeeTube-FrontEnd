import React, { useEffect, useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import VideoDisplay from '../components/VideoDisplay';

const HomePage = () => {
  // Search term coming from layout (Navbar via Outlet context)
  const { searchTerm = "" } = useOutletContext();

  // State management
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Custom hook for fetching videos
  const { data: fetchedVideos, loading } = useFetch('/video');

  useEffect(() => {
    const cachedVideos = localStorage.getItem('yt_videos_cache');

    // If API returns data, update state and refresh cache
    if (fetchedVideos && Array.isArray(fetchedVideos)) {
      setVideos(fetchedVideos);
      localStorage.setItem('yt_videos_cache', JSON.stringify(fetchedVideos));
    } 
    // Fallback to cached data if API is still loading or fails
    else if (!fetchedVideos && cachedVideos) {
      setVideos(JSON.parse(cachedVideos));
    }
  }, [fetchedVideos]);

  // Static category list for filtering
  const categories = [
    "All",
    "Gaming",
    "Education",
    "Technology",
    "Travel",
    "Vlog",
    "News",
  ];

  // Memoized filtering for performance optimization
  const filteredVideos = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return videos.filter((video) => {
      const matchesCategory =
        activeCategory === "All" ||
        video.category?.toUpperCase() === activeCategory.toUpperCase();

      const matchesQuery =
        video.title?.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesQuery;
    });
  }, [videos, activeCategory, searchTerm]);

  // Initial loading state (only when no cached data exists)
  if (loading && videos.length === 0) {
    return <Loading variant="skeleton" type="video" />;
  }

  return (
    <div className="min-h-screen bg-yt-bg transition-colors duration-300">
      
      {/* Category Navigation */}
      <div className="sticky top-0 z-30 w-full bg-yt-bg/95 backdrop-blur-sm border-b border-yt-border px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[1400px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  activeCategory === cat
                    ? "bg-yt-text text-yt-bg shadow-md"
                    : "bg-yt-surface text-yt-text border border-yt-border hover:bg-yt-border"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid Section */}
      <div className="max-w-[1400px] mx-auto">
        <VideoDisplay videos={filteredVideos} />
      </div>
    </div>
  );
};

export default HomePage;
