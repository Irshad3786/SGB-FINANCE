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
            `block p-3 rounded-md ${isActive ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/subadmin/users"
          onClick={() => onNavigate && onNavigate('Users')}
          className={({ isActive }) =>
            `block p-3 rounded-md ${isActive ? "bg-gradient-to-b from-[#B0FF1C]  to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          View Users
        </NavLink>

        <NavLink
          to="/subadmin/buysell"
          onClick={() => onNavigate && onNavigate('Buy & Sell Entry')}
          className={({ isActive }) =>
            `block p-3 rounded-md ${isActive ? "bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)]" : "bg-gray-100 font-semibold"} hover:shadow-[-1px_8px_7px_-2px_rgba(0,_0,_0,_0.25)] transition-shadow`
          }
        >
          Buy & Sell Entry
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar