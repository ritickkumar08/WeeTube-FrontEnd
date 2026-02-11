import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertTriangle, X } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { updateUser } from '../store/authSlice';

const DeleteChannel = ({ channelId, onClose }) => {
    const [key, setKey] = useState('');
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    // Memoized auth header
    const headers = useMemo(() => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }, []);

    // Request payload (kept stable unless key changes)
    const requestBody = useMemo(() => {
        return { uniqueDeleteKey: key };
    }, [key]);

    // Trigger-based DELETE request
    const [triggerPath, setTriggerPath] = useState(null);

    const { data, loading, error } = useFetch(
        triggerPath,
        'DELETE',
        triggerBodyValidator(key) ? requestBody : null,
        headers
    );
  // Ensures body is only sent if key exists
  function triggerBodyValidator(value) {
    return value && value.trim().length > 0;
  }

  // Response lifecycle handler
  useEffect(() => {
    if (data) {
      // Update redux state (remove channel reference)
      if (user) {
        dispatch(updateUser({ ...user, channel: null }));
      }

      // Hard redirect to reset entire app state
      window.location.replace('/');
    }

    if (error) {
      alert(
        error?.response?.data?.message || 'Invalid delete key'
      );
      setTriggerPath(null); // reset so retry works
    }
  }, [data, error, dispatch, user]);

  const handleDeleteClick = () => {
    if (!key.trim() || loading) return;
    setTriggerPath(`/channel/${channelId}`);
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-yt-bg border border-yt-border w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-6">

        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertTriangle size={32} />
          </div>

          <button
            onClick={onClose}
            className="text-yt-muted hover:text-yt-text transition-colors"
          >
            <X />
          </button>
        </div>

        {/* Warning Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-yt-text uppercase tracking-tight">
            Permanent Deletion
          </h3>

          <p className="text-yt-muted text-sm">
            This will permanently remove
            <span className="text-red-400 font-bold"> all videos </span>
            and
            <span className="text-red-400 font-bold"> subscribers</span>.
            This action cannot be undone.
          </p>
        </div>

        {/* Key Input */}
        <div className="space-y-3">
          <label className="text-xs font-black text-yt-muted uppercase">
            Enter Unique Delete Key
          </label>

          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl text-yt-text outline-none focus:border-yt-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleDeleteClick}
          disabled={!key.trim() || loading}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Confirm Permanent Deletion'}
        </button>
      </div>
    </div>
  );
};


export default DeleteChannel;
