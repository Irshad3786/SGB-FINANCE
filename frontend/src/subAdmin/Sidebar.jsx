import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../home/components/Logo'

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 p-4">
        
        <div className='flex items-center justify-between mb-8 space-x-2 '>
            
            <Logo />
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><defs><mask id="SVGtzNlLcMt"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path stroke="#000" stroke-linecap="round" d="m27 33l-9-9l9-9"/></g></mask></defs><path fill="#a6a6a6" d="M0 0h48v48H0z" mask="url(#SVGtzNlLcMt)"/></svg>
            </div>
         </div>

      <nav className="space-y-3">
        <NavLink
          to="/subadmin/dashboard"
          className={({ isActive }) =>
            `block p-3 rounded-md ${isActive ? "bg-green-300" : "bg-gray-100"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/subadmin/users"
          className={({ isActive }) =>
            `block p-3 rounded-md ${isActive ? "bg-green-300" : "bg-gray-100"}`
          }
        >
          View Users
        </NavLink>

        <NavLink
          to="/subadmin/buysell"
          className={({ isActive }) =>
            `block p-3 rounded-md ${isActive ? "bg-green-300" : "bg-gray-100"}`
          }
        >
          Buy & Sell Entry
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar