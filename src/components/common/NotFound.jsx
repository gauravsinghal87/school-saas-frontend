import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary animate-bounce">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-primary mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-primary text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-button-primary-text hover:bg-primarytext-primary text-button-primary-hover font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </button>


        {/* Decorative Elements */}
        <div className="mt-12">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-surface-sidebar rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-surface-sidebar rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-surface-sidebar rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound