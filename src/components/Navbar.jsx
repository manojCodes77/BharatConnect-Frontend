import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="max-w-[1120px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] flex h-16 md:h-20 items-center justify-between gap-3">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="BharatConnect"
            className="h-10 w-auto transition-transform group-hover:-translate-y-1"
          />
          <div className="hidden flex-col md:flex">
            <span className="text-xl font-extrabold text-black tracking-tight">
              BharatConnect
            </span>
            <span className="text-xs uppercase font-semibold tracking-[0.3em] text-black/50">
              Rise Together
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/70 px-1 py-1 shadow-sm md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive("/")
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:bg-black/5"
                }`}
              >
                <FaHome className="text-base" />
                <span>Pulse</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive("/profile")
                    ? "bg-black text-white shadow-md"
                    : "text-black/60 hover:bg-black/5"
                }`}
              >
                <FaUser className="text-base" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black"
              >
                <span>My Space</span>
                <span className="hidden text-xs uppercase tracking-[0.2em] text-white/70 md:inline">
                  Live
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
              >
                <FaSignOutAlt className="text-base" />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
              >
                <span>Sign Up</span>
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black"
              >
                <span>Login</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
