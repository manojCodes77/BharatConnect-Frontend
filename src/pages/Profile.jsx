import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { getMyPosts } from '../utils/api';
import { setMyPosts, setLoading, setError } from '../store/postsSlice';
import { FaEdit, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const { myPosts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setLocalError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getMyPosts();
        dispatch(setMyPosts(data));
      } catch (error) {
        console.error('Failed to fetch my posts:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch posts';
        setLocalError(errorMessage);
        dispatch(setError(errorMessage));
      } finally {
        setLocalLoading(false);
      }
    };

    fetchMyPosts();
  }, [dispatch]);

  const userName = user?.name || 'User';

  return (
    <Layout>
      <div className="space-y-10">
        <section className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] overflow-hidden">
          <div className="relative">
            <div className="h-40 bg-linear-to-br from-black via-black/90 to-black/80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,44,0.4),transparent_60%)]" />
          </div>
          <div className="px-6 pb-8">
            <div className="-mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-linear-to-br from-orange-400 to-orange-600 text-5xl font-bold text-white shadow-xl shadow-orange-500/25">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-400" />
                </div>
                <div className="relative z-10 pb-4 bg-white px-4 py-2 rounded-2xl shadow-sm">
                  <h1 className="text-3xl font-extrabold text-black">{userName}</h1>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">Building in public</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90">
                <FaEdit />
                <span>Edit profile</span>
              </button>
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl border border-black/10 bg-white/60 p-6 backdrop-blur">
              <div className="grid gap-4 text-center sm:grid-cols-3">
                <div>
                  <p className="text-3xl font-bold text-orange-600">{myPosts.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">Stories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">245</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">Connections</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">1.2K</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">Profile views</p>
                </div>
              </div>

              <div className="grid gap-4 text-sm text-black/70 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                    <FaBriefcase />
                  </span>
                  <span>Open to interesting opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                    <FaMapMarkerAlt />
                  </span>
                  <span>Based in India</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                    <FaGraduationCap />
                  </span>
                  <span>Lifelong learner & mentor</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-xs">Your narrative</span>
              <h2 className="mt-2 text-2xl font-bold text-black">Stories you have shared</h2>
              <p className="text-sm text-black/60">Keep momentum alive by documenting wins, lessons, and experiments.</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5">
                All
              </button>
              <button className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5">
                Highlighted
              </button>
            </div>
          </div>
        </section>

        {localLoading ? (
          <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-black/10 border-t-orange-500"></div>
            <p className="mt-4 text-sm font-semibold text-black/60">Gathering your updates...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 bg-red-50/80 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-8 text-red-700">
            <p className="text-sm font-bold">We could not load your timeline</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : myPosts.length === 0 ? (
          <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-4xl">✍️</div>
            <h3 className="text-xl font-semibold text-black">No stories yet</h3>
            <p className="mt-2 text-sm text-black/60">Share your journey to inspire collaborators across BharatConnect.</p>
            <button
              onClick={() => window.location.replace('/')}
              className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90"
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myPosts.map((post) => <PostCard key={post._id} post={post} isMyPost={true} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
