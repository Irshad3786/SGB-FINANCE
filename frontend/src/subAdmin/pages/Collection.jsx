import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Collection() {
  const navigate = useNavigate()
  
  const collectionData = [
    { id: 1, aggNo: 586, amount: 3500, agent: 'prasad', status: 'paid' },
    { id: 2, aggNo: 663, amount: 4250, agent: 'ajay', status: 'pending' },
    { id: 3, aggNo: 754, amount: 2800, agent: 'prasad', status: 'paid' },
    { id: 4, aggNo: 821, amount: 3500, agent: 'rajesh', status: 'paid' },
    { id: 5, aggNo: 893, amount: 2200, agent: 'prasad', status: 'paid' },
    { id: 6, aggNo: 945, amount: 3500, agent: 'suresh', status: 'paid' },
    { id: 7, aggNo: 1012, amount: 1800, agent: 'prasad', status: 'paid' },
  ]

  const tableData = [
    { sno: 1, ha: 'HA454', name: 'MOHAMMAD IRSHAD', vehicle: 'AP39DZ9786', phone: '9182278505', emi: '3500', emiDate: '30-11-2025', commAmount: '25-11-2025', commDate: '3030', paidAmount: '3030', status: 'paid' },
    { sno: 2, ha: 'HA455', name: 'RAHUL KUMAR', vehicle: 'AP27AZ9865', phone: '9190909090', emi: '4250', emiDate: '01-11-2025', commAmount: '25-10-2025', commDate: '3330', paidAmount: '3330', status: 'pending' },
    { sno: 3, ha: 'HA456', name: 'PRADEEP SINGH', vehicle: 'AP26VV2654', phone: '9155555555', emi: '2800', emiDate: '15-12-2025', commAmount: '10-12-2025', commDate: '2880', paidAmount: '2880', status: 'paid' },
    { sno: 4, ha: 'HA457', name: 'KARTHIK RAO', vehicle: 'AP27NN3658', phone: '9166666666', emi: '3500', emiDate: '20-12-2025', commAmount: '15-12-2025', commDate: '3030', paidAmount: '3030', status: 'paid' },
    { sno: 5, ha: 'HA458', name: 'MOULALI AHMED', vehicle: 'AP39XX7508', phone: '9133333333', emi: '2200', emiDate: '25-12-2025', commAmount: '20-12-2025', commDate: '2030', paidAmount: '2030', status: 'paid' },
    { sno: 6, ha: 'HA459', name: 'SURESH BABU', vehicle: 'AP39YZ8512', phone: '9123456780', emi: '3500', emiDate: '05-01-2026', commAmount: '31-12-2025', commDate: '3030', paidAmount: '3030', status: 'paid' },
    { sno: 7, ha: 'HA460', name: 'DEEPAK VERMA', vehicle: 'AP25KK4532', phone: '9144444444', emi: '1800', emiDate: '10-01-2026', commAmount: '05-01-2026', commDate: '1630', paidAmount: '1630', status: 'paid' },
  ]

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ agent: '', status: 'all', date: '' })
  const highlightedCollection = collectionData[0]

  return (
    <div className="p-6">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
      `}</style>

      {/* Top Buttons */}
      <div className="flex items-center gap-4 mb-8">
        {/* All Users Button (inactive on Collection) */}
        <button onClick={() => navigate('/subadmin/finance')} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-gray-300 font-semibold text-gray-800 shadow hover:shadow-md transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#000" d="M21.987 18.73a2 2 0 0 1-.34.85a1.9 1.9 0 0 1-1.56.8h-1.651a.74.74 0 0 1-.6-.31a.76.76 0 0 1-.11-.67c.37-1.18.29-2.51-3.061-4.64a.77.77 0 0 1-.32-.85a.76.76 0 0 1 .72-.54a7.61 7.61 0 0 1 6.792 4.39a2 2 0 0 1 .13.97M19.486 7.7a4.43 4.43 0 0 1-4.421 4.42a.76.76 0 0 1-.65-1.13a6.16 6.16 0 0 0 0-6.53a.75.75 0 0 1 .61-1.18a4.3 4.3 0 0 1 3.13 1.34a4.46 4.46 0 0 1 1.291 3.12z"/>
            <path fill="#000" d="M16.675 18.7a2.65 2.65 0 0 1-1.26 2.48c-.418.257-.9.392-1.39.39H4.652a2.63 2.63 0 0 1-1.39-.39A2.62 2.62 0 0 1 2.01 18.7a2.6 2.6 0 0 1 .5-1.35a8.8 8.8 0 0 1 6.812-3.51a8.78 8.78 0 0 1 6.842 3.5a2.7 2.7 0 0 1 .51 1.36M14.245 7.32a4.92 4.92 0 0 1-4.902 4.91a4.903 4.903 0 0 1-4.797-5.858a4.9 4.9 0 0 1 6.678-3.57a4.9 4.9 0 0 1 3.03 4.518z"/>
          </svg>
          <span>Users</span>
        </button>

        {/* Collection Button (active on Collection) */}
        <button disabled className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-semibold text-gray-900 shadow-lg cursor-default opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="w-5 h-5">
            <path fill="#000" d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1"/>
          </svg>
          <span>Collection</span>
        </button>
      </div>

      {/* Quick controls */}
      

      <div className="md:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" fillRule="evenodd" d="M5 3h14L8.816 13.184a2.7 2.7 0 0 0-.778-1.086c-.228-.198-.547-.377-1.183-.736l-2.913-1.64c-.949-.533-1.423-.8-1.682-1.23C2 8.061 2 7.541 2 6.503v-.69c0-1.326 0-1.99.44-2.402C2.878 3 3.585 3 5 3" clipRule="evenodd"/>
              <path fill="#a6a6a6" d="M22 6.504v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3L8.815 13.184q.075.193.121.403c.064.285.064.619.064 1.286v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.197.545-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988" opacity="0.5"/>
            </svg>
            select filter
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" d="M3 1h18v2H3V1m0 4h18v2H3V5m0 4h18v2H3V9m0 4h18v2H3v-2m0 4h18v2H3v-2"/>
            </svg>
            download due list
          </button>
        </div>

        <div className="w-full max-w-sm py-4">
          <label htmlFor="collection-search" className="sr-only">Search collection</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
               </svg>
            </div>
            <input
              id="collection-search"
              type="search"
              name="search"
              placeholder="search user"
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[1px_2px_9px_-4px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-2 mb-14 md:mt-0  w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fill-rule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Select Agent</label>
              <select value={filters.agent} onChange={(e)=> setFilters(f=>({...f, agent: e.target.value}))} className="text-xs border rounded px-2 py-1">
                <option value="">All Agents</option>
                <option value="prasad">Prasad</option>
                <option value="ajay">Ajay</option>
                <option value="rajesh">Rajesh</option>
                <option value="suresh">Suresh</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M15 16.69V13h1.5v2.82l2.44 1.41l-.75 1.3zM19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.58-1.58c.14.19.3.36.47.53A7.001 7.001 0 0 0 21 11.1V2zM11.1 11c-.6.57-1.07 1.25-1.43 2H6v-2zm-2.03 4c-.07.33-.07.66-.07 1s0 .67.07 1H6v-2zM18 9H6V7h12zm2.85 7c0 .64-.12 1.27-.35 1.86c-.26.58-.62 1.14-1.07 1.57c-.43.45-.99.81-1.57 1.07c-.59.23-1.22.35-1.86.35c-2.68 0-4.85-2.17-4.85-4.85c0-1.29.51-2.5 1.42-3.43c.93-.91 2.14-1.42 3.43-1.42c2.67 0 4.85 2.17 4.85 4.85"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Commentary date</label>
              <input type="date" value={filters.date} onChange={(e)=> setFilters(f=>({...f, date: e.target.value}))} className="text-xs border rounded px-2 py-1" />
            </div>
          </div>

          <div className="ml-auto">
            <button onClick={() => setShowFilters(false)} className="px-3 py-1 text-xs bg-white rounded">Close</button>
          </div>
        </div>
      )}


      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-3">
          

          {highlightedCollection && (
            <div className="flex items-center gap-3 rounded-full bg-[#f3f1ff] text-gray-700 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-4 text-xs md:text-sm">
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-500">Agg No</span>
                  <span className="font-semibold text-base text-[#5751f5]">{highlightedCollection.aggNo}</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-500">Amount</span>
                  <span className="font-semibold text-base">{highlightedCollection.amount}</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-gray-500">Agent</span>
                  <span className="font-semibold text-base text-[#5751f5] capitalize">{highlightedCollection.agent}</span>
                </div>
              </div>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#5751f5] text-[#5751f5] bg-white hover:bg-[#5751f5] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5c.552 0 1 .448 1 1v5h5c.552 0 1 .448 1 1s-.448 1-1 1h-5v5c0 .552-.448 1-1 1s-1-.448-1-1v-5H6c-.552 0-1-.448-1-1s.448-1 1-1h5V6c0-.552.448-1 1-1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-start md:justify-end">
          <button
            onClick={() => setFilters({ agent: '', status: 'all', date: '' })}
            className="flex items-center gap-2 bg-[#ff7a19] text-white font-semibold px-5 py-3 rounded-full shadow hover:shadow-md"
          >
            <span>reset collection</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M3.578 6.487A8 8 0 1 1 2.5 10.5"/><path d="M7.5 6.5h-4v-4"/></g></svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left rounded-lg">
                <th className="py-3 px-3 text-base font-semibold rounded-tl-lg">HA</th>
                <th className="py-3 px-3 text-base font-semibold">Name</th>
                <th className="py-3 px-3 text-base font-semibold">Vehicle</th>
                <th className="py-3 px-3 text-base font-semibold">Phone</th>
                <th className="py-3 px-3 text-base font-semibold">EMI</th>
                <th className="py-3 px-3 text-base font-semibold">EMI Date</th>
                <th className="py-3 px-3 text-base font-semibold">Comm Date</th>
                <th className="py-3 px-3 text-base font-semibold">Comm Amount</th>
                <th className="py-3 px-3 text-base font-semibold">Paid Amount</th>
                <th className="py-3 px-3 text-base font-semibold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className={`border-b last:border-b-0 ${row.status === 'pending' ? 'bg-red-100' : 'bg-green-50'}`}>
                  <td className="py-3 px-3 text-xs font-semibold">{row.ha}</td>
                  <td className="py-3 px-3 text-xs">{row.name}</td>
                  <td className="py-3 px-3 text-xs">{row.vehicle}</td>
                  <td className="py-3 px-3 text-xs">{row.phone}</td>
                  <td className="py-3 px-3 text-xs">{row.emi}</td>
                  <td className="py-3 px-3 text-xs">{row.emiDate}</td>
                  <td className="py-3 px-3 text-xs">{row.commAmount}</td>
                  <td className="py-3 px-3 text-xs">{row.commDate}</td>
                  <td className="py-3 px-3 text-xs">{row.paidAmount}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${row.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.status === 'paid' ? '✓ paid' : '⚠ seizing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {tableData.map((row, idx) => (
            <div key={idx} className={`rounded-lg p-3 ${row.status === 'pending' ? 'bg-red-100' : 'bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">{row.ha}</div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {row.status === 'paid' ? '✓' : '⚠ seizing'}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-[10px] text-gray-400">Name</span><div className="font-medium">{row.name}</div></div>
                <div><span className="text-[10px] text-gray-400">Vehicle</span><div className="font-medium">{row.vehicle}</div></div>
                <div><span className="text-[10px] text-gray-400">Phone</span><div className="font-medium">{row.phone}</div></div>
                <div><span className="text-[10px] text-gray-400">EMI</span><div className="font-medium">{row.emi}</div></div>
                <div><span className="text-[10px] text-gray-400">Paid Amount</span><div className="font-medium">{row.paidAmount}</div></div>
                <div><span className="text-[10px] text-gray-400">EMI Date</span><div className="font-medium">{row.emiDate}</div></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-3">
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">previous</button>
          <div className="text-xs">1</div>
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">next</button>
        </div>
      </div>
    </div>
  )
}

export default Collection
