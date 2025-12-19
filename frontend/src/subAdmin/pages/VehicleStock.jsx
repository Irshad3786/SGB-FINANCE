import React, { useMemo, useState } from 'react'

function VehicleStock() {
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [addingWorkTo, setAddingWorkTo] = useState(null);
  const [newWork, setNewWork] = useState({ title: "", amount: "" });
  const [stock, setStock] = useState([
    {
      id: 1,
      modelName: "SPLENDOR PLUS",
      regNo: "AP39D29786",
      chassisNo: "MBLHA10W55DFB2156",
      modelYear: 2022,
      bikePrice: 45000,
      workCost: 15000,
      sellerName: "Rajesh Kumar",
      sellerPhone: "+91 98765 43210",
      sellerEmail: "rajesh@example.com",
      workDetails: [
        { name: "Engine Oil", amount: 700 },
        { name: "General Service", amount: 1500 },
        { name: "Tyres", amount: 5000 },
        { name: "Battery", amount: 2000 },
        { name: "Labour", amount: 4000 },
        { name: "Miscellaneous", amount: 1800 },
      ],
    },
    {
      id: 2,
      modelName: "SPLENDOR PLUS",
      regNo: "AP39DZ9786",
      chassisNo: "MBLHA10W55DFB2156",
      modelYear: 2022,
      bikePrice: 45000,
      workCost: 15000,
      sellerName: "Priya Singh",
      sellerPhone: "+91 98765 43211",
      sellerEmail: "priya@example.com",
      workDetails: [
        { name: "Engine Oil", amount: 700 },
        { name: "General Service", amount: 1500 },
        { name: "Tyres", amount: 5000 },
        { name: "Battery", amount: 2000 },
        { name: "Labour", amount: 4000 },
        { name: "Miscellaneous", amount: 1800 },
      ],
    },
    {
      id: 3,
      modelName: "SPLENDOR PLUS",
      regNo: "AP39DZ9786",
      chassisNo: "MBLHA10W55DFB2156",
      modelYear: 2022,
      bikePrice: 45000,
      workCost: 15000,
      sellerName: "Amit Patel",
      sellerPhone: "+91 98765 43212",
      sellerEmail: "amit@example.com",
      workDetails: [
        { name: "Engine Oil", amount: 700 },
        { name: "General Service", amount: 1500 },
        { name: "Tyres", amount: 5000 },
        { name: "Battery", amount: 2000 },
        { name: "Labour", amount: 4000 },
        { name: "Miscellaneous", amount: 1800 },
      ],
    },
    {
      id: 4,
      modelName: "SPLENDOR PLUS",
      regNo: "AP39DZ9786",
      chassisNo: "MBLHA10W55DFB2156",
      modelYear: 2022,
      bikePrice: 45000,
      workCost: 15000,
      sellerName: "Deepak Sharma",
      sellerPhone: "+91 98765 43213",
      sellerEmail: "deepak@example.com",
      workDetails: [
        { name: "Engine Oil", amount: 700 },
        { name: "General Service", amount: 1500 },
        { name: "Tyres", amount: 5000 },
        { name: "Battery", amount: 2000 },
        { name: "Labour", amount: 4000 },
        { name: "Miscellaneous", amount: 1800 },
      ],
    },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter((s) =>
      [s.modelName, s.regNo, s.chassisNo]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, stock]);

  const inr = (n) =>
    Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const totalWork = (details) =>
    details.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div className="px-4 md:px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Bike Stock</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path fill="#a6a6a6" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search user"
              className="h-10 w-56 md:w-64 rounded-full bg-gray-100 border border-gray-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const total = item.bikePrice + item.workCost;
          return (
            <div
              key={item.id}
              className="bg-white border rounded-2xl p-4 shadow-sm"
            >
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <div className="text-xs md:text-sm font-semibold text-gray-800 tracking-wide">
                  {item.modelName}
                </div>
                <div className="text-[11px] md:text-xs font-semibold text-gray-800 mt-0.5">
                  {item.regNo}
                </div>
                <div className="text-[10px] text-gray-500 leading-tight">
                  {item.chassisNo}
                </div>
                <div className="text-[10px] text-gray-500">Model: {item.modelYear}</div>
              </div>

              <div className="mt-3 text-[12px] md:text-sm">
                <div className="flex items-center justify-between py-1">
                  <div className="text-gray-700">
                    <span className="font-semibold">Bike Price</span> : {inr(item.bikePrice)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalItem(item)}
                    className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M3 12h18v2H3zm0 4h18v2H3zm0-8h18v2H3z"
                      />
                    </svg>
                    <span>open list</span>
                  </button>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="text-gray-700">
                    <span className="font-semibold">Work</span> : {inr(item.workCost)}
                  </div>
                  <div className="invisible">.</div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-gray-700">
                    <span className="font-semibold">Total</span> :
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-semibold">
                    {inr(total)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalItem(null)}
          />
          <div className="relative bg-white w-[90%] max-w-lg rounded-2xl border shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <div>
                <div className="text-base md:text-lg font-semibold">Used Work Details</div>
                <div className="text-xs text-gray-500">
                  {modalItem.modelName} • {modalItem.regNo}
                </div>
              </div>
              <button
                type="button"
                className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setModalItem(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                {modalItem.workDetails.map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{w.name}</span>
                    <span className="font-semibold">{inr(w.amount)}</span>
                  </div>
                ))}
              </div>

              {addingWorkTo === modalItem.id ? (
                <div className="mt-4 pt-3 border-t space-y-2">
                  <input
                    type="text"
                    value={newWork.title}
                    onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                    placeholder="Work title"
                    className="w-full h-8 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <input
                    type="number"
                    value={newWork.amount}
                    onChange={(e) => setNewWork({ ...newWork, amount: e.target.value })}
                    placeholder="Amount"
                    className="w-full h-8 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (newWork.title && newWork.amount) {
                          const updatedStock = stock.map((v) => {
                            if (v.id === modalItem.id) {
                              return {
                                ...v,
                                workDetails: [
                                  ...v.workDetails,
                                  { name: newWork.title, amount: Number(newWork.amount) },
                                ],
                              };
                            }
                            return v;
                          });
                          setStock(updatedStock);
                          setModalItem({
                            ...modalItem,
                            workDetails: updatedStock.find((v) => v.id === modalItem.id).workDetails,
                          });
                          setNewWork({ title: "", amount: "" });
                          setAddingWorkTo(null);
                        }
                      }}
                      className="flex-1 h-8 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingWorkTo(null);
                        setNewWork({ title: "", amount: "" });
                      }}
                      className="flex-1 h-8 rounded border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t flex items-center justify-between flex-shrink-0">
                  <div className="text-sm">
                    <span className="text-gray-700 font-semibold">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[12px] font-semibold">
                      {inr(totalWork(modalItem.workDetails))}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddingWorkTo(modalItem.id)}
                      className="h-8 w-8 rounded bg-lime-400 text-gray-800 font-semibold hover:bg-lime-500 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleStock
