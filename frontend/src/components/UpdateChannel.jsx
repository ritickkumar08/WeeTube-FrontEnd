import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { updateUser } from '../store/authSlice';
import SuccesToastMessage from './SuccesToastMessage';
import { Edit3, ArrowLeft, Image as ImageIcon } from 'lucide-react';


const UpdateChannel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const channelData = location.state?.channel;

  // Redirect if page accessed directly without state
  useEffect(() => {
    if (!channelData) {
      navigate('/', { replace: true });
    }
  }, [channelData, navigate]);

  const [formData, setFormData] = useState({
    channelName: channelData?.channelName || '',
    description: channelData?.description || '',
    channelBanner: channelData?.channelBanner || '',
  });

  // Stable auth headers
  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // PUT trigger
  const [updateTrigger, setUpdateTrigger] = useState(null);

  const {
    data: updateResponse,
    loading: updateLoading,
    error: updateError,
  } = useFetch(updateTrigger, 'PUT', formData, headers);

  // Refresh user trigger
  const [refreshTrigger, setRefreshTrigger] = useState(null);

  const {
    data: refreshedUser,
    error: refreshError,
  } = useFetch(refreshTrigger, 'GET', null, headers);

  // After successful PUT → trigger profile refresh
  useEffect(() => {
    if (updateResponse) {
      setUpdateTrigger(null); // reset trigger
      setRefreshTrigger('/user/me');
    }

    if (updateError) {
      setToast({
        type: 'error',
        title: 'Update Failed',
        message:
          updateError?.response?.data?.message ||
          'Unable to save changes.',
      });
      setUpdateTrigger(null);
    }
  }, [updateResponse, updateError]);

  // After successful profile refresh → sync redux
  useEffect(() => {
    if (refreshedUser) {
      dispatch(updateUser(refreshedUser));
      setToast({
        type: 'success',
        title: 'Updated',
        message: 'Channel updated successfully.',
      });

      setRefreshTrigger(null);

      setTimeout(() => {
        navigate(`/channel/${channelData?._id}`, { replace: true });
      }, 1200);
    }

    if (refreshError) {
      setToast({
        type: 'error',
        title: 'Sync Error',
        message:
          'Changes saved but failed to refresh profile data.',
      });
    }
  }, [refreshedUser, refreshError, dispatch, navigate, channelData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.channelName.trim()) {
      setToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Channel name is required.',
      });
      return;
    }

    setUpdateTrigger(`/channel/${channelData._id}`);
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 md:p-8 transition-colors duration-300">
      {toast && (
        <SuccesToastMessage
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-3xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-6 transition-colors font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3 text-yt-text">
            <Edit3 className="text-yt-primary" size={20} />
            Edit Channel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Banner Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-yt-muted uppercase flex items-center gap-2">
                <ImageIcon size={12} /> Channel Banner
              </label>

              <div className="relative w-full h-32 md:h-40 bg-yt-bg rounded-xl overflow-hidden border border-yt-border">
                {formData.channelBanner ? (
                  <img
                    src={formData.channelBanner}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-yt-muted text-xs font-bold">
                    NO BANNER SET
                  </div>
                )}
              </div>

              <input
                name="channelBanner"
                value={formData.channelBanner}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full bg-yt-bg border border-yt-border p-3 rounded-xl text-sm outline-none focus:border-yt-primary text-yt-text transition-colors"
              />
            </div>

            {/* Channel Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase">
                Channel Name
              </label>
              <input
                name="channelName"
                value={formData.channelName}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl font-bold text-lg outline-none focus:border-yt-primary text-yt-text transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your channel..."
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl h-36 text-sm outline-none focus:border-yt-primary text-yt-text resize-none transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={updateLoading}
              className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide disabled:opacity-50"
            >
              {updateLoading ? 'Saving Changes...' : 'Update Channel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default UpdateChannel;
