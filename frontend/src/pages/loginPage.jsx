import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-zinc-900 p-8 rounded-md w-96 space-y-4">
        <h2 className="text-xl font-semibold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-zinc-800 rounded-md"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-zinc-800 rounded-md"
        />

        <button className="w-full bg-red-600 p-2 rounded-md">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
