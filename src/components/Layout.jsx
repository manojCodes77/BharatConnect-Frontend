import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16" role="main">
        {children}
      </main>
      <footer className="mt-12 sm:mt-16 border-t border-black/5 bg-white/70 backdrop-blur">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-[0.35rem] px-3 sm:px-[0.9rem] py-[0.3rem] sm:py-[0.35rem] rounded-full bg-[rgba(255,107,44,0.14)] text-[#d94a00] font-semibold tracking-[0.02em] uppercase text-[0.65rem] sm:text-xs mb-2">BharatConnect</span>
              <p className="text-xs sm:text-sm text-black/60 max-w-md">
                Crafted in India for creators, builders, and dreamers. Grow your professional story with a community that celebrates progress.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-black/60">
              <a href="#" className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-black/5 transition">About</a>
              <a href="#" className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-black/5 transition">Privacy</a>
              <a href="#" className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-black/5 transition">Terms</a>
              <a href="#" className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-black/5 transition">Support</a>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 text-[0.65rem] sm:text-xs text-black/40">
            © {new Date().getFullYear()} BharatConnect. Designed for momentum.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
