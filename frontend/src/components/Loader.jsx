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
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="animate-pulse">
            <Logo />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#B0FF1C]/70 border-t-[#40FF00] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#27563C]">{message}</p>
      </div>
    </div>
  )
}

export default Loader
