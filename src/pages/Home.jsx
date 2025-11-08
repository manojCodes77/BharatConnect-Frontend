import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/Layout';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { getAllPosts } from '../utils/api';
import { setPosts, appendPosts, setLoading, setError } from '../store/postsSlice';
import { FaFire, FaTrophy, FaUsers } from 'react-icons/fa';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, nextCursor, hasMore } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  // Initial fetch
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await getAllPosts(10, null);
        dispatch(setPosts(data));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        dispatch(setError(error.response?.data?.message || 'Failed to fetch posts'));
      } finally {
        setLocalLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Fetch more posts when scrolling
  const fetchMorePosts = useCallback(async () => {
    if (isFetchingMore || !hasMore || !nextCursor) return;

    try {
      setIsFetchingMore(true);
      const data = await getAllPosts(10, nextCursor);
      dispatch(appendPosts(data));
    } catch (error) {
      console.error('Failed to fetch more posts:', error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [dispatch, nextCursor, hasMore, isFetchingMore]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          fetchMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetchingMore, fetchMorePosts]);

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-10">
        <section className="grid gap-4 sm:gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_280px]">
          <aside className="order-2 space-y-4 sm:space-y-5 lg:order-1">
            <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-xs">Momentum today</span>
                <FaFire className="text-orange-500" />
              </div>
              <div className="space-y-4 text-sm">
                {[{
                  tag: '#BuildInPublic',
                  stat: 'Fresh stories from 96 makers'
                }, {
                  tag: '#WomenWhoLead',
                  stat: 'Mentorship circle live now'
                }, {
                  tag: '#TechForBharat',
                  stat: 'Product launches across 8 cities'
                }].map((topic) => (
                  <div key={topic.tag} className="rounded-2xl border border-black/5 bg-black/5 p-3">
                    <p className="text-sm font-semibold text-black">{topic.tag}</p>
                    <p className="text-xs text-black/60">{topic.stat}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-xs">Spotlight</span>
                <FaTrophy className="text-orange-500" />
              </div>
              <div className="space-y-4 text-sm text-black/70">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white font-semibold">
                    01
                  </div>
                  <div>
                    <p className="font-semibold text-black">Bharat Founders Guild</p>
                    <p className="text-xs text-black/50">Weekly huddle | Fridays 7pm IST</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                    <FaUsers />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Growing community</p>
                    <p className="text-xs text-black/50">842 new builders joined this week</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="order-1 space-y-6 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-orange-500 via-orange-400 to-orange-600 text-white shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_70%),radial-gradient(60%_60%_at_90%_20%,rgba(17,17,20,0.12)_0%,rgba(17,17,20,0)_70%)] mix-blend-screen opacity-80" />
              <div className="relative z-10 grid gap-4 sm:gap-6 px-5 sm:px-8 py-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em]">BharatConnect</span>
                  <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                    Stories, skills, and opportunities from the heart of India.
                  </h1>
                  <p className="mt-2 sm:mt-3 max-w-xl text-sm text-white/80 md:text-base">
                    Share progress, discover collaborators, and celebrate wins with a network built for India's creators and professionals.
                  </p>
                  <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
                    <button type="button" className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-[1.6rem] py-2.5 sm:py-[0.85rem] rounded-xl sm:rounded-[14px] font-bold text-white bg-gradient-to-[135deg] from-[#ff6b2c] to-[#d94a00] shadow-[0_18px_28px_rgba(255,107,44,0.26)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(255,107,44,0.3)] text-xs sm:text-sm uppercase tracking-wide">
                      Start sharing
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/25"
                    >
                      Explore sparks
                    </button>
                  </div>
                </div>
                <div className="hidden lg:flex flex-col gap-4 rounded-3xl bg-white/10 p-6 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.4rem] rounded-full font-semibold text-xs bg-white/20 text-white">DAILY SNAPSHOT</span>
                  </div>
                  <div className="space-y-2 text-white/80">
                    <p>32 founders announced roadmap updates.</p>
                    <p>11 hiring calls looking for product storytellers.</p>
                    <p>Community challenge: build a prototype in 72 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {isAuthenticated && <CreatePost />}

            {localLoading ? (
              <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
                <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/50 border-t-white"></div>
                <p className="mt-6 text-sm font-semibold text-black/60">Loading fresh perspectives...</p>
              </div>
            ) : error ? (
              <div className="bg-white border-red-200 bg-red-50/80 rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-8 text-red-700">
                <p className="text-sm font-bold">We missed a beat</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl">🪄</div>
                <h3 className="mt-6 text-xl font-semibold text-black">No stories yet</h3>
                <p className="mt-2 text-sm text-black/60">Spark the first conversation and invite others to follow.</p>
              </div>
            ) : (
              <>
                {posts.map((post) => <PostCard key={post._id} post={post} />)}
                
                {/* Infinite scroll trigger */}
                {hasMore && (
                  <div ref={observerTarget} className="py-8 text-center">
                    {isFetchingMore && (
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500/30 border-t-orange-500"></div>
                        <p className="text-sm font-semibold text-black/60">Loading more stories...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {!hasMore && posts.length > 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm font-semibold text-black/40">You've reached the end! 🎉</p>
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="order-3 hidden space-y-5 xl:block">
            <div className="bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-xs">Quick actions</span>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <a href="#" className="flex items-center justify-between rounded-2xl border border-black/5 px-4 py-3 text-black/70 transition hover:border-orange-400/50 hover:bg-orange-500/5">
                  <span>Introduce yourself</span>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">2 min</span>
                </a>
                <a href="#" className="flex items-center justify-between rounded-2xl border border-black/5 px-4 py-3 text-black/70 transition hover:border-orange-400/50 hover:bg-orange-500/5">
                  <span>Community guidelines</span>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">Read</span>
                </a>
                <a href="#" className="flex items-center justify-between rounded-2xl border border-black/5 px-4 py-3 text-black/70 transition hover:border-orange-400/50 hover:bg-orange-500/5">
                  <span>Partner with us</span>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">Form</span>
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white border border-black/[0.08] rounded-[18px] shadow-[0_18px_36px_rgba(17,17,20,0.08)] p-6 after:content-[''] after:absolute after:inset-[-60%] after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,44,0.18),rgba(255,107,44,0))] after:opacity-70 after:pointer-events-none">
              <h3 className="relative z-10 text-lg font-semibold text-black">Premium circles</h3>
              <p className="relative z-10 mt-2 text-sm text-black/60">Unlock private cohorts, limited mentorship, and curated hiring boards.</p>
              <button className="relative z-10 mt-5 w-full rounded-full bg-black text-sm font-semibold text-white py-3 transition hover:-translate-y-0.5 hover:bg-black/90">
                Unlock access
              </button>
            </div>
          </aside>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
