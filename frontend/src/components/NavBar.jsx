import { Youtube } from 'lucide-react';


function NavBar() {
    return (
    <header className="flex items-center justify-between px-6 py-4 bg-zinc-900">
      <h1 className="flex items-center gap-2 text-xl font-bold text-red-600"><span> <Youtube/></span>WeeTube</h1>

      <input
        type="text"
        placeholder="Search"
        className="bg-zinc-800 px-4 py-2 rounded-md w-1/3 outline-none"
      />

      <button className="bg-red-600 px-4 py-2 rounded-md">
        Login
      </button>
    </header>
  );
};

export default NavBar