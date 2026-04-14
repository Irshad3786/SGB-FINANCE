import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import apiClient from '../../api/axios'
import { useToast } from '../../components/ToastProvider'

function StatCard({ label, value, className, icon, valueClassName = '' }) {
  return (
    <div className={`flex w-full flex-col sm:flex-row sm:items-center items-start justify-between gap-3 border-[2px] border-[#f0f0f0] p-3 sm:p-4 shadow-[7px_9px_7px_-4px_rgba(0,_0,_0,_0.25)] rounded-xl ${className} min-h-[96px] sm:min-h-[72px] hover:shadow-2xl hover:-translate-y-1 transition-all`}>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] sm:text-sm font-semibold text-gray-600 leading-tight">{label}</div>
        <div className={`mt-1 text-xl sm:text-3xl font-bold leading-tight break-words ${valueClassName}`}>{value}</div>
      </div>
      <div className="self-end sm:self-auto flex-shrink-0">
        {icon}
      </div>
    </div>
  )
}

function BarChart({ labels = [], values = [] }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Total Collection',
            data: values,
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',   // Indigo
              'rgba(139, 92, 246, 0.8)',   // Violet
              'rgba(147, 51, 234, 0.8)',   // Purple
              'rgba(168, 85, 247, 0.8)',   // Purple Light
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgb(139, 92, 246)',
              'rgb(147, 51, 234)',
              'rgb(168, 85, 247)',
            ],
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                label: function(context) {
                  return 'Collection: $' + context.parsed.y.toLocaleString()
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString()
                },
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 13,
                  weight: '600'
                }
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [labels, values])

  return <canvas ref={chartRef}></canvas>
}

function PieChart({ done = 0, pending = 0 }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Collection Done', 'Pending Collection'],
          datasets: [{
            data: [done, pending],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',  // Green
              'rgba(239, 68, 68, 0.8)',  // Red
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(239, 68, 68)',
            ],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 13,
                  weight: '600'
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return label + ': $' + value.toLocaleString() + ' (' + percentage + '%)'
                }
              }
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [done, pending])

  return <canvas ref={chartRef}></canvas>
}

export default function Dashboard() {
  const { showToast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [dashboard, setDashboard] = React.useState({
    stats: {
      totalUsers: 0,
      totalSellers: 0,
      totalBuyers: 0,
      financed: 0,
      refinance: 0,
      totalVehicles: 0,
      pendingPayments: 0,
      totalFinancedAmount: 0,
      totalWithHA: 0,
      totalWithoutHA: 0,
    },
    requestSummary: {
      all: 0,
      finance: 0,
      contact: 0,
      support: 0,
      application: 0,
      documentation: 0,
      ticket: 0,
      other: 0,
    },
    charts: {
      monthlyCollection: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [0, 0, 0, 0] },
      collectionDistribution: { collectionDone: 0, pendingCollection: 0 },
    },
  })

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/api/subadmin/management/dashboard')
        const data = response?.data?.data
        if (data) {
          setDashboard(data)
        }
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: error?.response?.data?.message || 'Failed to fetch dashboard data',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [showToast])

  const stats = dashboard?.stats || {}
  const requestSummary = dashboard?.requestSummary || {}
  const monthlyCollection = dashboard?.charts?.monthlyCollection || { labels: [], values: [] }
  const collectionDistribution = dashboard?.charts?.collectionDistribution || { collectionDone: 0, pendingCollection: 0 }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="mb-4 text-sm font-semibold text-gray-500">Loading dashboard...</div>
        )}
        <div className="bg-white rounded-2xl p-4 sm:p-6  border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold">Users Data</h2>
          </div>

          {/* Responsive grid: 1 col mobile, 2 on small/tablet, 3 on md, 4 on lg+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <StatCard
              label="Total Users"
              value={stats.totalUsers || 0}
              className="bg-green-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-green-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="6" r="4" fill="#40ff07"/><path fill="#40ff07" d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total Sellers"
              value={stats.totalSellers || 0}
              className="bg-indigo-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-indigo-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#6e98ff" d="m21.4 14.25l-7.15 7.15q-.3.3-.675.45t-.75.15t-.75-.15t-.675-.45l-8.825-8.825q-.275-.275-.425-.637T2 11.175V4q0-.825.588-1.412T4 2h7.175q.4 0 .775.163t.65.437l8.8 8.825q.3.3.438.675t.137.75t-.137.738t-.438.662M6.5 8q.625 0 1.063-.437T8 6.5t-.437-1.062T6.5 5t-1.062.438T5 6.5t.438 1.063T6.5 8"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total Buyers"
              value={stats.totalBuyers || 0}
              className="bg-amber-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-amber-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffb700" fill-rule="evenodd" d="M2 8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm9 4a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clip-rule="evenodd"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Financed"
              value={stats.financed || 0}
              className="bg-violet-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-violet-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#a06cff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="#a06cff" d="M16.948 9.95L14.998 8v6.587c0 .89-1.077 1.337-1.707.707L11.996 14c-.5-.5-1.701-.8-2.502 0s-.5 2 0 2.5l3.603 4.4A3 3 0 0 0 15.42 22H18a1 1 0 0 0 1-1v-6.1a7 7 0 0 0-2.052-4.95"/><path d="M11 2h2a2 2 0 0 1 2 2v2m-4-4c0 1.333.8 4 4 4m-4-4H9m6 4v6M5 12v2a2 2 0 0 0 2 2h2c0-1.333-.8-4-4-4m0 0V6m4-4H7a2 2 0 0 0-2 2v2m4-4c0 1.333-.8 4-4 4"/><circle cx="10" cy="9" r="1" transform="rotate(90 10 9)"/></g></svg>
                </div>
              )}
            />
          </div>
        </div>

        {/* Request Categories Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 mt-6 border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold">Request Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              label="All Requests"
              value={requestSummary.all || 0}
              className="bg-slate-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-slate-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#475569" d="M4 4h16v12H5.17L4 17.17zM2 2v21l4-4h16V2z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Finance Requests"
              value={requestSummary.finance || 0}
              className="bg-lime-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-lime-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#65a30d" d="M12 1a7 7 0 0 0-7 7v1H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V8a7 7 0 0 0-7-7m-5 8V8a5 5 0 1 1 10 0v1z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Contact Requests"
              value={requestSummary.contact || 0}
              className="bg-sky-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-sky-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#0284c7" d="M12 13c1.657 0 3-1.343 3-3V5a3 3 0 1 0-6 0v5c0 1.657 1.343 3 3 3m5-3a1 1 0 0 0-2 0a3 3 0 0 1-6 0a1 1 0 0 0-2 0a5 5 0 0 0 4 4.9V19H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-4.1A5 5 0 0 0 17 10"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Support Requests"
              value={requestSummary.support || 0}
              className="bg-violet-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-violet-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#7c3aed" d="M12 2a9 9 0 0 0-9 9v6a3 3 0 0 0 3 3h1v-7H6v-2a6 6 0 1 1 12 0v2h-1v7h1a3 3 0 0 0 3-3v-6a9 9 0 0 0-9-9"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Application Requests"
              value={requestSummary.application || 0}
              className="bg-amber-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-amber-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#d97706" d="M7 2h7l5 5v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m6 1.5V8h4.5zM8 12h8v2H8zm0 4h8v2H8z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Documentation Requests"
              value={requestSummary.documentation || 0}
              className="bg-green-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-green-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#16a34a" d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m8 1.5V8h4.5zM8 12h8v2H8zm0 4h8v2H8z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Ticket Requests"
              value={requestSummary.ticket || 0}
              className="bg-orange-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-orange-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ea580c" d="M12 2l3 5l5 1l-3.5 4l1 6l-5.5-2.5L6.5 18l1-6L4 8l5-1z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Other Requests"
              value={requestSummary.other || 0}
              className="bg-gray-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-gray-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#334155" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 15h-2v-2h2Zm0-4h-2V7h2Z"/></svg>
                </div>
              )}
            />
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 mt-6 border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold">Business Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              label="Refinance"
              value={stats.refinance || 0}
              className="bg-cyan-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-cyan-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#0891b2" d="M0 10.5v-1A4.5 4.5 0 0 1 4.5 5h7.586l-2-2L11.5 1.586L15.914 6L11.5 10.414L10.086 9l2-2H4.5a2.5 2.5 0 0 0 0 5H12v2H4.5a4.5 4.5 0 0 1-4.388-3.5z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total Vehicles"
              value={stats.totalVehicles || 0}
              className="bg-blue-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-blue-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="24" viewBox="0 0 17 24"><path fill="#2563eb" d="M8.632 15.526a2.11 2.11 0 0 0-2.106 2.105v4.305a2.106 2.106 0 0 0 4.212 0v-.043v.002v-4.263a2.11 2.11 0 0 0-2.104-2.106z"/><path fill="#2563eb" d="M16.263 2.631H12.21C11.719 1.094 10.303 0 8.631 0S5.544 1.094 5.06 2.604l-.007.027h-4a1.053 1.053 0 0 0 0 2.106h4.053c.268.899.85 1.635 1.615 2.096l.016.009c-2.871.867-4.929 3.48-4.947 6.577v5.528a1.753 1.753 0 0 0 1.736 1.737h1.422v-3a3.737 3.737 0 1 1 7.474 0v3h1.421a1.75 1.75 0 0 0 1.738-1.737v-5.474a6.855 6.855 0 0 0-4.899-6.567l-.048-.012a3.65 3.65 0 0 0 1.625-2.08l.007-.026h4.053a1.056 1.056 0 0 0 1.053-1.053a1.15 1.15 0 0 0-1.104-1.105h-.002zM8.631 5.84a2.106 2.106 0 1 1 2.106-2.106l.001.06c0 1.13-.916 2.046-2.046 2.046l-.063-.001h.003z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Pending Payments"
              value={stats.pendingPayments || 0}
              className="bg-red-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-red-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#dc2626" d="M18.65 19.35L16.5 17.2V14h1v2.79l1.85 1.85zM17 10c.34 0 .67.03 1 .08V5h-2v3H8V5H6v15h4.68A6.995 6.995 0 0 1 17 10m-5-5c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1" opacity="0.3"/><path fill="#dc2626" d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.7 6.7 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2m-6 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"/></svg>
                </div>
              )}
            />
          </div>
        </div>

        {/* Finance Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 mt-6 border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold">Finance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Total Financed Amount"
              value={`₹ ${Number(stats.totalFinancedAmount || 0).toLocaleString('en-IN')}`}
              valueClassName="text-lg sm:text-2xl whitespace-nowrap"
              className="bg-purple-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-purple-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#9333ea" d="M8.692 12.266V6.692h1.616v5.574l-.808-.824zm4.347 2.23V2.692h1.615v10.189zM4.307 16.64v-5.947h1.615v4.331zm-.116 3.911l5.297-5.296l3.55 3.05l6.753-6.754H17.5v-1h4v4h-1v-2.292l-7.438 7.438l-3.55-3.05l-3.904 3.904z"/></svg>
                </div>
              )}
            />

            <StatCard
              label="Total With HA"
              value={`₹ ${Number(stats.totalWithHA || 0).toLocaleString('en-IN')}`}
              valueClassName="text-lg sm:text-2xl whitespace-nowrap"
              className="bg-orange-50"
              icon={(
                <div className="w-10 h-10 border-[1px] border-[#f0f0f0] bg-orange-200 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#ea580c" d="M2.75 2a.75.75 0 0 1 .75.75v12.5c0 .69.56 1.25 1.25 1.25h12.5a.75.75 0 0 1 0 1.5H4.75A2.75 2.75 0 0 1 2 15.25V2.75A.75.75 0 0 1 2.75 2M10 7.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m4.5.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m.5 4.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0"/></svg>
                </div>
              )}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold">Monthly Collection Overview</h2>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <BarChart labels={monthlyCollection.labels || []} values={monthlyCollection.values || []} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow-[0px_6px_7px_-4px_rgba(0,_0,_0,_0.25)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-extrabold">Collection Distribution</h2>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <PieChart done={collectionDistribution.collectionDone || 0} pending={collectionDistribution.pendingCollection || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}