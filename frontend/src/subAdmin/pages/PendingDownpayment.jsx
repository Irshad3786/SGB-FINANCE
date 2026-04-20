import React, { useEffect, useState } from 'react'
import apiClient from '../../api/axios';
import { useToast } from '../../components/ToastProvider';

function PendingDownpayment() {
  const [query, setQuery] = useState("");
  const [editingAmount, setEditingAmount] = useState(null);
  const [amountValue, setAmountValue] = useState("");
  const [editingCommitment, setEditingCommitment] = useState(null);
  const [commitmentDate, setCommitmentDate] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCommitmentDate, setFilterCommitmentDate] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalRecords: 0, totalPages: 1, hasPrev: false, hasNext: false });
  const [pendingPayments, setPendingPayments] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setPage(1);
  }, [query, filterCommitmentDate]);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/subadmin/management/pending-payments', {
          params: {
            search: query,
            commitmentDate: filterCommitmentDate,
            page,
            limit: 10,
          },
        });
        setPendingPayments(response?.data?.data || []);
        setPagination(response?.data?.pagination || { page: 1, limit: 10, totalRecords: 0, totalPages: 1, hasPrev: false, hasNext: false });
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to fetch pending payments',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, [showToast, query, filterCommitmentDate, page]);

  const inr = (n) =>
    Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return "-";
    const match = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return String(dateValue);
    const [, year, month, day] = match;
    return `${day}-${month}-${year}`;
  };

  const handleAmountUpdate = async (id) => {
    const parsedAmount = Number(amountValue);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast({ type: 'error', title: 'Error', message: 'Enter valid amount greater than 0' });
      return;
    }

    try {
      const response = await apiClient.patch(`/api/subadmin/management/pending-payments/${id}/amount`, {
        amount: parsedAmount,
      });

      const updatedAmount = Number(response?.data?.data?.amount ?? parsedAmount);
      setPendingPayments((prev) =>
        prev.map((payment) =>
          payment.id === id ? { ...payment, downpaymentAmount: updatedAmount } : payment
        )
      );
      setEditingAmount(null);
      setAmountValue("");
      showToast({ type: 'success', title: 'Updated', message: 'Pending amount updated' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update amount',
      });
    }
  };

  const handleCommitmentUpdate = async (id) => {
    if (!commitmentDate) return;

    try {
      await apiClient.patch(`/api/subadmin/management/pending-payments/${id}/commitment-date`, {
        commitmentDate,
      });

      setPendingPayments((prev) =>
        prev.map((payment) =>
          payment.id === id ? { ...payment, commitmentDate } : payment
        )
      );
      setEditingCommitment(null);
      setCommitmentDate("");
      showToast({ type: 'success', title: 'Updated', message: 'Commitment date updated' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update commitment date',
      });
    }
  };

  const handleStatusChange = (id, status) => {
    if (status === "Paid") {
      setSelectedPaymentId(id);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPaid = async () => {
    if (!selectedPaymentId) return;

    try {
      await apiClient.patch(`/api/subadmin/management/pending-payments/${selectedPaymentId}/status`, {
        status: 'paid',
      });

      setPendingPayments((prev) => prev.filter((payment) => payment.id !== selectedPaymentId));
      setShowConfirmModal(false);
      setSelectedPaymentId(null);
      showToast({ type: 'success', title: 'Success', message: 'Payment marked as paid' });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update payment status',
      });
    }
  };

  const handleCancelPaid = () => {
    setShowConfirmModal(false);
    setSelectedPaymentId(null);
  };

  const getStatusReferenceDate = (payment) =>
    payment?.commitmentDate || payment?.paymentDueDate;

  const getDaysRemaining = (dateValue) => {
    if (!dateValue) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateValue);
    if (Number.isNaN(due.getTime())) return null;
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusClass = (daysRemaining) => {
    if (daysRemaining === null) return "bg-gray-50 text-gray-700 border-gray-200";
    if (daysRemaining < 0) return "bg-red-50 text-red-700 border-red-200";
    if (daysRemaining <= 3) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const getStatusLabel = (daysRemaining) => {
    if (daysRemaining === null) return "Pending";
    if (daysRemaining < 0) return "Overdue";
    if (daysRemaining === 0) return "Due Today";
    return `${daysRemaining}d remaining`;
  };

  return (
    <div className="px-4 md:px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Pending Downpayment</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage pending downpayment amounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="h-10 px-4 rounded-full bg-gray-100 border border-gray-200 flex items-center gap-2 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#a6a6a6" fillRule="evenodd" d="M5 3h14L8.816 13.184a2.7 2.7 0 0 0-.778-1.086c-.228-.198-.547-.377-1.183-.736l-2.913-1.64c-.949-.533-1.423-.8-1.682-1.23C2 8.061 2 7.541 2 6.503v-.69c0-1.326 0-1.99.44-2.402C2.878 3 3.585 3 5 3" clipRule="evenodd"/>
              <path fill="#a6a6a6" d="M22 6.504v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3L8.815 13.184q.075.193.121.403c.064.285.064.619.064 1.286v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .063-1.285a2.68 2.68 0 0 1 .9-1.49c.227-.197.545-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988" opacity="0.5"/>
            </svg>
            Filter
            {filterCommitmentDate && (
              <span className="h-2 w-2 rounded-full bg-lime-500"></span>
            )}
          </button>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#a6a6a6"
                  d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, or address"
              className="h-10 w-64 md:w-80 rounded-full bg-gray-100 border border-gray-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="mt-2 mb-4 w-full md:w-fit bg-[#f0f0fa] rounded-lg p-3 shadow flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <span className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="#a6a6a6" d="M5.75 7.5a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5m1.5.75A.75.75 0 0 1 8 7.5h2.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75M5.75 9.5a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5z"/><path fill="#a6a6a6" fillRule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1M3.5 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1z" clipRule="evenodd"/></svg>
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[12px] text-gray-500">Commitment date</label>
              <input
                type="date"
                value={filterCommitmentDate}
                onChange={(e) => setFilterCommitmentDate(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowFilters(false)} className="px-3 py-1 text-xs bg-white rounded">Close</button>
            <button onClick={() => setFilterCommitmentDate("")} className="px-3 py-1 text-xs bg-white rounded">Clear</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border p-6 text-sm text-gray-500">
          Loading pending payments...
        </div>
      ) : (
      <>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Payment Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Commitment Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No pending payments found
                  </td>
                </tr>
              ) : (
                pendingPayments.map((payment) => {
                  const daysRemaining = getDaysRemaining(getStatusReferenceDate(payment));
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {payment.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                        {payment.address}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingAmount === payment.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              value={amountValue}
                              onChange={(e) => setAmountValue(e.target.value)}
                              className="h-7 w-24 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                            <button
                              onClick={() => handleAmountUpdate(payment.id)}
                              className="h-7 px-2 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingAmount(null);
                                setAmountValue("");
                              }}
                              className="h-7 px-2 rounded border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">₹{inr(payment.downpaymentAmount)}</span>
                            <button
                              onClick={() => {
                                setEditingAmount(payment.id);
                                setAmountValue(String(payment.downpaymentAmount || ""));
                              }}
                              className="h-6 w-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                              title="Edit amount"
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
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDisplayDate(payment.paymentDueDate)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingCommitment === payment.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={commitmentDate}
                              onChange={(e) => setCommitmentDate(e.target.value)}
                              className="h-7 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                            />
                            <button
                              onClick={() => handleCommitmentUpdate(payment.id)}
                              className="h-7 px-2 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCommitment(null);
                                setCommitmentDate("");
                              }}
                              className="h-7 px-2 rounded border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">
                              {formatDisplayDate(payment.commitmentDate)}
                            </span>
                            <button
                              onClick={() => {
                                setEditingCommitment(payment.id);
                                setCommitmentDate(payment.commitmentDate);
                              }}
                              className="h-6 w-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                              title="Edit commitment date"
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
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                          value="Pending"
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-lime-400 ${getStatusClass(daysRemaining)}`}
                        >
                          <option value="Pending">
                            {getStatusLabel(daysRemaining)}
                          </option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {pendingPayments.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-4 text-center text-gray-500">
            No pending payments found
          </div>
        ) : (
          pendingPayments.map((payment) => {
            const daysRemaining = getDaysRemaining(getStatusReferenceDate(payment));
            const statusClass = getStatusClass(daysRemaining);
            return (
              <div key={payment.id} className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{payment.name}</div>
                    <div className="text-sm text-gray-600">{payment.phoneNumber}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusClass}`}>
                    {daysRemaining === null
                      ? "Pending"
                      : daysRemaining < 0
                      ? "Overdue"
                      : daysRemaining === 0
                      ? "Due Today"
                      : `${daysRemaining}d left`}
                  </span>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed">
                  {payment.address}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                  <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1 min-w-[140px]">
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    {editingAmount === payment.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={amountValue}
                          onChange={(e) => setAmountValue(e.target.value)}
                          className="h-8 w-24 px-2 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-lime-400"
                        />
                        <button
                          onClick={() => handleAmountUpdate(payment.id)}
                          className="h-8 px-2 rounded bg-lime-400 text-gray-800 text-xs font-semibold hover:bg-lime-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingAmount(null);
                            setAmountValue("");
                          }}
                          className="h-8 px-2 rounded border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">₹{inr(payment.downpaymentAmount)}</span>
                        <button
                          onClick={() => {
                            setEditingAmount(payment.id);
                            setAmountValue(String(payment.downpaymentAmount || ""));
                          }}
                          className="h-6 w-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                          title="Edit amount"
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
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1 min-w-[140px]">
                    <span className="text-xs text-gray-500">Due</span>
                    <span className="text-sm font-semibold text-gray-900">{formatDisplayDate(payment.paymentDueDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Commitment date</div>
                  {editingCommitment === payment.id ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="date"
                        value={commitmentDate}
                        onChange={(e) => setCommitmentDate(e.target.value)}
                        className="h-9 px-3 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 flex-1"
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleCommitmentUpdate(payment.id)}
                          className="flex-1 sm:flex-initial h-9 px-3 rounded bg-lime-400 text-gray-800 text-sm font-semibold hover:bg-lime-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommitment(null);
                            setCommitmentDate("");
                          }}
                          className="flex-1 sm:flex-initial h-9 px-3 rounded border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800">{formatDisplayDate(payment.commitmentDate)}</span>
                      <button
                        onClick={() => {
                          setEditingCommitment(payment.id);
                          setCommitmentDate(payment.commitmentDate);
                        }}
                        className="h-7 w-7 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                        title="Edit commitment date"
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

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Status</div>
                  <select
                    onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                    value="Pending"
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-lime-400 ${statusClass}`}
                  >
                    <option value="Pending">
                      {getStatusLabel(daysRemaining)}
                    </option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
      </>
      )}

      <div className="mt-5 flex items-center justify-end gap-3">
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">Total Pending Amount</div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{inr(pendingPayments.reduce((sum, p) => sum + p.downpaymentAmount, 0))}
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">Total Customers</div>
          <div className="text-2xl font-bold text-gray-900">
            {pagination?.totalRecords || pendingPayments.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="text-sm text-gray-500 mb-1">Overdue Payments</div>
          <div className="text-2xl font-bold text-red-600">
            {pendingPayments.filter((p) => getDaysRemaining(p.paymentDueDate) < 0).length}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelPaid}
          />
          <div className="relative bg-white w-[90%] max-w-md rounded-2xl border shadow-xl p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-green-600"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Payment
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to mark this payment as paid? This will remove it from the pending list.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelPaid}
                  className="flex-1 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPaid}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-gray-800 font-semibold hover:shadow-lg transition-shadow"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PendingDownpayment;
