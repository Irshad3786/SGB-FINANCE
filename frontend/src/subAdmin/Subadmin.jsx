import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import apiClient from '../api/axios';
import Sidebar from "./Sidebar";
import TopBar from './Topbar';
import Footer from '../home/components/Footer';
import { readStoredSubAdminProfile } from './utils/subAdminAccess';


function Subadmin() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topTitle, setTopTitle] = useState('Dashboard');
  const [subAdminProfile, setSubAdminProfile] = useState(() => readStoredSubAdminProfile());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('subadmin-theme') === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('subadmin-theme', isDarkMode ? 'dark' : 'light')
    } catch {
      // Ignore storage errors and keep runtime behavior.
    }
  }, [isDarkMode])

  useEffect(() => {
    const fetchSubAdminProfile = async () => {
      try {
        const response = await apiClient.get('/api/subadmin/me')
        const profile = response?.data?.data || {}

        setSubAdminProfile({
          name: profile?.name || 'Sub Admin',
          roleName: profile?.roleName || '',
          permissions: Array.isArray(profile?.permissions) ? profile.permissions : [],
        })
      } catch {
        // Keep the stored profile if the API call fails.
      }
    }

    fetchSubAdminProfile()
  }, [])

  return (
    <div className={`flex min-h-screen overflow-x-hidden ${isDarkMode ? 'subadmin-dark' : 'subadmin-light'}`}>

      <style>{`
        .subadmin-dark {
          background-color: #0b1220;
          color: #e5e7eb;
        }

        .subadmin-dark .bg-white {
          background-color: #111827 !important;
        }

        .subadmin-dark .bg-gray-100,
        .subadmin-dark .bg-gray-50 {
          background-color: #1f2937 !important;
        }

        .subadmin-dark .border,
        .subadmin-dark .border-b,
        .subadmin-dark .border-r,
        .subadmin-dark .border-gray-100,
        .subadmin-dark .border-gray-200,
        .subadmin-dark .border-gray-300 {
          border-color: #374151 !important;
        }

        .subadmin-dark .text-black,
        .subadmin-dark .text-gray-900,
        .subadmin-dark .text-gray-800,
        .subadmin-dark .text-gray-700 {
          color: #e5e7eb !important;
        }

        .subadmin-dark .text-gray-600,
        .subadmin-dark .text-gray-500,
        .subadmin-dark .text-gray-400 {
          color: #9ca3af !important;
        }

        .subadmin-dark input,
        .subadmin-dark select,
        .subadmin-dark textarea {
          background-color: #111827 !important;
          color: #e5e7eb !important;
          border-color: #374151 !important;
        }

        .subadmin-dark table thead tr {
          background-color: #1f2937 !important;
        }

        .subadmin-dark table tbody tr {
          border-color: #374151 !important;
        }

        .subadmin-dark .shadow,
        .subadmin-dark .shadow-sm,
        .subadmin-dark .shadow-lg,
        .subadmin-dark .shadow-2xl {
          box-shadow: none !important;
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      {sidebarOpen &&  <div>
        <Sidebar
          toggle={setSidebarOpen}
          onNavigate={setTopTitle}
          permissions={subAdminProfile.permissions || []}
        />
      </div>}
      

      {/* RIGHT SECTION */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-48 md:ml-64' : ''}`}>

        {/* TOP BAR */}
        <TopBar
          topbarData={setSidebarOpen}
          data={sidebarOpen}
          title={topTitle}
          isDarkMode={isDarkMode}
          subAdminProfile={subAdminProfile}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />

        {/* MAIN CONTENT BELOW TOP BAR - SCROLLABLE */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>

       

      </div>

      

    </div>
  )
}

export default Subadmin