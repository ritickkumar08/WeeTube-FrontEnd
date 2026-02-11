
const Sidebar = () => {
  return (
    <aside className="w-56 bg-zinc-900 h-screen p-4 space-y-4">
      <div className="cursor-pointer hover:text-red-500">Home</div>
      <div className="cursor-pointer hover:text-red-500">Subscriptions</div>
      <div className="cursor-pointer hover:text-red-500">Your Videos</div>
    </aside>
  );
};

export default Sidebar;