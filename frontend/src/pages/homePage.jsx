import VideoCard from "../components/VideoCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../store/videoSlice";



const Homepage = () => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch])

  if (loading) return <p>Loading...</p>;
  return (
   <div className="grid grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Homepage;