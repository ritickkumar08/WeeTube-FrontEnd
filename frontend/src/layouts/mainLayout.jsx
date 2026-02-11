import React from 'react';

const mainLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <Header />

      {/* Body Section */}
      <div className="flex">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Routed page content renders here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default mainLayout;
