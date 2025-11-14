import React from 'react'

function StatCard({label, value, className, icon}){
  return (
    <div className={`w-full sm:w-auto inline-flex items-center justify-between p-4 rounded-xl shadow-sm ${className} min-h-[64px]`}> 
      <div>
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="ml-4">
        {icon}
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="w-full px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Users Data</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <StatCard
            label="Total Users"
            value="1000"
            className="bg-green-50"
            icon={(
              <div className="w-10 h-10 bg-green-200 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-800" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20v-1c0-2.21 3.582-4 6-4s6 1.79 6 4v1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          />

          <StatCard
            label="Total Sellers"
            value="999"
            className="bg-indigo-50"
            icon={(
              <div className="w-10 h-10 bg-indigo-200 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-800" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          />

          <StatCard
            label="Total Buyers"
            value="682"
            className="bg-amber-50"
            icon={(
              <div className="w-10 h-10 bg-amber-200 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5 5 5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          />
        </div>
      </div>
      </div>
    </div>
  )
}

export default Dashboard