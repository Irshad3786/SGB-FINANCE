import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../home/components/Logo';
import { useLocation } from 'react-router-dom';


function Sidebar({toggle, onNavigate}) {

  const location = useLocation();
 // Check both routes
  const isActiveCustom =
    location.pathname.startsWith("/subadmin/sell") ||
    location.pathname.startsWith("/subadmin/buy");
    
  return (
    <aside className="w-48 md:w-64 bg-white border-r h-screen sticky top-0 p-4">
      <div className="flex items-center justify-between mb-8 mt-5">
        <Logo/>
        <div className='pl-4' onClick={()=>{
          toggle(true)
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="SVGtzNlLcMt"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke="#000" stroke-linecap="round" d="m27 33l-9-9l9-9"/></g></mask></defs><path fill="#a6a6a6" d="M0 0h48v48H0z" mask="url(#SVGtzNlLcMt)"/></svg>
        </div>
      </div>
 
      <nav className="space-y-3 ">
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
                ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px rgba(0,_0,_0,_0.25)]"
                : "bg-gray-100 font-semibold"
            } hover:shadow-[-1px_8px_7px_-2px rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="#2f2f2f" strokeWidth="2" d="M16 16c0-1.105-3.134-2-7-2s-7 .895-7 2s3.134 2 7 2s7-.895 7-2ZM2 16v4.937C2 22.077 5.134 23 9 23s7-.924 7-2.063V16M9 5c-4.418 0-8 .895-8 2s3.582 2 8 2M1 7v5c0 1.013 3.582 2 8 2M23 4c0-1.105-3.1-2-6.923-2s-6.923.895-6.923 2s3.1 2 6.923 2S23 5.105 23 4Zm-7 12c3.824 0 7-.987 7-2V4M9.154 4v10.166M9 9c0 1.013 3.253 2 7.077 2S23 10.013 23 9"/>
          </svg>
          Finance
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar