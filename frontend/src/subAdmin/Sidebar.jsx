import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../home/components/Logo';


function Sidebar({toggle, onNavigate}) {
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
          to="/subadmin/buysell"
          onClick={() => onNavigate && onNavigate('Buy & Sell Entry')}
          className={({ isActive }) =>
            `p-4 rounded-xl flex items-center gap-2 ${isActive ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="M7.345 4.017a42.3 42.3 0 0 1 9.31 0c1.713.192 3.095 1.541 3.296 3.26a40.7 40.7 0 0 1 0 9.446c-.201 1.719-1.583 3.068-3.296 3.26a42.3 42.3 0 0 1-9.31 0c-1.713-.192-3.095-1.541-3.296-3.26a40.7 40.7 0 0 1 0-9.445a3.734 3.734 0 0 1 3.295-3.26M12 7.007a.75.75 0 0 1 .75.75v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1 0-1.5h3.493V7.757a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>Add Entry
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar