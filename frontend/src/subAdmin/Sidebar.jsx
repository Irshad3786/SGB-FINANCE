import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../home/components/Logo';
import { useLocation } from 'react-router-dom';
import apiClient, { setAuthToken, setRefreshToken } from '../api/axios';


function Sidebar({toggle, onNavigate}) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
 // Check both routes
  const isActiveCustom =
    location.pathname.startsWith("/subadmin/sell") ||
    location.pathname.startsWith("/subadmin/buy");
    
  return (
    <>
    <aside className="w-48 md:w-64 bg-white border-r h-screen fixed left-0 top-0 p-3 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-5 mt-5 flex-shrink-0">
        <Logo/>
        <div className='pl-4' onClick={()=>{
          toggle(false)
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="SVGtzNlLcMt"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke="#000" stroke-linecap="round" d="m27 33l-9-9l9-9"/></g></mask></defs><path fill="#a6a6a6" d="M0 0h48v48H0z" mask="url(#SVGtzNlLcMt)"/></svg>
        </div>
      </div>
 
      <nav className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <NavLink
          to="/subadmin/dashboard"
          onClick={() => onNavigate && onNavigate('Dashboard')}
          className={({ isActive }) =>
            ` p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <div ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="#000" fill-rule="evenodd" d="M1.375 1.375v5.75h3.75v-5.75zM.125 1.25C.125.629.629.125 1.25.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4A1.125 1.125 0 0 1 .125 7.25zM8.75.125c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125V1.25c0-.621-.504-1.125-1.125-1.125zm.125 6.75v5.75h3.75v-5.75zm-1.25-.125c0-.621.504-1.125 1.125-1.125h4c.621 0 1.125.504 1.125 1.125v6c0 .621-.504 1.125-1.125 1.125h-4a1.125 1.125 0 0 1-1.125-1.125zM1.25 9.615c-.621 0-1.125.504-1.125 1.125v2.01c0 .621.504 1.125 1.125 1.125h4c.621 0 1.125-.504 1.125-1.125v-2.01c0-.621-.504-1.125-1.125-1.125z" clip-rule="evenodd"/></svg></div>
           Dashboard 
        </NavLink>

        <NavLink
          to="/subadmin/vehicle-stock"
          onClick={() => onNavigate && onNavigate('Vehicle Stock')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M4 8.923h16V5.385q0-.231-.192-.423t-.423-.193H4.615q-.23 0-.423.192T4 5.384zm0 5.154h16V9.923H4zm.615 5.154h14.77q.23 0 .423-.193t.192-.423v-3.538H4v3.539q0 .23.192.423t.423.192M5.77 7.654V6.039h1.615v1.615zm0 5.154v-1.616h1.615v1.616zm0 5.154v-1.616h1.615v1.616z"/></svg>
          </div>
          Vehicle Stock
        </NavLink>

        <NavLink
          to="/subadmin/users"
          onClick={() => onNavigate && onNavigate('Users')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
         <div ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/></svg></div>
        Users
        </NavLink>

        <NavLink
      to="/subadmin/sell"
      onClick={() => onNavigate && onNavigate("Buy & Sell Entry")}
      className={() =>
        `p-4 rounded-xl flex items-center gap-2 ${
          isActiveCustom
            ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]"
            : "bg-gray-100 font-semibold"
        } hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="#000"
          fillRule="evenodd"
          d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75"
          clipRule="evenodd"
        />
      </svg>
      Add Entry
    </NavLink>

        <NavLink
          to="/subadmin/finance"
          onClick={() => onNavigate && onNavigate('Finance')}
          className={() =>
            `p-4 rounded-xl flex items-center gap-2 ${
              (location.pathname.startsWith('/subadmin/finance') || location.pathname.startsWith('/subadmin/collection'))
                ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]"
                : "bg-gray-100 font-semibold"
            } hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#2f2f2f" strokeWidth="2" d="M16 16c0-1.105-3.134-2-7-2s-7 .895-7 2s3.134 2 7 2s7-.895 7-2ZM2 16v4.937C2 22.077 5.134 23 9 23s7-.924 7-2.063V16M9 5c-4.418 0-8 .895-8 2s3.582 2 8 2M1 7v5c0 1.013 3.582 2 8 2M23 4c0-1.105-3.1-2-6.923-2s-6.923.895-6.923 2s3.1 2 6.923 2S23 5.105 23 4Zm-7 12c3.824 0 7-.987 7-2V4M9.154 4v10.166M9 9c0 1.013 3.253 2 7.077 2S23 10.013 23 9"/>
          </svg>
          Finance
        </NavLink>

        <NavLink
          to="/subadmin/pending-downpayment"
          onClick={() => onNavigate && onNavigate('Pending Payments')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#000" d="M22.26 3.35A1 1 0 0 0 21.5 3h-9a1 1 0 0 0-.75.34a1 1 0 0 0-.24.79l1 7.5a1 1 0 1 0 2-.26l-.81-6.09a.22.22 0 0 1 .06-.19a.25.25 0 0 1 .17-.09H20a.22.22 0 0 1 .19.09a.24.24 0 0 1 .06.2l-1.09 6.57a1 1 0 1 0 2 .33l1.34-8a1 1 0 0 0-.24-.84"/>
              <path fill="#000" d="M19 14h-6a.23.23 0 0 1-.22-.14L11.82 12a.5.5 0 0 0-.39-.28a.51.51 0 0 0-.45.18L9.1 14.21a.9.9 0 0 1-.59.28h-1A.5.5 0 0 0 7 15v6a.48.48 0 0 0 .2.4c2.3 1.73 4.08 2.6 5.3 2.6h5.55A1.7 1.7 0 0 0 20 22.66a56 56 0 0 0 1-7.16c0-.75-.69-1.5-2-1.5m-14.17-.5H1.75a.25.25 0 0 0-.25.25v9a.25.25 0 0 0 .25.25h3.08a.6.6 0 0 0 .67-.59v-8.32a.6.6 0 0 0-.67-.59M15.5 9a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M10 11a1 1 0 0 0 1-1.16L9.73 2.29a.28.28 0 0 1 0-.2A.25.25 0 0 1 10 2h8a1 1 0 0 0 0-2H8.5a1 1 0 0 0-1 1.16l1.5 9a1 1 0 0 0 1 .84"/>
            </svg>
          </div>
          Pending Payments
        </NavLink>

        <NavLink
          to="/subadmin/requests-management"
          onClick={() => onNavigate && onNavigate('Request Center')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#000" d="M5 3a2 2 0 0 0-2 2v14.5A1.5 1.5 0 0 0 4.5 21H19a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 15.172 3zm9 1.5V8h3.5zM7 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zm0 4a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2z"/>
            </svg>
          </div>
          Request Center
        </NavLink>

        <NavLink
          to="/subadmin/ownership-transfer"
          onClick={() => onNavigate && onNavigate('Ownership Transfer')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M8.56 11.9a1.5 1.5 0 0 1 0 2.12l-.974.976H16a1.5 1.5 0 0 1 0 3H7.586l.975.974a1.5 1.5 0 1 1-2.122 2.122l-3.535-3.536a1.5 1.5 0 0 1 0-2.121l3.535-3.536a1.5 1.5 0 0 1 2.122 0Zm6.88-9a1.5 1.5 0 0 1 2.007-.104l.114.103l3.535 3.536a1.5 1.5 0 0 1 .103 2.007l-.103.114l-3.535 3.536a1.5 1.5 0 0 1-2.225-2.008l.103-.114l.975-.974H8a1.5 1.5 0 0 1-.144-2.994L8 5.996h8.414l-.975-.975a1.5 1.5 0 0 1 0-2.122Z"/></g></svg>
          </div>
          Ownership Transfer
        </NavLink>
      </nav>

      <div className="flex-shrink-0 pb-2 pt-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full p-4 rounded-xl flex items-center gap-2 bg-red-50 hover:bg-red-100 font-semibold text-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g className="logout-outline">
              <g fill="currentColor" fillRule="evenodd" className="Vector" clipRule="evenodd">
                <path d="M3 7a5 5 0 0 1 5-5h5a1 1 0 1 1 0 2H8a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5a1 1 0 1 1 0 2H8a5 5 0 0 1-5-5z"/>
                <path d="M14.47 7.316a1 1 0 0 1 1.414-.046l4.8 4.5a1 1 0 0 1 0 1.46l-4.8 4.5a1 1 0 1 1-1.368-1.46l2.955-2.77H8a1 1 0 1 1 0-2h9.471l-2.955-2.77a1 1 0 0 1-.046-1.414"/>
              </g>
            </g>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    {/* Logout Confirmation Modal - Outside sidebar */}
    {showLogoutModal && (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
        onClick={() => setShowLogoutModal(false)}
      >
        <div 
          className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#dc2626" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
              <p className="text-sm text-gray-600">Are you sure you want to logout?</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await apiClient.post('/api/subadmin/logOutSubAdmin')
                  setAuthToken(null)
                  setRefreshToken(null)
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear()
                  }
                  setShowLogoutModal(false)
                  navigate('/login', { replace: true })
                } catch (error) {
                  console.error('Logout error:', error)
                  setAuthToken(null)
                  setRefreshToken(null)
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear()
                  }
                  setShowLogoutModal(false)
                  navigate('/login', { replace: true })
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )
  
}

export default Sidebar