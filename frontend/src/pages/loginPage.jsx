import React, { useEffect } from 'react';

import useFetch from "../hooks/useFetch";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SuccesToastMessage from '../components/SuccesToastMessage';

/*
  Login Page
  - Validates form
  - Uses useFetch to authenticate
  - Stores token in localStorage
  - Syncs Redux auth state
*/
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toastError, setToastError] = useState(null);
  const [triggerPath, setTriggerPath] = useState(null);

  // API call (fires only when triggerPath !== null)
  const { data, loading, error } = useFetch(
    triggerPath,
    "POST",
    formData
  );

  // Handle API response
  useEffect(() => {
  if (!data && !error) return;

  if (data) {
    localStorage.setItem("token", data.token);
    dispatch(setAuth({ user: data.user, token: data.token }));

    // defer state update to avoid cascading render warning
    queueMicrotask(() => setTriggerPath(null));

    navigate("/", { replace: true });
  }

  if (error) {
    queueMicrotask(() => setToastError(error));
    queueMicrotask(() => setTriggerPath(null));
  }
  }, [data, error, dispatch, navigate]);


  const validateLogin = () => {
    const { email, password } = formData;

    if (!email || !password)
      return "Email and password are required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "Invalid email format.";

    return null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (toastError) setToastError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateLogin();
    if (validationError) {
      setToastError(validationError);
      return;
    }

    setTriggerPath("/user/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-bg px-4">
      <div className="max-w-md w-full space-y-8 bg-yt-surface p-8 rounded-xl border border-yt-border shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-yt-text">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-yt-muted">
            to continue to WeeTube
          </p>
        </div>

        {/* Error Toast */}
        {toastError && (
          <div className="flex justify-center">
            <SuccesToastMessage
              type="error"
              message={toastError}
              onClose={() => setToastError(null)}
            />
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Email */}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-yt-border text-yt-text bg-yt-bg rounded-md focus:ring-2 focus:ring-yt-primary focus:outline-none"
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-yt-border text-yt-text bg-yt-bg rounded-md focus:ring-2 focus:ring-yt-primary focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-yt-muted hover:text-yt-text"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-medium text-white bg-yt-primary hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Next"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-yt-muted">
          <Link
            to="/register"
            className="text-yt-accent hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
