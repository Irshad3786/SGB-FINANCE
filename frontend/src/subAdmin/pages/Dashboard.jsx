import React from 'react'

function StatCard({ label, value, className, icon }) {
  return (
    <div className={`flex flex-wrap items-center border-[2px] border-[#f0f0f0] justify-between p-4 shadow-[7px_9px_7px_-4px_rgba(0,_0,_0,_0.25)] rounded-xl ${className} min-h-[72px] hover:shadow-2xl hover:-translate-y-1 transition-all` }>
      <div>
        <div className="text-xs font-semibold sm:text-sm text-gray-600">{label}</div>
        <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      </div>
      <div className="ml-4 flex-shrink-0  ">
        {icon}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-6  border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold">Users Data</h2>
          </div>

          {/* Responsive grid: 1 col mobile, 2 on small/tablet, 3 on md, 4 on lg+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <StatCard
              label="Total Users"
              value="1000"
              className="bg-green-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-green-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4" fill="#40ff07"/><path fill="#40ff07" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total Sellers"
              value="999"
              className="bg-indigo-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-indigo-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#6e98ff" d="m21.4 14.25l-7.15 7.15q-.3.3-.675.45t-.75.15t-.75-.15t-.675-.45l-8.825-8.825q-.275-.275-.425-.637T2 11.175V4q0-.825.588-1.412T4 2h7.175q.4 0 .775.163t.65.437l8.8 8.825q.3.3.438.675t.137.75t-.137.738t-.438.662M6.5 8q.625 0 1.063-.437T8 6.5t-.437-1.062T6.5 5t-1.062.438T5 6.5t.438 1.063T6.5 8"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total Buyers"
              value="682"
              className="bg-amber-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-amber-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffb700" fill-rule="evenodd" d="M2 8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm9 4a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clip-rule="evenodd"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Financed"
              value="24"
              className="bg-violet-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-violet-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#a06cff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#a06cff" d="M16.948 9.95L14.998 8v6.587c0 .89-1.077 1.337-1.707.707L11.996 14c-.5-.5-1.701-.8-2.502 0s-.5 2 0 2.5l3.603 4.4A3 3 0 0 0 15.42 22H18a1 1 0 0 0 1-1v-6.1a7 7 0 0 0-2.052-4.95"/><path d="M11 2h2a2 2 0 0 1 2 2v2m-4-4c0 1.333.8 4 4 4m-4-4H9m6 4v6M5 12v2a2 2 0 0 0 2 2h2c0-1.333-.8-4-4-4m0 0V6m4-4H7a2 2 0 0 0-2 2v2m4-4c0 1.333-.8 4-4 4"/><circle cx="10" cy="9" r="1" transform="rotate(90 10 9)"/></g></svg>
                </div>
              )}
            />
          </div>
        </div>

        {/* placeholder space for extra content */}
        
      </div>
    </div>
  )
}