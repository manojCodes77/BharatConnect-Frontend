import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../utils/api';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { FaEnvelope, FaLock, FaRegLightbulb, FaUsers, FaHandshake } from 'react-icons/fa';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      dispatch(loginStart());
      const response = await signIn(formData);
      
      if (response.success) {
        dispatch(loginSuccess({ token: response.token, user: response.user }));
        navigate('/');
      } else {
        setError(response.message || 'Failed to sign in');
        dispatch(loginFailure(response.message));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to sign in';
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  const highlightItems = [
    {
      icon: FaRegLightbulb,
      title: 'Daily sparks',
  description: 'Stories, rituals, and frameworks from India\'s top operators.',
    },
    {
      icon: FaHandshake,
      title: 'Warm intros',
      description: 'Hand-raises that connect you to mentors, collaborators, and hiring partners.',
    },
    {
      icon: FaUsers,
  title: 'Built together',
  description: 'Collective momentum with accountability pods and weekly shipping circles.',
    },
  ];

  const communityStats = [
    {
      value: '56K+',
      label: 'members building in public',
    },
    {
      value: '8.2K',
      label: 'warm intros last quarter',
    },
    {
      value: '87%',
      label: 'saw faster opportunity discovery',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-orange-50 via-white to-rose-50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute bottom-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:px-12">
        <div className="grid w-full max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <aside className="relative hidden overflow-hidden rounded-[30px] border border-white/50 bg-white/85 px-12 py-14 text-slate-900 shadow-2xl shadow-orange-200/40 backdrop-blur-xl lg:block">
            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-linear-to-br from-orange-200/80 via-orange-100/40 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-linear-to-tr from-orange-100/70 via-white/40 to-transparent blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-orange-600">
                  BharatConnect
                </span>
                <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  Where India's builders accelerate together.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                  Swap learnings, surface new opportunities, and build in public with peers who understand what it takes to shape Bharat's next decade.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {highlightItems.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-white/50 bg-white/40 p-5 shadow-sm shadow-orange-100/40 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-white/60"
                  >
                    <Icon className="text-xl text-orange-500 transition group-hover:text-orange-600" />
                    <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/60 bg-white/50 p-6 shadow-sm shadow-orange-100/40">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Community pulse</p>
                <div className="mt-4 flex flex-wrap gap-6">
                  {communityStats.map((stat) => (
                    <div key={stat.label} className="min-w-[120px]">
                      <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-white/60 bg-white/95 p-6 sm:p-8 shadow-xl shadow-orange-200/50 backdrop-blur">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src="/favicon.png" 
                  alt="BharatConnect Logo" 
                  className="h-10 sm:h-12 w-auto"
                />
                <div>
                  <p className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-slate-500">Access the circle</p>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Sign in to BharatConnect</h2>
                </div>
              </div>

              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600">
                Reconnect with a community built to amplify new ideas, skills, and partnerships.
              </p>

              {error && (
                <div className="mt-5 sm:mt-6 rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-red-600" aria-live="polite">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-9 sm:px-11 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-9 sm:px-11 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-800 shadow-sm transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Enter'}
                </button>
              </form>

              <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
                New to BharatConnect?
                <Link to="/sign-up" className="ml-2 font-semibold text-orange-600 transition hover:text-orange-500">
                  Create an account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
