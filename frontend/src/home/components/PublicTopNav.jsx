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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="M13 21q-.425 0-.712-.288T12 20t.288-.712T13 19h6V5h-6q-.425 0-.712-.288T12 4t.288-.712T13 3h6q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-1.825-8H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7.175L9.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L14.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288T9.3 16.25q-.275-.3-.262-.712t.287-.688z" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512">
                  <path d="M0 0h512v512H0z" fill="none" />
                  <path fill="currentColor" d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0" />
                  <path fill="currentColor" d="M386.34 193.66L264.45 315.79A41.1 41.1 0 0 1 247.58 326l-25.9 8.67a35.92 35.92 0 0 1-44.33-44.33l8.67-25.9a41.1 41.1 0 0 1 10.19-16.87l122.13-121.91a8 8 0 0 0-5.65-13.66H104a56 56 0 0 0-56 56v240a56 56 0 0 0 56 56h240a56 56 0 0 0 56-56V199.31a8 8 0 0 0-13.66-5.65" />
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
