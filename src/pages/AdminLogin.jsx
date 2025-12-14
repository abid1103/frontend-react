import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminApi";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      setIsLoading(false);
      navigate("/AdminDashboard");
    } catch (err) {
      setIsLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
     <div className="w-full" style={{ maxWidth: "600px" }}>


        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-blue-100">BrandInsight Management System</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={login}>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="admin@brandinsight.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                For security reasons, please ensure you're accessing this portal from an authorized network
              </p>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        </div>

        {/* Back to Landing Page Button */}
        <button
          onClick={() => {window.location.href = "/";}}
          className="fixed bottom-6 left-6 flex items-center gap-2 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Website
        </button>

      </div>

      <style jsx>{`
        .min-h-screen {
          min-height: 100vh;
        }
        .bg-gradient-to-br {
          background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
        }
        .from-gray-50 {
          --tw-gradient-from: #f9fafb;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(249, 250, 251, 0));
        }
        .to-gray-100 {
          --tw-gradient-to: #f3f4f6;
        }
        .flex {
          display: flex;
        }
        .items-center {
          align-items: center;
        }
        .justify-center {
          justify-content: center;
        }
        .p-4 {
          padding: 1rem;
        }
        .w-full {
          width: 100%;
        }
        .max-w-md {
          max-width: 28rem;
        }
        .bg-white {
          background-color: #ffffff;
        }
        .rounded-2xl {
          border-radius: 1rem;
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .overflow-hidden {
          overflow: hidden;
        }
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .from-blue-600 {
          --tw-gradient-from: #2563eb;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
        }
        .to-indigo-700 {
          --tw-gradient-to: #4338ca;
        }
        .p-8 {
          padding: 2rem;
        }
        .text-center {
          text-align: center;
        }
        .inline-flex {
          display: inline-flex;
        }
        .w-16 {
          width: 4rem;
        }
        .h-16 {
          height: 4rem;
        }
        .bg-white\/10 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .rounded-2xl {
          border-radius: 1rem;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .w-8 {
          width: 2rem;
        }
        .h-8 {
          height: 2rem;
        }
        .text-white {
          color: #ffffff;
        }
        .text-3xl {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .text-blue-100 {
          color: #dbeafe;
        }
        .text-2xl {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        .text-gray-800 {
          color: #1f2937;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .mb-8 {
          margin-bottom: 2rem;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .bg-red-50 {
          background-color: #fef2f2;
        }
        .border-red-200 {
          border-color: #fecaca;
        }
        .rounded-xl {
          border-radius: 0.75rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .items-center {
          align-items: center;
        }
        .mr-2 {
          margin-right: 0.5rem;
        }
        .text-red-500 {
          color: #ef4444;
        }
        .text-red-700 {
          color: #b91c1c;
        }
        .font-medium {
          font-weight: 500;
        }
        .block {
          display: block;
        }
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        .text-gray-700 {
          color: #374151;
        }
        .relative {
          position: relative;
        }
        .absolute {
          position: absolute;
        }
        .inset-y-0 {
          top: 0;
          bottom: 0;
        }
        .left-0 {
          left: 0;
        }
        .pl-3 {
          padding-left: 0.75rem;
        }
        .pointer-events-none {
          pointer-events: none;
        }
        .w-5 {
          width: 1.25rem;
        }
        .h-5 {
          height: 1.25rem;
        }
        .text-gray-400 {
          color: #9ca3af;
        }
        .w-full {
          width: 100%;
        }
        .pl-10 {
          padding-left: 2.5rem;
        }
        .pr-4 {
          padding-right: 1rem;
        }
        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        .border {
          border-width: 1px;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
        .focus\:ring-2:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        .focus\:ring-blue-500:focus {
          --tw-ring-color: #3b82f6;
        }
        .focus\:border-blue-500:focus {
          border-color: #3b82f6;
        }
        .transition-colors {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .duration-200 {
          transition-duration: 200ms;
        }
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .from-blue-600 {
          --tw-gradient-from: #2563eb;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
        }
        .to-indigo-700 {
          --tw-gradient-to: #4338ca;
        }
        .font-semibold {
          font-weight: 600;
        }
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .hover\:from-blue-700:hover {
          --tw-gradient-from: #1d4ed8;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(29, 78, 216, 0));
        }
        .hover\:to-indigo-800:hover {
          --tw-gradient-to: #3730a3;
        }
        .focus\:outline-none:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        .focus\:ring-2:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        .focus\:ring-offset-2:focus {
          --tw-ring-offset-width: 2px;
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .disabled\:opacity-70:disabled {
          opacity: 0.7;
        }
        .disabled\:cursor-not-allowed:disabled {
          cursor: not-allowed;
        }
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .hover\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .-ml-1 {
          margin-left: -0.25rem;
        }
        .mr-3 {
          margin-right: 0.75rem;
        }
        .mt-8 {
          margin-top: 2rem;
        }
        .pt-6 {
          padding-top: 1.5rem;
        }
        .border-t {
          border-top-width: 1px;
        }
        .border-gray-200 {
          border-color: #e5e7eb;
        }
        .absolute {
          position: absolute;
        }
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .-z-10 {
          z-index: -10;
        }
        .overflow-hidden {
          overflow: hidden;
        }
        .-top-40 {
          top: -10rem;
        }
        .-right-40 {
          right: -10rem;
        }
        .w-80 {
          width: 20rem;
        }
        .h-80 {
          height: 20rem;
        }
        .bg-blue-500 {
          background-color: #3b82f6;
        }
        .rounded-full {
          border-radius: 9999px;
        }
        .mix-blend-multiply {
          mix-blend-mode: multiply;
        }
        .filter {
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
        }
        .blur-3xl {
          --tw-blur: blur(64px);
        }
        .opacity-10 {
          opacity: 0.1;
        }
        .-bottom-40 {
          bottom: -10rem;
        }
        .-left-40 {
          left: -10rem;
        }
        .bg-indigo-500 {
          background-color: #6366f1;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
