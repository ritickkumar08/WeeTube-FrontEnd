import React from 'react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosConfig";
import CommentSection from "../components/CommentSection";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axiosInstance.get(`/videos/${id}`);
      setVideo(res.data);
    };
    fetchVideo();
  }, [id]);

  if (!video) return <p>Loading...</p>;

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <video
          src={video.videoUrl}
          controls
          className="w-full rounded-md"
        />

        <h2 className="text-xl mt-4">{video.title}</h2>
        <p className="text-gray-400">{video.description}</p>

        <CommentSection videoId={id} />
      </div>
    </div>
  );
};

export default VideoPage;
