import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function Subadmin() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Subadmin