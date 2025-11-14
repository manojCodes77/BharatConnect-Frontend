import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Listen for authentication errors (token expiration)
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/sign-in"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/sign-up"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
