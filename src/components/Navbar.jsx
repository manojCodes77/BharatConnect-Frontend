import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes, FaBookmark } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 flex h-16 md:h-20 items-center justify-between gap-2">
        <Link to="/" className="group flex items-center gap-2 sm:gap-3 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/favicon.png"
            alt="BharatConnect"
            className="h-8 sm:h-10 w-auto transition-transform group-hover:-translate-y-1"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-extrabold text-black tracking-tight">
              BharatConnect
            </span>
            <span className="hidden sm:inline text-xs uppercase font-semibold tracking-[0.3em] text-black/50">
              Rise Together
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-1 py-1 shadow-sm">
            <>
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive("/")
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:bg-black/5"
                  }`}
              >
                <FaHome className="text-base" />
                <span>Pulse</span>
              </Link>
              <Link
                to="/saved"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive("/saved")
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:bg-black/5"
                  }`}
              >
                <FaBookmark className="text-base" />
                <span>Saved</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isActive("/profile")
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:bg-black/5"
                  }`}
              >
                <FaUser className="text-base" />
                <span>Profile</span>
              </Link>
            </>
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black"
              >
                <span className="hidden sm:inline">My Space</span>
                <span className="sm:hidden"><FaUser /></span>
                <span className="hidden lg:inline text-xs uppercase tracking-[0.2em] text-white/70">
                  Live
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 sm:px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
              >
                <FaSignOutAlt className="text-base" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 sm:px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
              >
                <span>Sign Up</span>
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-black/90 px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black"
              >
                <span>Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-black/70 hover:bg-black/5 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur">
          <div className="max-w-[1120px] mx-auto px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive("/")
                      ? "bg-black text-white shadow-md"
                      : "text-black/60 hover:bg-black/5"
                    }`}
                >
                  <FaHome className="text-base" />
                  <span>Pulse</span>
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive("/saved")
                      ? "bg-black text-white shadow-md"
                      : "text-black/60 hover:bg-black/5"
                    }`}
                >
                  <FaBookmark className="text-base" />
                  <span>Saved Posts</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive("/profile")
                      ? "bg-black text-white shadow-md"
                      : "text-black/60 hover:bg-black/5"
                    }`}
                >
                  <FaUser className="text-base" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-2xl border border-black/15 px-4 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/5"
                >
                  <FaSignOutAlt className="text-base" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-black/15 px-4 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/5"
                >
                  <span>Sign Up</span>
                </Link>
                <Link
                  to="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black/90 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-black"
                >
                  <span>Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
