import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, AlertTriangle, Ban, WifiOff, Home } from 'lucide-react';


const ErrorPage = ({ status = '404', title, message, homeRoute = '/' }) => {
  const navigate = useNavigate();

  // Determine icon based on status
  const ErrorIcon = useMemo(() => {
    const code = parseInt(status);
    if (code === 404) return XCircle;
    if (code === 403 || code === 401) return Ban;
    if (code >= 500) return AlertTriangle;
    if (code === 0 || status === 'offline') return WifiOff;
    return AlertTriangle;
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-yt-bg text-yt-text rounded-lg border border-yt-border max-w-sm mx-auto">
      <ErrorIcon className="w-12 h-12 text-yt-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title || 'Oops! Something went wrong'}</h2>
      <p className="text-sm text-yt-muted text-center mb-4">
        {message || 'The page you are looking for does not exist or an error occurred.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(homeRoute)}
          className="flex items-center gap-2 bg-yt-primary text-white px-4 py-2 rounded-full font-bold text-sm hover:opacity-90 transition"
        >
          <Home size={16} /> Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-yt-surface border border-yt-border px-4 py-2 rounded-full text-sm font-bold hover:bg-yt-border transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};


export default ErrorPage;
