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
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        .orbit-dot {
          animation: orbit 2.5s linear infinite;
        }
        .orbit-dot:nth-child(2) {
          animation-delay: 0.625s;
        }
        .orbit-dot:nth-child(3) {
          animation-delay: 1.25s;
        }
        .orbit-dot:nth-child(4) {
          animation-delay: 1.875s;
        }
      `}</style>
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Orbiting dots */}
          <div className="absolute w-40 h-40 flex items-center justify-center">
            <div className="orbit-dot absolute w-3 h-3 bg-[#40FF00] rounded-full"></div>
            <div className="orbit-dot absolute w-3 h-3 bg-[#B0FF1C] rounded-full"></div>
            <div className="orbit-dot absolute w-3 h-3 bg-[#40FF00] rounded-full"></div>
            <div className="orbit-dot absolute w-3 h-3 bg-[#B0FF1C] rounded-full"></div>
          </div>
          
          {/* Center Logo */}
          <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-white rounded-full">
            <Logo />
          </div>
        </div>
        <p className="text-sm font-semibold text-[#27563C]">{message}</p>
      </div>
    </div>
  )
}

export default Loader
