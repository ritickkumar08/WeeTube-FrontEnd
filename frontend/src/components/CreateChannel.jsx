import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { updateUser } from '../store/authSlice';
import { Layout, KeyRound } from 'lucide-react';
import SuccessToast from '../components/SuccesToastMessage'


const CreateChannel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // Local form state
  const [formData, setFormData] = useState({
    channelName: '',
    description: '',
    channelBanner: '',
    uniqueDeleteKey: ''
  });

  // Memoized auth headers (prevents re-creation on every render)
  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Trigger for create request
  const [createTrigger, setCreateTrigger] = useState(null);
  const {
    data: createData,
    loading: createLoading,
    error: createError
  } = useFetch(createTrigger, 'POST', formData, headers);

  // Trigger for refreshing updated user data
  const [refreshTrigger, setRefreshTrigger] = useState(null);

  const {
    data: updatedUserData,
    error: refreshError
  } = useFetch(refreshTrigger, 'GET', null, headers);

  // After successful channel creation → fetch updated user
  useEffect(() => {
    if (createData) {
      setCreateTrigger(null); // reset trigger
      setRefreshTrigger('/api/auth/me');
    }

    if (createError) {
      setToast({
        type: 'error',
        title: 'Error',
        message:
          createError?.response?.data?.message || 'Channel creation failed'
      });
      setCreateTrigger(null);
    }
  }, [createData, createError]);

  // After user refresh → update redux + redirect
  useEffect(() => {
    if (updatedUserData) {
      dispatch(updateUser(updatedUserData));

      setToast({
        type: 'success',
        title: 'Success',
        message: 'Channel created successfully'
      });

      // Redirect after short delay
      const timer = setTimeout(() => {
        if (updatedUserData?.channel?._id) {
          navigate(`/channel/${updatedUserData.channel._id}`);
        }
      }, 1200);

      return () => clearTimeout(timer);
    }

    if (refreshError) {
      setToast({
        type: 'error',
        title: 'Sync Error',
        message: 'Channel created but user sync failed'
      });
    }
  }, [updatedUserData, refreshError, dispatch, navigate]);

  // Input handler (single handler for clean state updates)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.channelName.trim() || !formData.uniqueDeleteKey.trim()) {
      setToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Channel name and security key are required'
      });
      return;
    }

    setCreateTrigger('/channel');
  };

  return (
    <div className="bg-yt-bg min-h-screen p-4 xxs:p-8">
      {toast && (
        <SuccessToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-yt-text flex items-center gap-2">
          <Layout className="text-yt-primary" />
          Create Channel
        </h2>

        {/* Banner Preview */}
        <div className="w-full h-32 xxs:h-48 bg-yt-surface rounded-2xl overflow-hidden border border-yt-border">
          {formData.channelBanner ? (
            <img
              src={formData.channelBanner}
              alt="Banner Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-yt-muted text-xs uppercase font-bold">
              Banner Preview
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Channel Name */}
          <input
            name="channelName"
            value={formData.channelName}
            onChange={handleChange}
            placeholder="Channel Name *"
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none focus:border-yt-primary text-yt-text"
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Channel Description"
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl h-24 outline-none text-yt-text"
          />

          {/* Banner URL */}
          <input
            name="channelBanner"
            value={formData.channelBanner}
            onChange={handleChange}
            placeholder="Banner Image URL"
            className="w-full bg-yt-surface border border-yt-border p-3 rounded-xl outline-none text-yt-text"
          />

          {/* Security Key Section */}
          <div className="p-4 bg-yt-primary/5 border border-yt-primary/20 rounded-xl space-y-2">
            <label className="text-xs font-bold text-yt-primary flex items-center gap-1 uppercase">
              <KeyRound size={14} />
              Security Key (Required for Deletion)
            </label>

            <input
              type="password"
              name="uniqueDeleteKey"
              value={formData.uniqueDeleteKey}
              onChange={handleChange}
              placeholder="Enter a secure key"
              className="w-full bg-yt-bg border border-yt-border p-3 rounded-lg outline-none text-yt-text"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createLoading}
            className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {createLoading ? 'Creating...' : 'Launch Channel'}
          </button>
        </form>
      </div>
    </div>
  );
};


export default CreateChannel;
