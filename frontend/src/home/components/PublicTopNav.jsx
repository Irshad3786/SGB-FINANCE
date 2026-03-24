import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

function PublicTopNav() {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ]

  const handleNavigate = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className='md:px-8 md:pt-6'>
      <div className='w-full bg-[rgba(246,246,246,0.45)] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:rounded-full'>
        <div className='flex items-center justify-between px-3 py-4'>
          <div className='flex items-center md:pl-6'>
            <button
              type='button'
              aria-label='Toggle navigation menu'
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className='pr-2 md:hidden'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#9c9c9c" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z" strokeWidth="0.5" stroke="#9c9c9c" /></g></svg>
            </button>
            <Logo />
          </div>

          <ul className='hidden items-center gap-5 font-semibold md:flex'>
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  type='button'
                  onClick={() => handleNavigate(item.path)}
                  className='text-[#27563C] transition hover:text-[#1E3E2B]'
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className='flex items-center gap-2 sm:px-5'>
            <button
              type='button'
              onClick={() => handleNavigate('/login')}
              className='rounded-xl border-[2px] border-black bg-[#E0FCED] px-3 py-1 text-sm font-bold text-[#27563C] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:px-4'
            >
              <span className='flex items-center justify-center md:hidden' aria-hidden='true'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path d='M10 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H10V19H6V5H10V3Z' fill='currentColor' />
                  <path d='M13.586 7.00005L12.172 8.41405L14.758 11.0001H8V13.0001H14.758L12.172 15.5861L13.586 17.0001L18.586 12.0001L13.586 7.00005Z' fill='currentColor' />
                </svg>
              </span>
              <span className='hidden md:inline'>Login</span>
            </button>
            <button
              type='button'
              onClick={() => handleNavigate('/signup')}
              className='rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-3 py-1 text-sm font-bold text-[#1E3E2B] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:px-4'
            >
              <span className='flex items-center justify-center md:hidden' aria-hidden='true'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none'>
                  <path d='M6 3H14C15.1046 3 16 3.89543 16 5V8H14V5H6V19H14V16H16V19C16 20.1046 15.1046 21 14 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z' fill='currentColor' />
                  <path d='M8 8H12V10H8V8ZM8 12H11V14H8V12Z' fill='currentColor' />
                  <path d='M19 8V10H17V12H19V14H21V12H23V10H21V8H19Z' fill='currentColor' />
                </svg>
              </span>
              <span className='hidden md:inline'>Sign up</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className='border-t border-black/10 px-4 pb-3 pt-2 md:hidden'>
            <ul className='space-y-2 text-sm font-semibold text-[#27563C]'>
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    type='button'
                    onClick={() => handleNavigate(item.path)}
                    className='w-full rounded-lg px-2 py-2 text-left hover:bg-[#E0FCED]'
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicTopNav
