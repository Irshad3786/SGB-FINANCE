import React, { useEffect, useMemo, useState } from 'react'
import apiClient from '../api/axios'

function Topbar({topbarData , data, title, isDarkMode = false, onToggleTheme}) {
    const [subAdminProfile, setSubAdminProfile] = useState({ name: 'Sub Admin' });

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get('/api/subadmin/me')
          const profile = response?.data?.data || {}
          setSubAdminProfile({
            name: profile?.name || 'Sub Admin',
            roleName: profile?.roleName || '',
          })
        } catch {
          setSubAdminProfile({ name: 'Sub Admin', roleName: '' })
        }
      }

      fetchProfile()
    }, [])

    const initials = useMemo(() => {
      const name = String(subAdminProfile?.name || 'Sub Admin').trim()
      if (!name) return 'SA'
      const parts = name.split(/\s+/)
      const first = parts[0]?.[0] || 'S'
      const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : 'A'
      return `${first}${second}`.toUpperCase()
    }, [subAdminProfile])

  return (
    <header className="w-full h-20 bg-white border-b shadow-sm flex items-center justify-between px-6 gap-4">
      
      {!data &&( <div className="cursor-pointer" onClick={() => {
        topbarData(true)}
        }>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#a6a6a6" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z"/></g></svg>
        </div>)}
      

      {/* Page Title */}
      <div className="ml-4 text-xl md:text-3xl font-extrabold truncate">
        {title || ''}
      </div>


      {/* Right Section */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-11 px-3 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"/>
            </svg>
          )}
          <span className="hidden md:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#B0FF1C] to-[#40FF00] text-black flex items-center justify-center font-black text-sm shadow-sm border border-black/10">
          {initials}
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-semibold text-gray-900">{subAdminProfile?.name || 'Sub Admin'}</div>
          <div className="text-xs text-gray-500">{subAdminProfile?.roleName || 'Sub Admin'}</div>
        </div>
      </div>

    </header>
  )
}

export default Topbar