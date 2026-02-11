import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      className="bg-zinc-900 p-4 rounded-md cursor-pointer"
    >
      <div className="bg-zinc-700 h-40 rounded-md mb-3" />
      <h3 className="font-semibold">{video.title}</h3>
      <p className="text-sm text-gray-400">{video.channel?.channelName}</p>
    </div>
  );
};
export default VideoCard;