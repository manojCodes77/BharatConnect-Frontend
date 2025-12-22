import { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { setError, setLoading, setSavedPosts } from '../store/postsSlice';
import { getAllSavedPosts } from '../utils/api';

const SavedPosts = () => {
  const dispatch = useDispatch();
  const { savedPosts } = useSelector((state) => state.posts);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setLocalError] = useState('');

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getAllSavedPosts();
        // Ensure data is an array
        const postsArray = Array.isArray(data) ? data : [];
        dispatch(setSavedPosts(postsArray));
      } catch (error) {
        console.error('Failed to fetch saved posts:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch saved posts';
        setLocalError(errorMessage);
        dispatch(setError(errorMessage));
      } finally {
        setLocalLoading(false);
      }
    };

    fetchSavedPosts();
  }, [dispatch]);

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-10">
        <section className="bg-white border border-black/8 rounded-2xl sm:rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-[0.35rem] px-3 sm:px-[0.9rem] py-[0.3rem] sm:py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-[0.65rem] sm:text-xs">
                <FaBookmark className="text-[0.6rem] sm:text-xs" />
                Saved
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-black">Your Saved Posts</h2>
              <p className="text-xs sm:text-sm text-black/60">All the posts you've bookmarked for later reference.</p>
            </div>
            <div className="flex gap-2 self-start md:self-auto">
              <div className="rounded-full border border-black/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-black/60">
                {savedPosts?.length || 0} Saved
              </div>
            </div>
          </div>
        </section>

        {localLoading ? (
          <div className="bg-white border border-black/8 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-black/10 border-t-orange-500"></div>
            <p className="mt-4 text-sm font-semibold text-black/60">Loading your saved posts...</p>
          </div>
        ) : error ? (
          <div className=" border border-red-200 bg-red-50/80 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-8 text-red-700">
            <p className="text-sm font-bold">We could not load your saved posts</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : !savedPosts || savedPosts.length === 0 ? (
          <div className="bg-white border border-black/8 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-4xl">
              <FaBookmark className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">No saved posts yet</h3>
            <p className="mt-2 text-sm text-black/60">Save posts to easily find them later. Click the bookmark icon on any post to save it.</p>
            <button
              onClick={() => window.location.replace('/')}
              className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90"
            >
              Explore Posts
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {savedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedPosts;
