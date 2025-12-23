import React, { useState, useEffect } from 'react'
import EditUserModal from '../components/EditUserModal' // added import

function Users () {
  const initialUsers = [
    { id: 1, seller: 'MOHAMMAD IRSHAD', buyerName: 'RAJU K', vehicle: 'AP39DZ9786', vehicleName: 'Hero Splendor', model: 'Splendor 2020', chassis: 'MBLHAW10655DD40552', soldAmount: '35,000', buyAmount: '35,000', date: '30-10-2025', dob: '13-01-2000', phone: '9182278505', aadhaar: '5014 0694 9073', address: 'Ramapuram road, rosaiah colony Chirala, vetapalem mandal 523155 - Andhra pradesh', financeAmount: '25000', emiAmount: '3500', emiMonths: '15', emiDate: '12-10-2025', guarantorName: 'MOHAMMAD IRSHAD', guarantorPhone: '9182278505', guarantorAadhaar: '5014 0694 9073', guarantorAddress: 'Ramapuram road, rosaiah colony Chirala, vetapalem mandal 523155', referenceName: 'SURESH MAHESH', referencePhone: '9182278505' },
    { id: 2, seller: 'SURESH', buyerName: '', vehicle: 'AP39YZ8512', vehicleName: 'Bajaj Pulsar', model: 'Pulsar NS200', chassis: 'MBLHAW10655DD11111', soldAmount: '35,000', buyAmount: '', date: '30-10-2025', dob: '02-05-1992', phone: '9123456780', aadhaar: '1234 5678 9012', address: '1-2-3, Some street, City', financeAmount: '', emiAmount: '', emiMonths: '', emiDate: '', guarantorName: '', guarantorPhone: '', guarantorAadhaar: '', guarantorAddress: '', referenceName: 'RAMESH', referencePhone: '9000000000' },
    { id: 3, seller: 'RAHUL', buyerName: 'MANU', vehicle: 'AP27AZ9865', vehicleName: 'TVS Apache', model: 'Apache RTR 160', chassis: 'MBLHAW10655DD22222', soldAmount: '35,000', buyAmount: '35,000', date: '30-10-2025', dob: '08-08-1996', phone: '9190909090', aadhaar: '2222 3333 4444', address: 'Block 5, Some Area', financeAmount: '20000', emiAmount: '2200', emiMonths: '12', emiDate: '01-11-2025', guarantorName: 'SANTHOS', guarantorPhone: '9191919191', guarantorAadhaar: '3333 4444 5555', guarantorAddress: 'Guarantor address', referenceName: 'KUMAR', referencePhone: '9111111111' },
    { id: 4, seller: 'KARTHIK', buyerName: '', vehicle: 'AP27NN3658', vehicleName: 'Honda Activa', model: 'Activa 5G', chassis: 'MBLHAW10655DD33333', soldAmount: '35,000', buyAmount: '', date: '30-10-2025', dob: '20-12-1988', phone: '9166666666', aadhaar: '4444 5555 6666', address: 'Some other address', financeAmount: '', emiAmount: '', emiMonths: '', emiDate: '', guarantorName: '', guarantorPhone: '', guarantorAadhaar: '', guarantorAddress: '', referenceName: 'RAJU', referencePhone: '9222222222' },
    { id: 5, seller: 'PRADEEP', buyerName: 'SAI', vehicle: 'AP26VV2654', vehicleName: 'Royal Enfield', model: 'Classic 350', chassis: 'MBLHAW10655DD44444', soldAmount: '35,000', buyAmount: '35,000', date: '30-10-2025', dob: '01-03-1990', phone: '9155555555', aadhaar: '5555 6666 7777', address: 'Address line here', financeAmount: '15000', emiAmount: '1800', emiMonths: '10', emiDate: '15-12-2025', guarantorName: 'VINOD', guarantorPhone: '9144444444', guarantorAadhaar: '6666 7777 8888', guarantorAddress: 'Guarantor addr', referenceName: 'SURESH MAHESH', referencePhone: '9182278505' },
    { id: 6, seller: 'MOULALI', buyerName: '', vehicle: 'AP39XX7508', vehicleName: 'Yamaha FZ', model: 'FZ-S V3', chassis: 'MBLHAW10655DD55555', soldAmount: '35,000', buyAmount: '', date: '30-10-2025', dob: '17-07-1994', phone: '9133333333', aadhaar: '7777 8888 9999', address: 'Another address', financeAmount: '', emiAmount: '', emiMonths: '', emiDate: '', guarantorName: '', guarantorPhone: '', guarantorAadhaar: '', guarantorAddress: '', referenceName: '', referencePhone: '' },
  ]

  const [modalUser, setModalUser] = useState(null)
  const [users, setUsers] = useState(initialUsers) // useState for users so edits persist
  const [editOpen, setEditOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ from: '', to: '', status: 'all' })
  const [deleteUserId, setDeleteUserId] = useState(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setModalUser(null)
    }
    if (modalUser) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalUser])

  function handleSave(updated) {
    if (!updated || !updated.id) return
    setUsers(prev => prev.map(u => (u.id === updated.id ? { ...u, ...updated } : u)))
    setModalUser(updated)
    setEditOpen(false)
  }

  function handleDelete() {
    if (deleteUserId) {
      setUsers(prev => prev.filter(u => u.id !== deleteUserId))
      setDeleteUserId(null)
      setModalUser(null)
    }
  }

  return (
    <div className="p-6">
      {/* hide scrollbar but keep scrolling */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}
      `}</style>

      <div className="md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(s => !s)} aria-expanded={showFilters} className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#a6a6a6" fillRule="evenodd" d="M5 3h14L8.816 13.184a2.7 2.7 0 0 0-.778-1.086c-.228-.198-.547-.377-1.183-.736l-2.913-1.64c-.949-.533-1.423-.8-1.682-1.23C2 8.061 2 7.541 2 6.503v-.69c0-1.326 0-1.99.44-2.402C2.878 3 3.585 3 5 3" clipRule="evenodd"/>
              <path fill="#a6a6a6" d="M22 6.504v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3L8.815 13.184q.075.193.121.403c.064.285.064.619.064 1.286v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.197.545-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988" opacity="0.5"/>
            </svg>
            select filter
          </button>
        </div>

        

        <div className="w-full max-w-sm py-4">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/>
              </svg>
            </div>

            <input
              id="user-search"
              type="search"
              name="search"
              placeholder="Search users..."
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[1px_2px_9px_-4px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>


        
      </div>


      {/* Filter panel (visible after clicking select filter) */}
        {showFilters && (
          <div className="mt-2 mb-4 md:mt-0  w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fill-rule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clip-rule="evenodd"/></svg>              </span>
              <div className="flex items-center gap-2">
                <label className="text-[12px] text-gray-500">Date range</label>
                <input type="date" value={filters.from} onChange={(e)=> setFilters(f=>({...f, from: e.target.value}))} className="text-xs border rounded px-2 py-1" />
                <span className="text-gray-400">—</span>
                <input type="date" value={filters.to} onChange={(e)=> setFilters(f=>({...f, to: e.target.value}))} className="text-xs border rounded px-2 py-1" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M15 16.69V13h1.5v2.82l2.44 1.41l-.75 1.3zM19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2v20l1.5-1.5L6 22l1.5-1.5L9 22l1.58-1.58c.14.19.3.36.47.53A7.001 7.001 0 0 0 21 11.1V2zM11.1 11c-.6.57-1.07 1.25-1.43 2H6v-2zm-2.03 4c-.07.33-.07.66-.07 1s0 .67.07 1H6v-2zM18 9H6V7h12zm2.85 7c0 .64-.12 1.27-.35 1.86c-.26.58-.62 1.14-1.07 1.57c-.43.45-.99.81-1.57 1.07c-.59.23-1.22.35-1.86.35c-2.68 0-4.85-2.17-4.85-4.85c0-1.29.51-2.5 1.42-3.43c.93-.91 2.14-1.42 3.43-1.42c2.67 0 4.85 2.17 4.85 4.85"/></svg>              </span>
              <div className="flex items-center gap-2">
                <label className="text-[12px] text-gray-500">Status</label>
                <select value={filters.status} onChange={(e)=> setFilters(f=>({...f, status: e.target.value}))} className="text-xs border rounded px-2 py-1">
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Buyer Pending</option>
                </select>
              </div>
            </div>

            <div className="ml-auto">
              <button onClick={() => setShowFilters(false)} className="px-3 py-1 text-xs bg-white  rounded">Close</button>
            </div>
          </div>
        )}

      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden ">
        {/* Desktop table */}
        <div className="hidden md:block ">
          <table className="w-full table-auto border-collapse ">
            <thead>
              <tr className="bg-gray-100 text-left ">
                <th className="py-3 px-3 text-base font-semibold rounded-tl-lg">s no</th>
                <th className="py-3 px-3 text-base font-semibold">seller name</th>
                <th className="py-3 px-3 text-base font-semibold">buyer name</th>
                <th className="py-3 px-3 text-base font-semibold">vehicle no</th>
                <th className="py-3 px-3 text-base font-semibold">sold amount</th>
                <th className="py-3 px-3 text-base font-semibold">buy amount</th>
                <th className="py-3 px-3 text-base font-semibold">date</th>
                <th className="py-3 px-3 text-base font-semibold">status</th>
                <th className="py-3 px-3 text-base font-semibold rounded-tr-lg">action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-3 px-3 text-xs">{u.id}</td>
                  <td className="py-3 px-3 text-xs">{u.seller}</td>
                  <td className="py-3 px-3 text-xs">{u.buyerName || '-'}</td>
                  <td className="py-3 px-3 text-xs">{u.vehicle}</td>
                  <td className="py-3 px-3 text-xs">{u.soldAmount}</td>
                  <td className="py-3 px-3 text-xs">{u.buyAmount || '-'}</td>
                  <td className="py-3 px-3 text-xs">{u.date}</td>
                  <td className="py-3 px-3">
                    {u.buyerName ? (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="capitalize text-xs">completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="#92400e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>
                        <span className="capitalize text-xs">buyer pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModalUser(u)} className="p-2 text-gray-700" title="view">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
                      </button>
                      <button onClick={() => setDeleteUserId(u.id)} className="p-2 text-red-600 hover:text-red-800" title="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-lg shadow p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold">{u.id}. {u.seller}</div>
                </div>
                <div className="flex items-center gap-2">
                  {u.buyerName ? (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="capitalize text-xs">completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20"height="20" viewBox="0 0 24 24"><g fill="none" stroke="#92400e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></g></svg>
                      <span className="capitalize text-xs">buyer pending</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div><span className="text-[10px] text-gray-400">Buyer</span><div className="font-medium">{u.buyerName || '-'}</div></div>
                <div><span className="text-[10px] text-gray-400">Vehicle</span><div className="font-medium">{u.vehicle}</div></div>
                <div><span className="text-[10px] text-gray-400">Sold Amount</span><div className="font-medium">{u.soldAmount}</div></div>
                <div><span className="text-[10px] text-gray-400">Buy Amount</span><div className="font-medium">{u.buyAmount || '-'}</div></div>
                <div className="col-span-2"><span className="text-[10px] text-gray-400">Date</span><div className="font-medium">{u.date}</div></div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button onClick={() => setModalUser(u)} className="p-2 text-gray-700" title="view"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg></button>
                <button onClick={() => setDeleteUserId(u.id)} className="p-2 text-red-600 hover:text-red-800" title="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* Pagination / footer */}
        <div className="mt-4 flex justify-end items-center gap-3">
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">previous</button>
          <div className="text-xs">1</div>
          <button className="px-3 py-1 rounded-full bg-gray-100 text-xs">next</button>
        </div>
      </div>

      {/* Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay: disable closing view when editOpen is true */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              if (!editOpen) setModalUser(null)
            }}
          />

          {/* main view: apply visual disabled state when editOpen */}
          <div
            className={
              "relative w-[95%] md:w-3/4 lg:w-2/3 bg-white rounded-2xl p-6 shadow-2xl no-scrollbar max-h-[90vh] overflow-auto " +
              (editOpen ? "pointer-events-none opacity-60 select-none" : "")
            }
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold mb-4">User Details</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditOpen(true)
                  }}
                  className="px-3 py-1 rounded bg-yellow-50 text-sm inline-flex items-center gap-2"
                  aria-label="Edit user"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                    <g className="edit-outline">
                      <g fill="currentColor" fillRule="evenodd" className="Vector" clipRule="evenodd">
                        <path d="M2 6.857A4.857 4.857 0 0 1 6.857 2H12a1 1 0 1 1 0 2H6.857A2.857 2.857 0 0 0 4 6.857v10.286A2.857 2.857 0 0 0 6.857 20h10.286A2.857 2.857 0 0 0 20 17.143V12a1 1 0 1 1 2 0v5.143A4.857 4.857 0 0 1 17.143 22H6.857A4.857 4.857 0 0 1 2 17.143z"/>
                        <path d="m15.137 13.219l-2.205 1.33l-1.033-1.713l2.205-1.33l.003-.002a1.2 1.2 0 0 0 .232-.182l5.01-5.036a3 3 0 0 0 .145-.157c.331-.386.821-1.15.228-1.746c-.501-.504-1.219-.028-1.684.381a6 6 0 0 0-.36.345l-.034.034l-4.94 4.965a1.2 1.2 0 0 0-.27.41l-.824 2.073a.2.2 0 0 0 .29.245l1.032 1.713c-1.805 1.088-3.96-.74-3.18-2.698l.825-2.072a3.2 3.2 0 0 1 .71-1.081l4.939-4.966l.029-.029c.147-.15.641-.656 1.24-1.02c.327-.197.849-.458 1.494-.508c.74-.059 1.53.174 2.15.797a2.9 2.9 0 0 1 .845 1.75a3.15 3.15 0 0 1-.23 1.517c-.29.717-.774 1.244-.987 1.457l-5.01 5.036q-.28.281-.62.487m4.453-7.126s-.004.003-.013.006z"/>
                      </g>
                    </g>
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (!editOpen) setModalUser(null)
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Small CSS to hide scrollbars but keep touch scrolling */}
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none;} .no-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>

            {/* Vehicle details at top */}
            <div className="mb-4">
              <div className="w-full bg-[#edeefe] rounded-xl p-4 shadow">
                <h5 className="text-sm font-semibold mb-2">Vehicle Details</h5>
                <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><span className="text-[12px] text-gray-400">Vehicle Name</span><div className="font-medium">{modalUser.vehicleName || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Vehicle No</span><div className="font-medium">{modalUser.vehicle || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Chassis No</span><div className="font-medium">{modalUser.chassis || '-'}</div></div>
                  <div><span className="text-[12px] text-gray-400">Model</span><div className="font-medium">{modalUser.model || '-'}</div></div>
                </div>
              </div>
            </div>

            <div className="bg-[#E8FCF0] rounded-xl p-6 relative">
              {/* vertical divider between seller and buyer on md+ */}
              <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gray-300" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-center font-semibold mb-4">Seller</h4>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center">IMG</div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Customer Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.seller}</div>
                        <div><strong>DOB:</strong> {modalUser.dob || '-'}</div>
                        <div><strong>Phone:</strong> {modalUser.phone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.aadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.address || '-'}</div></div>
                        <div><strong>Sold Amount:</strong> {modalUser.soldAmount}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Reference</h5>
                      <div className="text-sm text-gray-700">Name: {modalUser.referenceName || '—'}<br/>Phone: {modalUser.referencePhone || '—'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-center font-semibold mb-4">Buyer</h4>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg flex items-center justify-center">IMG</div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Customer Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.buyerName || '-'}</div>
                        <div><strong>DOB:</strong> {modalUser.dob || '-'}</div>
                        <div><strong>Phone:</strong> {modalUser.phone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.aadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.address || '-'}</div></div>
                        <div><strong>Buy Amount:</strong> {modalUser.buyAmount || '-'}</div>
                        {/* vehicle details shown above in Vehicle Details */}
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Finance Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Finance Amount:</strong> {modalUser.financeAmount || '-'}</div>
                        <div><strong>EMI Amount:</strong> {modalUser.emiAmount || '-'}</div>
                        <div><strong>EMI Months:</strong> {modalUser.emiMonths || '15'}</div>
                        <div><strong>EMI Date:</strong> {modalUser.emiDate || '-'}</div>
                      </div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Reference</h5>
                      <div className="text-sm text-gray-700">Name: {modalUser.referenceName || '—'}<br/>Phone: {modalUser.referencePhone || '—'}</div>
                    </div>
                    <div className="w-full bg-white rounded-xl p-4 shadow">
                      <h5 className="text-sm font-semibold mb-2">Guarantor Details</h5>
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><strong>Name:</strong> {modalUser.guarantorName || '-'}</div>
                        <div><strong>Phone:</strong> {modalUser.guarantorPhone || '-'}</div>
                        <div className="flex items-center gap-2"><strong>Aadhar No:</strong> <span>{modalUser.guarantorAadhaar || '-'}</span> <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded">view</span></div>
                        <div><strong>Address:</strong> <div className="text-xs text-gray-600">{modalUser.guarantorAddress || '-'}</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal (separate component) */}
      {editOpen && modalUser && (
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* overlay (dim) */}
          <div className="absolute inset-0 bg-black/40" />

          {/* scroll wrapper: top-aligned, no visible scrollbar, allows natural scrolling */}
          <div className="absolute inset-0 flex items-start justify-center overflow-auto no-scrollbar py-8">
            <EditUserModal
              user={modalUser}
              onSave={handleSave}
              onClose={() => setEditOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteUserId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteUserId(null)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl w-[90%] max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-red-600">
                  <path fill="currentColor" d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8m3.5 4L12 11.5L8.5 8L7 9.5L10.5 13L7 16.5L8.5 18l3.5-3.5l3.5 3.5l1.5-1.5l-3.5-3.5l3.5-3.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Deleting this user will permanently remove both <strong>seller and buyer</strong> records associated with this transaction.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Users