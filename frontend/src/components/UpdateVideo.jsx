import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { updateUser } from '../store/authSlice';
import SuccesToastMessage from './SuccesToastMessage';
import { Edit3, ArrowLeft, Film } from 'lucide-react';


const UpdateVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  // Video passed via state
  const videoData = location.state?.video;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: ''
  });

  // Redirect if accessed without video
  useEffect(() => {
    if (!videoData) navigate(-1);
    else setFormData({
      title: videoData.title || '',
      description: videoData.description || '',
      videoUrl: videoData.videoUrl || '',
      thumbnailUrl: videoData.thumbnailUrl || '',
      category: videoData.category || ''
    });
  }, [videoData, navigate]);

  // Stable headers
  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Update Video PUT
  const [updateTrigger, setUpdateTrigger] = useState(null);
  const { data: updateResp, loading: updateLoading, error: updateError } = useFetch(
    updateTrigger, 'PUT', formData, headers
  );

  // Refresh user GET to sync Redux
  const [refreshTrigger, setRefreshTrigger] = useState(null);
  const { data: refreshedUser, error: refreshError } = useFetch(
    refreshTrigger, 'GET', null, headers
  );

  // Step 1: handle PUT success/error
  useEffect(() => {
    if (updateResp) setRefreshTrigger(`/api/auth/me?t=${Date.now()}`);
    if (updateError) {
      setToast({
        type: 'error',
        title: 'Update Error',
        message: updateError.response?.data?.message || 'Failed to update video.'
      });
      setUpdateTrigger(null);
    }
  }, [updateResp, updateError]);

  // Step 2: handle user refresh
  useEffect(() => {
    if (refreshedUser) {
      dispatch(updateUser(refreshedUser));
      setToast({ type: 'success', title: 'Updated', message: 'Video updated successfully!' });
      setTimeout(() => navigate(-1), 1500);
    }
    if (refreshError) {
      setToast({
        type: 'error',
        title: 'Sync Error',
        message: refreshError.response?.data?.message || 'Profile fetch error.'
      });
    }
  }, [refreshedUser, refreshError, dispatch, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl) {
      return setToast({ type: 'error', title: 'Validation Error', message: 'Missing required fields.' });
    }

    setUpdateTrigger(`/api/videos/${videoData._id}`);
  };

  return (
    <div className="bg-yt-bg min-h-screen p-3 sm:p-6 transition-colors duration-300">
      {toast && <SuccesToastMessage {...toast} onClose={() => setToast(null)} />}
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-yt-muted hover:text-yt-text mb-6 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-yt-surface border border-yt-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2 text-yt-text">
            <Edit3 className="text-yt-primary" size={20} /> Edit Video
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {[
                { label: 'Title*', name: 'title', placeholder: "What's your video about?" },
                { label: 'Description', name: 'description', placeholder: "Tell viewers about your video", textarea: true },
                { label: 'Video URL*', name: 'videoUrl', placeholder: 'https://example.com/video.mp4' },
                { label: 'Thumbnail URL*', name: 'thumbnailUrl', placeholder: 'https://example.com/thumbnail.jpg' },
                { label: 'Category', name: 'category', placeholder: 'Gaming, Music, Education' }
              ].map(field => (
                <div key={field.name} className="space-y-1 sm:space-y-2">
                  <label className="text-xs font-bold text-yt-muted uppercase ml-1">{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl h-24 sm:h-32 outline-none text-yt-text text-sm sm:text-base transition-colors resize-none"
                    />
                  ) : (
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-yt-bg border border-yt-border p-2.5 sm:p-3 rounded-lg sm:rounded-xl outline-none text-yt-text text-sm sm:text-base transition-colors"
                    />
                  )}
                </div>
              ))}

              <button 
                type="submit" 
                disabled={updateLoading}
                className="w-full bg-yt-text text-yt-bg font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl hover:opacity-90 active:scale-[0.98] transition-all uppercase tracking-wide shadow-lg disabled:opacity-50"
              >
                {updateLoading ? 'Updating...' : 'Update Video'}
              </button>
            </form>

            {/* Preview */}
            <div className="space-y-4 sm:space-y-5">
              <p className="text-xs font-bold text-yt-muted uppercase">Preview</p>
              <div className="aspect-video bg-black rounded-lg sm:rounded-2xl overflow-hidden border border-yt-border flex items-center justify-center">
                {formData.videoUrl ? (
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full h-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full text-yt-muted text-xs">Invalid video URL</div>';
                    }}
                  />
                ) : <Film className="text-yt-muted" size={32} />}
              </div>

              <div className="p-3 sm:p-4 bg-yt-bg rounded-lg sm:rounded-xl border border-yt-border flex gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-full bg-yt-surface flex-shrink-0 overflow-hidden border border-yt-border flex items-center justify-center">
                  {formData.thumbnailUrl ? (
                    <img src={formData.thumbnailUrl} alt="thumbnail preview" className="w-full h-full object-cover" />
                  ) : <Film size={16} className="text-yt-muted" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-yt-text line-clamp-2 text-sm sm:text-base">{formData.title || 'Untitled Video'}</h4>
                  <p className="text-yt-muted text-xs uppercase font-bold mt-1">{formData.category || 'General'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UpdateVideo;
