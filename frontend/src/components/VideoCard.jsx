const VideoCard = ({ video }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-md">
      <div className="bg-zinc-700 h-40 rounded-md mb-3" />
      <h3 className="font-semibold">{video.title}</h3>
      <p className="text-sm text-gray-400">{video.channel}</p>
      <p className="text-sm text-gray-400">{video.views}</p>
    </div>
  );
};

export default VideoCard;