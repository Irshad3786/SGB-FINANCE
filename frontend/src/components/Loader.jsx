import React from 'react'
import Logo from '../home/components/Logo'

function Loader({
  fullScreen = true,
  message = 'Loading...'
}) {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#E0FCED]/90 via-white/80 to-white/95 backdrop-blur-sm'
          : 'flex items-center justify-center'
      }
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .loader-spinner {
          animation: spin 2.5s linear infinite;
        }
        .loader-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col items-center gap-8">
        {/* Modern Animated Spinner */}
        <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-[#F0FFF4] to-[#E8F9F0] rounded-full p-6 shadow-lg">
          {/* Outer Ring */}
          <div className="absolute inset-6 rounded-full border-4 border-gray-200"></div>
          
          {/* Gradient Spinner Ring */}
          <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-[#B0FF1C] border-r-[#40FF00] loader-spinner"></div>
          
          {/* Middle Ring */}
          <div className="absolute inset-8 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-8 rounded-full border-4 border-transparent border-b-[#40FF00] border-l-[#B0FF1C] loader-spinner" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          
          {/* Center Logo */}
          <div className="relative z-10 flex items-center justify-center w-28 h-28 bg-white rounded-full loader-pulse shadow-md">
            <Logo />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#27563C] text-center">{message}</p>
      </div>
    </div>
  )
}

export default Loader
