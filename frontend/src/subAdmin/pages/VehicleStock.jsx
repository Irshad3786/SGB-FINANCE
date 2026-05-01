import React, { useEffect, useState } from 'react'
import apiClient from '../../api/axios';
import { useToast } from '../../components/ToastProvider';

function VehicleStock() {
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState(null);
  const [addingWorkTo, setAddingWorkTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalRecords: 0, totalPages: 1, hasPrev: false, hasNext: false });
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [selectedSoldVehicle, setSelectedSoldVehicle] = useState(null);
  const [newWork, setNewWork] = useState({ title: "", amount: "", date: "", lastModified: "" });
  const [editingWork, setEditingWork] = useState(null);
  const [editedWork, setEditedWork] = useState({ index: null, title: "", amount: "", date: "", lastModified: "" });
  const [stock, setStock] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    const fetchVehicleStock = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/subadmin/management/vehicle-stock', {
          params: {
            search: query,
            page,
            limit: 9,
          },
        });
        setStock(response?.data?.data || []);
        setPagination(response?.data?.pagination || { page: 1, limit: 9, totalRecords: 0, totalPages: 1, hasPrev: false, hasNext: false });
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to load vehicle stock',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleStock();
  }, [showToast, query, page]);

  const inr = (n) =>
    Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const totalWork = (details) =>
    details.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const handleMarkSold = async (sellerId) => {
    try {
      await apiClient.patch(`/api/subadmin/management/vehicle-stock/${sellerId}/sold`);
      setStock((prev) => prev.filter((item) => item.id !== sellerId));
      if (modalItem?.id === sellerId) {
        setModalItem(null);
      }
      showToast({ type: 'success', title: 'Sold', message: 'Vehicle marked as sold' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to mark vehicle as sold',
      });
    }
  };

  const openSoldConfirm = (item) => {
    setSelectedSoldVehicle(item);
    setShowSoldConfirm(true);
  };

  const closeSoldConfirm = () => {
    setShowSoldConfirm(false);
    setSelectedSoldVehicle(null);
  };

  const confirmMarkSold = async () => {
    if (!selectedSoldVehicle?.id) return;
    await handleMarkSold(selectedSoldVehicle.id);
    closeSoldConfirm();
  };

  const applyUpdatedWork = (sellerId, workDetails, workCost) => {
    setStock((prev) =>
      prev.map((item) =>
        item.id === sellerId ? { ...item, workDetails, workCost } : item
      )
    );

    setModalItem((prev) => {
      if (!prev || prev.id !== sellerId) return prev;
      return { ...prev, workDetails, workCost };
    });
  };

  const handleUpdateSpare = async (index, originalWork) => {
    if (!editedWork.title || editedWork.amount === "") return;

    try {
      const response = await apiClient.put(
        `/api/subadmin/management/vehicle-stock/${modalItem.id}/spares/${index}`,
        {
          title: editedWork.title,
          amount: Number(editedWork.amount),
          date: editedWork.date || originalWork.date,
        }
      );

      const data = response?.data?.data;
      applyUpdatedWork(modalItem.id, data?.workDetails || [], Number(data?.workCost || 0));
      setEditingWork(null);
      setEditedWork({ index: null, title: "", amount: "", date: "", lastModified: "" });
      showToast({ type: 'success', title: 'Updated', message: 'Spare updated successfully' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update spare',
      });
    }
  };

  const handleAddSpare = async () => {
    if (!newWork.title || newWork.amount === "") return;

    try {
      const response = await apiClient.post(
        `/api/subadmin/management/vehicle-stock/${modalItem.id}/spares`,
        {
          title: newWork.title,
          amount: Number(newWork.amount),
          date: newWork.date,
        }
      );

      const data = response?.data?.data;
      applyUpdatedWork(modalItem.id, data?.workDetails || [], Number(data?.workCost || 0));
      setNewWork({ title: "", amount: "", date: "", lastModified: "" });
      setAddingWorkTo(null);
      showToast({ type: 'success', title: 'Added', message: 'Spare added successfully' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to add spare',
      });
    }
  };

  return (
    <div className="px-4 md:px-6 py-4 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Bike Stock</h1>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-auto flex-1 md:flex-initial">
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
              placeholder="search vehicle"
              className="h-10 w-full md:w-64 rounded-full bg-gray-100 border border-gray-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading vehicle stock...</div>
      ) : (
        stock.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-14 text-center text-sm text-gray-500">
            No vehicle in stock.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stock.map((item) => {
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
                    <div className="text-[10px] text-gray-500">Model: {item.modelYear || '-'}</div>
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
                          width="14"
                          height="14"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="currentColor"
                            d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
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

                    <div className="flex items-start justify-between pt-2 gap-3">
                      <div className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold">Total</span>
                        <span>:</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-semibold">
                          {inr(total)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openSoldConfirm(item)}
                        className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[11px] font-semibold hover:bg-black"
                      >
                        Sold
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      <div className="mt-5 flex flex-wrap items-center justify-center md:justify-end gap-3">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!pagination?.hasPrev}
          className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50"
        >
          previous
        </button>
        <div className="text-xs text-gray-600">
          {pagination?.page || page} / {pagination?.totalPages || 1}
        </div>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!pagination?.hasNext}
          className="px-3 py-1 rounded-full bg-gray-100 text-xs disabled:opacity-50"
        >
          next
        </button>
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
                className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 inline-flex items-center justify-center"
                onClick={() => setModalItem(null)}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                {modalItem.workDetails.map((w, idx) => (
                  <div key={idx}>
                    {editingWork === idx ? (
                      <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editedWork.title}
                            onChange={(e) => setEditedWork({ ...editedWork, title: e.target.value })}
                            placeholder="Work title"
                            className="col-span-2 h-7 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                          />
                          <input
                            type="number"
                            value={editedWork.amount}
                            onChange={(e) => setEditedWork({ ...editedWork, amount: e.target.value })}
                            placeholder="Amount"
                            className="h-7 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                          />
                          <input
                            type="date"
                            value={editedWork.date}
                            onChange={(e) => setEditedWork({ ...editedWork, date: e.target.value })}
                            className="h-7 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateSpare(idx, w)}
                            className="flex-1 h-7 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWork(null);
                              setEditedWork({ index: null, title: "", amount: "", date: "", lastModified: "" });
                            }}
                            className="flex-1 h-7 rounded border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm group border-b pb-2 last:border-b-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">{w.name}</span>
                            <span className="font-semibold text-gray-900">{inr(w.amount)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span>Date: {w.date || 'N/A'}</span>
                            {w.lastModified && w.lastModified !== w.date && (
                              <span className="ml-3">Modified: {w.lastModified}</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWork(idx);
                            setEditedWork({ 
                              index: idx, 
                              title: w.name, 
                              amount: w.amount,
                              date: w.date,
                              lastModified: w.lastModified 
                            });
                          }}
                          className="h-6 w-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    )}
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
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newWork.amount}
                      onChange={(e) => setNewWork({ ...newWork, amount: e.target.value })}
                      placeholder="Amount"
                      className="h-8 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                    <input
                      type="date"
                      value={newWork.date}
                      onChange={(e) => setNewWork({ ...newWork, date: e.target.value })}
                      className="h-8 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddSpare}
                      className="flex-1 h-8 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingWorkTo(null);
                        setNewWork({ title: "", amount: "", date: "", lastModified: "" });
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
                      onClick={() => {
                        setAddingWorkTo(modalItem.id);
                        setNewWork({ title: "", amount: "", date: getTodayDate(), lastModified: "" });
                      }}
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

      {showSoldConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSoldConfirm}
          />
          <div className="relative bg-white w-[90%] max-w-md rounded-2xl border shadow-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Sold
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure this vehicle is sold? It will be removed from this list.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeSoldConfirm}
                  className="flex-1 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkSold}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-800 font-semibold hover:shadow-lg transition-shadow"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleStock
