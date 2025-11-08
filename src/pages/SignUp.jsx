import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../utils/api';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await signUp(formData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      } else {
        setError(response.message || 'Failed to sign up');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to sign up';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-[1120px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="bg-[rgba(255,255,255,0.92)] border border-[rgba(17,17,20,0.06)] rounded-[22px] shadow-[0_22px_44px_rgba(17,17,20,0.12)] mx-auto max-w-lg p-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10">
              <svg className="h-10 w-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-black">You are in!</h2>
            <p className="mt-3 text-sm text-black/60">We are getting your space ready. Redirecting you to sign in...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1120px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
        <div className="hidden rounded-3xl border border-black/10 bg-white/70 p-10 backdrop-blur-sm shadow-xl shadow-black/10 lg:block">
          <span className="inline-flex items-center gap-[0.35rem] px-[0.9rem] py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-xs">Why join</span>
          <h1 className="mt-6 text-4xl font-extrabold text-black leading-tight">
            Craft your BharatConnect profile and share the journey from idea to impact.
          </h1>
          <div className="mt-8 grid gap-5 text-sm text-black/70">
            <div>
              <p className="font-semibold text-black">1. Build in community</p>
              <p className="text-black/60">Document wins, experiments, and open questions with peers who understand the hustle.</p>
            </div>
            <div>
              <p className="font-semibold text-black">2. Unlock opportunities</p>
              <p className="text-black/60">Unlock curated circles, job boards, and mentorship designed for India's talent.</p>
            </div>
            <div>
              <p className="font-semibold text-black">3. Stay inspired</p>
              <p className="text-black/60">Weekly rituals, AMAs, and challenges to keep your momentum high.</p>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.92)] border border-[rgba(17,17,20,0.06)] rounded-[22px] shadow-[0_22px_44px_rgba(17,17,20,0.12)] relative overflow-hidden p-8">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-500/10" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <img 
                src="/favicon.png" 
                alt="BharatConnect Logo" 
                className="h-12 w-auto"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">Create your profile</p>
                <h2 className="text-2xl font-extrabold text-black">Join BharatConnect</h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-black/60">Let us know who you are so we can tailor the experience to your goals.</p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
                  Full name
                </label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-white px-11 py-3 text-sm font-semibold text-black/80 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
                  Email address
                </label>
                <div className="relative">
                  <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-white px-11 py-3 text-sm font-semibold text-black/80 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-black/40">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-black/10 bg-white px-11 py-3 text-sm font-semibold text-black/80 transition focus:border-orange-400 focus:shadow-[0_0_0_4px_rgba(255,107,44,0.18)]"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Join now'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-black/60">
              Already on BharatConnect?
              <Link to="/sign-in" className="ml-2 font-semibold text-orange-600 transition hover:text-orange-500">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
