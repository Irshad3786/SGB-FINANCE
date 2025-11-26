import React from 'react'

function Users () {
  const users = [
    { id: 1, seller: 'irshad', buyerName: 'raju', vehicle: 'AP39DZ9786', soldAmount: '35000', buyAmount: '35000', date: '30-10-2025' },
    { id: 2, seller: 'suresh', buyerName: '', vehicle: 'AP39YZ8512', soldAmount: '35000', buyAmount: '', date: '30-10-2025' },
    { id: 3, seller: 'rahul', buyerName: 'manu', vehicle: 'AP27AZ9865', soldAmount: '35000', buyAmount: '35000', date: '30-10-2025' },
    { id: 4, seller: 'karthik', buyerName: '', vehicle: 'AP27NN3658', soldAmount: '35000', buyAmount: '', date: '30-10-2025' },
    { id: 5, seller: 'pradeep', buyerName: 'sai', vehicle: 'AP26VV2654', soldAmount: '35000', buyAmount: '35000', date: '30-10-2025' },
    { id: 6, seller: 'moulali', buyerName: '', vehicle: 'AP39XX7508', soldAmount: '35000', buyAmount: '', date: '30-10-2025' },
  ]

  return (
    <div className="p-6">
      <div className="md:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow hover:shadow-md transition-shadow bg-white text-base">
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
              className="w-full pl-10 pr-3 py-3 rounded-3xl border border-transparent bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-[#bff86a] shadow-[0px_4px_10px_-3px_rgba(0,_0,_0,_0.7)]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 md:p-6 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left rounded-lg ">
                <th className="py-3 px-3 text-base font-semibold">s no</th>
                <th className="py-3 px-3 text-base font-semibold">seller name</th>
                <th className="py-3 px-3 text-base font-semibold">buyer name</th>
                <th className="py-3 px-3 text-base font-semibold">vehicle no</th>
                <th className="py-3 px-3 text-base font-semibold">sold amount</th>
                <th className="py-3 px-3 text-base font-semibold">buy amount</th>
                <th className="py-3 px-3 text-base font-semibold">date</th>
                <th className="py-3 px-3 text-base font-semibold">status</th>
                <th className="py-3 px-3 text-base font-semibold">action</th>
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
                      
                      <button className="p-2 text-gray-700" title="view">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>
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
                
                <button className="p-2 text-gray-700" title="view"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#a6a6a6"/><path fill="#a6a6a6" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg></button>
                
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
    </div>
  )
}

export default Users