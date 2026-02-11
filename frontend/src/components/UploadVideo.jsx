import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFetch from '../hooks/useFetch'
import { updateUser } from '../store/authSlice';
import { Upload, Film, ArrowLeft } from 'lucide-react';
import SuccesToastMessage from '../components/SuccesToastMessage'

const UploadVideo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: ''
  });

  const [toast, setToast] = useState(null);

  // Memoized headers for stable fetch
  const headers = useMemo(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  // Hook for Video Creation (POST)
  const [createTrigger, setCreateTrigger] = useState(null);
  const { data: createResponse, loading: createLoading, error: createError } = useFetch(
    createTrigger, 'POST', formData, headers
  );

  // Hook for Refreshing User Data (GET)
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const { data: refreshedUser, error: refreshError } = useFetch(refreshTrigger, 'GET', null, headers);

  // Handle POST response
  useEffect(() => {
    if (createResponse) {
      setRefreshTrigger('/api/auth/me'); // Refresh user data
    }
    if (createError) {
      setToast({
        type: 'error',
        title: 'Error',
        message: createError.response?.data?.message || 'Failed to upload video.'
      });
      setCreateTrigger(null); // Reset trigger to allow retry
    }
  }, [createResponse, createError]);

  // Handle user refresh and redirect
  useEffect(() => {
    if (refreshedUser) {
      dispatch(updateUser(refreshedUser));
      setToast({ type: 'success', title: 'Success', message: 'Video published! Redirecting...' });
      setTimeout(() => navigate(-1), 1500);
    }
    if (refreshError) {
      setToast({
        type: 'error',
        title: 'Sync Error',
        message: 'Video created but failed to sync user data.'
      });
    }
  }, [refreshedUser, refreshError, dispatch, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl) {
      return setToast({ type: 'error', title: 'Validation Error', message: 'Missing required fields.' });
    }

    setCreateTrigger('/api/videos'); // Trigger POST
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 transition-colors duration-300">
      {toast && <SuccesToastMessage type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-4 sm:mb-6 transition-colors font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-yt-text">
            <Upload className="text-yt-primary" size={20} /> 
            <span className="hidden sm:inline">Create New Video</span>
            <span className="sm:hidden">New Video</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/** Title */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-yt-muted uppercase ml-1">Title*</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's your video about?"
                  className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-yt-text text-sm sm:text-base focus:border-yt-primary transition-colors"
                />
              </div>

              {/** Description */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-yt-muted uppercase ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell viewers about your video"
                  className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl h-24 sm:h-32 outline-none text-yt-text text-sm sm:text-base transition-colors resize-none"
                />
              </div>

              {/** Video URL */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-yt-muted uppercase ml-1">Video URL*</label>
                <input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-yt-text text-sm sm:text-base transition-colors"
                />
              </div>

              {/** Thumbnail URL */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-yt-muted uppercase ml-1">Thumbnail URL*</label>
                <input
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-yt-text text-sm sm:text-base transition-colors"
                />
              </div>

              {/** Category */}
              <div className="space-y-1 sm:space-y-2">
                <label className="text-xs font-bold text-yt-muted uppercase ml-1">Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Gaming, Music, Education"
                  className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-yt-text text-sm sm:text-base transition-colors"
                />
              </div>

              {/** Submit */}
              <button
                type="submit"
                disabled={createLoading}
                className="w-full bg-yt-primary text-white font-bold sm:font-black py-3 sm:py-4 rounded-lg sm:rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide sm:tracking-widest shadow-lg shadow-yt-primary/20 text-sm sm:text-base disabled:opacity-50"
              >
                {createLoading ? "Publishing..." : "Publish Video"}
              </button>
            </form>

            {/* Preview */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs font-bold text-yt-muted uppercase">Preview</p>

              {/* Video preview */}
              <div className="aspect-video bg-black rounded-lg sm:rounded-2xl overflow-hidden border border-yt-border flex items-center justify-center">
                {formData.videoUrl ? (
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<div class="flex items-center justify-center w-full h-full text-yt-muted text-xs">Invalid video URL</div>';
                    }}
                  />
                ) : (
                  <Film className="text-yt-muted" size={32} />
                )}
              </div>

              {/* Thumbnail + title preview */}
              <div className="p-3 sm:p-4 bg-yt-bg rounded-lg sm:rounded-xl border border-yt-border flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yt-surface flex-shrink-0 overflow-hidden border border-yt-border flex items-center justify-center">
                  {formData.thumbnailUrl ? (
                    <img
                      src={formData.thumbnailUrl}
                      className="w-full h-full object-cover"
                      alt="preview"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                  ) : (
                    <Film size={16} className="text-yt-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-yt-text line-clamp-2 text-sm sm:text-base">
                    {formData.title || "Untitled Video"}
                  </h4>
                  <p className="text-yt-muted text-xs uppercase font-bold mt-1">
                    {formData.category || "General"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UploadVideo;
