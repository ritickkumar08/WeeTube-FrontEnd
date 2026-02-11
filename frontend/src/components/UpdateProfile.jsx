import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { updateUser } from '../store/authSlice';
import SuccessToastMessage from '../components/SuccesToastMessage'
import { UserPen, Mail, AtSign, ArrowLeft, Image as ImageIcon } from 'lucide-react';


const UpdateProfile = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  // Local form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  // Sync form when user loads or updates
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  // Memoized headers (stable reference for hook)
  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Trigger-based API call
  const [triggerPath, setTriggerPath] = useState(null);

  const { data, loading, error } = useFetch(
    triggerPath,
    'PUT',
    formData,
    headers
  );

  // Handle API lifecycle
  useEffect(() => {
    if (data?.user) {
      dispatch(updateUser(data.user)); // Update global state immediately

      setToast({
        type: "success",
        title: "Success",
        message: "Profile updated successfully!"
      });

      setTriggerPath(null); // Reset trigger

      setTimeout(() => navigate(-1), 1200);
    }

    if (error) {
      setToast({
        type: "error",
        title: "Update Error",
        message: error.response?.data?.message || "Failed to update profile."
      });

      setTriggerPath(null); // Allow retry
    }
  }, [data, error, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent empty submission
    if (!formData.username.trim() || !formData.email.trim()) {
      setToast({
        type: "error",
        title: "Invalid Input",
        message: "Username and email are required."
      });
      return;
    }

    // Prevent unnecessary API call if nothing changed
    if (
      user &&
      formData.username === user.username &&
      formData.email === user.email &&
      formData.avatar === user.avatar
    ) {
      navigate(-1);
      return;
    }

    setTriggerPath('/api/auth/update');
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 md:p-8 transition-colors duration-300">
      {toast && (
        <SuccessToastMessage
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-6 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-2xl p-6 md:p-10 shadow-2xl">

          <h2 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3 text-yt-text">
            <UserPen className="text-yt-primary" size={20} />
            Profile Settings
          </h2>

          {/* Avatar Preview */}
          <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="relative group">
              <img
                src={formData.avatar || 'https://via.placeholder.com/150'}
                alt="Avatar Preview"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-yt-bg object-cover shadow-xl transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white font-black uppercase">
                  Preview
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-yt-text font-bold text-lg">
                {formData.username || "Username"}
              </p>
              <p className="text-yt-muted text-sm">
                {formData.email || "email@example.com"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <AtSign size={12} /> Display Name
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl outline-none focus:border-yt-primary text-yt-text font-medium transition-colors"
                placeholder="How should we call you?"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl outline-none focus:border-yt-primary text-yt-text font-medium transition-colors"
                placeholder="yourname@example.com"
              />
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yt-muted uppercase ml-1 flex items-center gap-2">
                <ImageIcon size={12} /> Avatar Image URL
              </label>
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full bg-yt-bg border border-yt-border p-4 rounded-xl outline-none focus:border-yt-primary text-yt-text font-medium transition-colors"
                placeholder="https://images.com/my-photo.png"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yt-text text-yt-bg font-bold py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide shadow-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
