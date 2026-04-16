import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from './Topbar';
import Footer from '../home/components/Footer';


function Subadmin() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topTitle, setTopTitle] = useState('Dashboard');
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

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'subadmin-dark' : 'subadmin-light'}`}>

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
      {!sidebarOpen &&  <div>
        <Sidebar toggle={setSidebarOpen} onNavigate={setTopTitle} />
      </div>}
      

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <TopBar
          topbarData={setSidebarOpen}
          data={sidebarOpen}
          title={topTitle}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        />

        {/* MAIN CONTENT BELOW TOP BAR */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

       

      </div>

      

    </div>
  )
}

export default Subadmin