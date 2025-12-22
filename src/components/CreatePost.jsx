import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createPost, getAllPosts } from '../utils/api';
import { setPosts, addPost } from '../store/postsSlice';
import { FaImage, FaVideo, FaCalendar, FaPen, FaTimes } from 'react-icons/fa';

const CreatePost = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const quickActions = useMemo(
    () => [
      { icon: <FaImage className="text-orange-500" />, label: 'Add visuals' },
      { icon: <FaVideo className="text-black/60" />, label: 'Record snippet' },
      { icon: <FaCalendar className="text-black/60" />, label: 'Plan a session' },
    ],
    []
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      toast.warning('You can only upload up to 5 images');
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      
      // Append images if any
      selectedImages.forEach((image) => {
        submitData.append('images', image);
      });

      const response = await createPost(submitData);

      if (response.success) {
        // Add the new post to myPosts
        dispatch(addPost(response.post));
        toast.success('Post published successfully!');
        setFormData({ title: '', content: '' });
        setSelectedImages([]);
        setImagePreviews([]);
        setShowForm(false);
      } else {
        toast.error(response.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-black/8 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6">
      {!showForm ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-black/60">Hey builder, what moved you today?</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 inline-flex items-center gap-3 rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-left text-black/70 transition hover:border-orange-400/60 hover:bg-orange-500/5"
              >
                <span className="rounded-full bg-orange-500/10 p-2 text-orange-500">
                  <FaPen />
                </span>
                <span className="text-sm font-semibold">Share a win, a lesson, or a question with BharatConnect.</span>
              </button>
            </div>
            <span className="hidden rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-600 md:inline-flex">New</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 transition hover:border-orange-400/60 hover:bg-orange-500/5 hover:text-black"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your update a headline"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-lg font-semibold text-black/80 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Tell your story. What made progress? What help do you need?"
              rows="5"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
            ></textarea>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border border-black/10"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {/* Image Upload Button */}
              <label className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 transition hover:border-orange-400/60 hover:bg-orange-500/5 hover:text-black cursor-pointer">
                <FaImage className="text-orange-500" />
                <span>Add visuals</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={selectedImages.length >= 5}
                />
              </label>
              {quickActions.slice(1).map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 transition hover:border-orange-400/60 hover:bg-orange-500/5 hover:text-black"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '' });
                  setSelectedImages([]);
                  setImagePreviews([]);
                  setError('');
                }}
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90 disabled:translate-y-0 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish story'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
