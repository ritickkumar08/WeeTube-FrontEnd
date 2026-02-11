import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import SuccesToastMessage from '../components/SuccesToastMessage';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
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
    if (data) {
      // Reset trigger before redirect
      setTriggerPath(null);

      navigate("/login");
    }

    if (error) {
      setToastError({
        title: "Registration Failed",
        msg: error, // already normalized string
      });

      setTriggerPath(null);
    }
  }, [data, error, navigate]);

  const validate = () => {
    const { username, email, password } = formData;

    if (!username || !email || !password)
      return "All fields are required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "Invalid email format.";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

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

    const validationError = validate();
    if (validationError) {
      setToastError({
        title: "Validation Error",
        msg: validationError,
      });
      return;
    }

    setTriggerPath("/user/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yt-bg px-4">
      <div className="max-w-md w-full space-y-8 bg-yt-surface p-8 rounded-xl border border-yt-border shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-yt-text">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-yt-muted">
            Join WeeTube and start sharing
          </p>
        </div>

        {/* Error Toast */}
        {toastError && (
          <div className="flex justify-center">
            <SuccesToastMessage
              type="error"
              title={toastError.title}
              message={toastError.msg}
              onClose={() => setToastError(null)}
            />
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Username */}
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-3 border border-yt-border text-yt-text bg-yt-bg rounded-md focus:ring-2 focus:ring-yt-primary focus:outline-none"
            />

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
                autoComplete="new-password"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-yt-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yt-accent hover:underline text-green-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;
