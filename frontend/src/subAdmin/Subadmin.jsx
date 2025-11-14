import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from './Topbar';


function Subadmin() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [topTitle, setTopTitle] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* LEFT SIDEBAR */}
      {!sidebarOpen &&  <div>
        <Sidebar toggle={setSidebarOpen} onNavigate={setTopTitle} />
      </div>}
      

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <TopBar topbarData = {setSidebarOpen} data={sidebarOpen} title={topTitle} />

        {/* MAIN CONTENT BELOW TOP BAR */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default Subadmin