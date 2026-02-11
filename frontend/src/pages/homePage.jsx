const videos = [
  {
    id: 1,
    title: "Learn React in 30 Minutes",
    channel: "Code Master",
    views: "120K views",
  },
  {
    id: 2,
    title: "Node.js Crash Course",
    channel: "Backend Pro",
    views: "98K views",
  },
];


const Homepage = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-zinc-900 p-4 rounded-md">
          <div className="bg-zinc-700 h-40 rounded-md mb-3" />
          <h3 className="font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">{video.channel}</p>
          <p className="text-sm text-gray-400">{video.views}</p>
        </div>
      ))}
    </div>
  );
};

export default Homepage;