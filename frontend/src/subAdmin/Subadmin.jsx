import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import apiClient from '../api/axios';
import Sidebar from "./Sidebar";
import TopBar from './Topbar';
import Footer from '../home/components/Footer';
import Loader from '../components/Loader';
import { readStoredSubAdminProfile, canAccessModule } from './utils/subAdminAccess';


function Subadmin() {

  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return window.matchMedia('(min-width: 768px)').matches
  });
  const [topTitle, setTopTitle] = useState('Dashboard');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [subAdminProfile, setSubAdminProfile] = useState(() => readStoredSubAdminProfile());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('subadmin-theme') === 'dark'
    } catch {
      return false
    }
  })

  // Module protection mapping
  const PATH_TO_MODULE = {
    'dashboard': 'dashboard',
    'users': 'users',
    'sell': 'addEntry',
    'buy': 'addEntry',
    'finance': 'finance',
    'collection': 'finance',
    'vehicle-stock': 'vehicleStock',
    'pending-downpayment': 'pendingPayments',
    'requests-management': 'requestCenter',
    'ownership-transfer': 'ownershipTransfer'
  };

  // Determine if user has access to current sub-route
  const getRequiredModule = (path) => {
    const segments = path.split('/').filter(Boolean);
    // Path structure: /subadmin/module-name
    if (segments[0] === 'subadmin' && segments[1]) {
      return PATH_TO_MODULE[segments[1]];
    }
    return null;
  };

  const requiredModule = getRequiredModule(location.pathname);
  
  const hasAccess = isLoadingProfile || !requiredModule || 
    (subAdminProfile.permissions && subAdminProfile.permissions.length === 0 && !requiredModule) || 
    canAccessModule(subAdminProfile.permissions, requiredModule);

  useEffect(() => {
    // If we are at the dashboard and don't have access, or at the base path
    const isAtDashboard = location.pathname === '/subadmin/dashboard';
    const isAtBase = location.pathname === '/subadmin' || location.pathname === '/subadmin/';
    
    if (isAtBase || (isAtDashboard && !canAccessModule(subAdminProfile.permissions, 'dashboard'))) {
      const PATH_TO_MODULE = {
        'dashboard': '/subadmin/dashboard',
        'users': '/subadmin/users',
        'addEntry': '/subadmin/sell',
        'finance': '/subadmin/finance',
        'vehicleStock': '/subadmin/vehicle-stock',
        'pendingPayments': '/subadmin/pending-downpayment',
        'requestCenter': '/subadmin/requests-management',
        'ownershipTransfer': '/subadmin/ownership-transfer'
      };

      const orderedModules = [
        'dashboard', 'vehicleStock', 'users', 'addEntry', 
        'finance', 'pendingPayments', 'requestCenter', 'ownershipTransfer'
      ];

      if (subAdminProfile.permissions && subAdminProfile.permissions.length > 0) {
        const firstAvailableModule = orderedModules.find(moduleName => 
          canAccessModule(subAdminProfile.permissions, moduleName)
        );
        if (firstAvailableModule && PATH_TO_MODULE[firstAvailableModule] !== location.pathname) {
          navigate(PATH_TO_MODULE[firstAvailableModule], { replace: true });
        }
      }
    }
  }, [location.pathname, subAdminProfile.permissions, navigate]);

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
        setIsLoadingProfile(true)
        const response = await apiClient.get('/api/subadmin/me')
        const profile = response?.data?.data || {}

        setSubAdminProfile({
          name: profile?.name || 'Sub Admin',
          roleName: profile?.roleName || '',
          permissions: Array.isArray(profile?.permissions) ? profile.permissions : [],
        })
      } catch {
        // Keep the stored profile if the API call fails.
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchSubAdminProfile()
  }, [])

  return (
    <div className={`flex min-h-screen overflow-x-hidden ${isDarkMode ? 'subadmin-dark' : 'subadmin-light'}`}>

      <style>{`
        .subadmin-dark {
          background-color: #0b1220;
          color: #f3f4f6;
        }

        .subadmin-dark * {
          color: inherit !important;
        }

        .subadmin-dark .bg-white {
          background-color: #111827 !important;
        }

        /* Fix all backgrounds including custom hex colors and gradients */
        .subadmin-dark [class*="bg-"],
        .subadmin-dark [class*="from-"],
        .subadmin-dark [class*="to-"],
        .subadmin-dark [class*="via-"],
        .subadmin-dark div[style*="background"],
        .subadmin-dark div[style*="background-color"] {
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
        }

        /* CRITICAL EXCEPTION: Restore logo gradient background - target first child of logo container */
        .subadmin-dark .flex.gap-1.cursor-pointer > div:first-child {
          background: linear-gradient(to bottom, #B0FF1C, #40FF00) !important;
          color: #000000 !important;
          background-color: transparent !important;
        }

        /* Logo text stays light mode colors */
        .subadmin-dark .flex.gap-1.cursor-pointer p {
          color: inherit !important;
        }

        /* SVG inside logo stays light mode colors */
        /* Ensure border visibility */
        .subadmin-dark [class*="border-"]:not(.flex.gap-1.cursor-pointer *) {
          border-color: #374151 !important;
        }

        /* White specific backgrounds */
        .subadmin-dark .bg-white {
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
        }

        /* Override inline styles with custom hex colors */
        .subadmin-dark div[style*="white"],
        .subadmin-dark div[style*="#f2f8ea"],
        .subadmin-dark div[style*="#f0fdf4"],
        .subadmin-dark div[style*="#ecfdf5"] {
          background-color: #1f2937 !important;
          color: #f3f4f6 !important;
        }

        .subadmin-dark .border,
        .subadmin-dark .border-b,
        .subadmin-dark .border-r,
        .subadmin-dark .border-gray-100,
        .subadmin-dark .border-gray-200,
        .subadmin-dark .border-gray-300,
        .subadmin-dark .border-dashed {
          border-color: #374151 !important;
        }

        .subadmin-dark p,
        .subadmin-dark span,
        .subadmin-dark div,
        .subadmin-dark a {
          color: #f3f4f6 !important;
        }

        /* Override all text color classes to BLACK for visibility in dark mode */
        .subadmin-dark .text-black,
        .subadmin-dark .text-white,
        .subadmin-dark .text-slate-900,
        .subadmin-dark .text-slate-800,
        .subadmin-dark .text-slate-700,
        .subadmin-dark .text-slate-600,
        .subadmin-dark .text-gray-900,
        .subadmin-dark .text-gray-800,
        .subadmin-dark .text-gray-700,
        .subadmin-dark .text-gray-600,
        .subadmin-dark .text-gray-500,
        .subadmin-dark .text-gray-400,
        /* Amber text colors */
        .subadmin-dark .text-amber-900,
        .subadmin-dark .text-amber-800,
        .subadmin-dark .text-amber-700,
        .subadmin-dark .text-amber-600,
        /* Emerald text colors */
        .subadmin-dark .text-emerald-900,
        .subadmin-dark .text-emerald-800,
        .subadmin-dark .text-emerald-700,
        .subadmin-dark .text-emerald-600,
        /* Rose text colors */
        .subadmin-dark .text-rose-900,
        .subadmin-dark .text-rose-800,
        .subadmin-dark .text-rose-700,
        .subadmin-dark .text-rose-600,
        /* Generic colored text wildcards */
        .subadmin-dark [class*="text-red-"],
        .subadmin-dark [class*="text-orange-"],
        .subadmin-dark [class*="text-yellow-"],
        .subadmin-dark [class*="text-lime-"],
        .subadmin-dark [class*="text-green-"],
        .subadmin-dark [class*="text-teal-"],
        .subadmin-dark [class*="text-cyan-"],
        .subadmin-dark [class*="text-sky-"],
        .subadmin-dark [class*="text-blue-"],
        .subadmin-dark [class*="text-indigo-"],
        .subadmin-dark [class*="text-violet-"],
        .subadmin-dark [class*="text-purple-"],
        .subadmin-dark [class*="text-pink-"],
        .subadmin-dark [class*="text-fuchsia-"] {
          color: #000000 !important;
        }

        .subadmin-dark .text-gray-300,
        .subadmin-dark .text-gray-200 {
          color: #1f2937 !important;
        }

        .subadmin-dark input,
        .subadmin-dark select,
        .subadmin-dark textarea {
          background-color: #111827 !important;
          color: #f3f4f6 !important;
          border-color: #374151 !important;
        }

        .subadmin-dark input::placeholder,
        .subadmin-dark select::placeholder,
        .subadmin-dark textarea::placeholder {
          color: #9ca3af !important;
        }

        .subadmin-dark table thead tr {
          background-color: #1f2937 !important;
        }

        .subadmin-dark table tbody tr {
          border-color: #374151 !important;
        }

        .subadmin-dark table td,
        .subadmin-dark table th {
          color: #f3f4f6 !important;
          background-color: inherit !important;
        }

        .subadmin-dark button {
          color: inherit !important;
        }

        .subadmin-dark h1,
        .subadmin-dark h2,
        .subadmin-dark h3,
        .subadmin-dark h4,
        .subadmin-dark h5,
        .subadmin-dark h6 {
          color: #f3f4f6 !important;
        }

        /* NOTE: Do not globally override SVG fill/stroke in dark mode.
           Many icons (and the company logo SVG) use explicit fill attributes or embedded images.
           Global SVG rules can unintentionally turn them black/invisible. */

        /* Keep icons the same as light mode when they use currentColor. */
        .subadmin-dark svg {
          color: initial !important;
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
      <div
        className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-48 md:ml-64' : ''} ${sidebarOpen ? 'blur-sm md:blur-none' : ''} transition-[filter] duration-200`}
      >

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
          {isLoadingProfile ? (
            <div className="flex items-center justify-center h-full">
              <Loader message="Loading access permissions..." />
            </div>
          ) : hasAccess ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-8">
                  You don't have permission to access the <span className="font-semibold text-gray-900">{requiredModule}</span> module.
                </p>
                <button
                  onClick={() => window.location.href = '/subadmin/dashboard'}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#B0FF1C] to-[#40FF00] text-black font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>

       

      </div>

      

    </div>
  )
}

export default Subadmin