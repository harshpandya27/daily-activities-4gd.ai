"use client";
import React from "react";

const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Left Section with Login Form */}
      <div className="flex items-center justify-start w-1/2 px-10">
        <div className="z-10 w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative">
          <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-gray-500 text-center mb-8">
            Login to access your account
          </p>
          <form>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            {/* Forgot Password */}
            <div className="text-right mb-6">
              <a
                href="#"
                className="text-blue-500 hover:underline text-sm font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg hover:opacity-90 transition duration-300 font-semibold shadow-md"
            >
              Login
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Sign in with Google */}
          <button
            className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 font-medium shadow-md"
          >
            <img
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F7123025%2Flogo_google_g_icon&psig=AOvVaw24-h4HoVKnVU_D8o-6-Jbx&ust=1734541354531000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjdxp2kr4oDFQAAAAAdAAAAABAE"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Right Portion with Dark Blue Background and Shapes */}
      <div className="absolute right-0 top-0 h-screen w-1/2 bg-blue-900 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => {
          const size = Math.floor(Math.random() * 40) + 20; // Size 20px - 60px
          const top = Math.random() * 100; // Top position
          const left = Math.random() * 100; // Left position
          const colors = [
            "bg-red-400",
            "bg-yellow-400",
            "bg-green-400",
            "bg-purple-400",
            "bg-white",
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const shapeType = Math.random() > 0.5 ? "rounded-full" : "rounded-lg";
          const animation = `animate-move${(i % 5) + 1}`;

          return (
            <div
              key={i}
              className={`absolute ${randomColor} ${shapeType} ${animation}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
              }}
            ></div>
          );
        })}
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes move1 {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes move2 {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-20px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes move3 {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes move4 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes move5 {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(10px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        .animate-move1 {
          animation: move1 3s infinite ease-in-out;
        }
        .animate-move2 {
          animation: move2 4s infinite ease-in-out;
        }
        .animate-move3 {
          animation: move3 5s infinite ease-in-out;
        }
        .animate-move4 {
          animation: move4 6s infinite linear;
        }
        .animate-move5 {
          animation: move5 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
