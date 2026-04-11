import React, { useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'

const ALLOWED_MONTHS = [6, 10, 12, 15, 18, 24]

function EmiCalculator() {
  const [financeAmount, setFinanceAmount] = useState('')
  const [selectedMonths, setSelectedMonths] = useState(12)
  const printAreaRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: printAreaRef,
    documentTitle: 'emi-calculator',
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 4mm;
      }

      @media print {
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .emi-print-root {
          zoom: 0.7;
          width: 100%;
          padding: 8px !important;
          border-radius: 12px !important;
        }

        .emi-print-root .text-xs {
          font-size: 0.95rem !important;
          line-height: 1.15 !important;
        }

        .emi-print-root .text-sm {
          font-size: 1.03rem !important;
          line-height: 1.18 !important;
        }

        .emi-print-root .text-lg {
          font-size: 1.26rem !important;
          line-height: 1.2 !important;
        }

        .emi-print-root .text-xl {
          font-size: 1.42rem !important;
          line-height: 1.2 !important;
        }

        .emi-print-root h1 {
          font-size: 2.2rem !important;
          line-height: 1.15 !important;
        }

        .emi-print-root h2 {
          font-size: 1.3rem !important;
          line-height: 1.2 !important;
        }

        .emi-grid-print {
          gap: 0.45rem !important;
          margin-top: 0.5rem !important;
        }

        .emi-two-col {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          align-items: start !important;
        }

        .emi-print-tight {
          padding: 0.55rem !important;
        }

        .emi-list-scroll {
          max-height: none !important;
          overflow: visible !important;
          padding-right: 0 !important;
        }

        .emi-no-break {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .emi-print-btn {
          display: none !important;
        }
      }
    `,
  })

  const result = useMemo(() => {
    const amount = Number(financeAmount)

    if (!amount || amount <= 0) {
      return null
    }

    const documents = 2000

    const agreement = amount / 10
    const total = amount + agreement + documents
    const monthlyPercent = (total * 2) / 100

    const activeMonth = ALLOWED_MONTHS.includes(selectedMonths) ? selectedMonths : 12
    const emiForSelectedMonth = Math.floor(total / activeMonth + monthlyPercent)

    const emiList = ALLOWED_MONTHS.filter((month) => month <= activeMonth).map((month) => ({
      month,
      emi: Math.floor(total / month + monthlyPercent),
    }))

    return {
      amount,
      agreement,
      documents,
      total,
      emiForSelectedMonth,
      emiList,
      activeMonth,
    }
  }, [financeAmount, selectedMonths])

  const formatINR = (value) => Number(value || 0).toLocaleString('en-IN')

  return (
    <div className='min-h-screen bg-white'>
      <PublicTopNav />

      <section className='mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8'>
        <div ref={printAreaRef} className='emi-print-root rounded-3xl bg-[rgba(224,252,237,0.4)] p-6 md:p-10'>
          <h1 className='text-[2rem] font-black text-[#27563C] md:text-[2.5rem]'>EMI Calculator</h1>
          <p className='mt-2 text-sm font-medium text-[#4B5563] md:text-base'>
            Enter finance amount to view EMI options.
          </p>

          <div className='mt-6'>
            <label htmlFor='finAmount' className='block text-sm font-bold text-[#27563C]'>
              Finance Amount
            </label>
            <input
              id='finAmount'
              type='number'
              min='0'
              value={financeAmount}
              onChange={(event) => setFinanceAmount(event.target.value)}
              placeholder='Enter amount'
              className='mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-[#1F2937] outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />
          </div>

          {result && (
            <div className='emi-grid-print mt-8 grid grid-cols-1 gap-4'>
              <div className='emi-no-break emi-print-tight rounded-2xl border border-black/10 bg-white p-5'>
                <h2 className='text-lg font-black text-[#27563C]'>Select Months (Scroll)</h2>
                <div className='mt-4'>
                  <input
                    type='range'
                    min='0'
                    max={ALLOWED_MONTHS.length - 1}
                    step='1'
                    value={ALLOWED_MONTHS.indexOf(result.activeMonth)}
                    onChange={(event) => setSelectedMonths(ALLOWED_MONTHS[Number(event.target.value)])}
                    className='w-full accent-[#27563C]'
                  />
                </div>
                <div className='mt-2 flex items-center justify-between text-xs font-semibold text-[#4B5563]'>
                  {ALLOWED_MONTHS.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
                <div className='mt-4 rounded-xl border border-[#27563C]/20 bg-[rgba(224,252,237,0.45)] px-4 py-3'>
                  <p className='text-xs font-bold uppercase tracking-wide text-[#27563C]'>Selected Plan</p>
                  <div className='mt-1 flex items-end justify-between'>
                    <p className='text-sm font-bold text-[#1F2937]'>{result.activeMonth} Months</p>
                    <p className='text-xl font-black text-[#27563C]'>₹{formatINR(result.emiForSelectedMonth)}</p>
                  </div>
                </div>
              </div>

              <div className='emi-grid-print emi-two-col grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='emi-no-break emi-print-tight rounded-2xl border border-black/10 bg-white p-5'>
                  <h2 className='text-lg font-black text-[#27563C]'>EMI List</h2>
                  <p className='mt-1 text-xs font-medium text-[#6B7280]'>Showing plans up to selected month</p>

                  <div className='mt-3 overflow-hidden rounded-xl border border-black/10'>
                    <div className='grid grid-cols-[1fr_auto_1fr] bg-[#F8FAF9] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#4B5563]'>
                      <span>Months</span>
                      <span className='px-2 text-center'></span>
                      <span className='text-right'>Monthly EMI</span>
                    </div>

                    <div className='emi-list-scroll max-h-64 overflow-y-auto pr-1'>
                      {result.emiList.map((item) => (
                        <div
                          key={item.month}
                          className={`grid grid-cols-[1fr_auto_1fr] items-center border-t border-black/10 px-3 py-2 text-sm font-semibold ${
                            item.month === result.activeMonth
                              ? 'bg-[rgba(224,252,237,0.5)] text-[#27563C]'
                              : 'bg-white text-[#4B5563]'
                          }`}
                        >
                          <span>{item.month} Months</span>
                          <span className='px-2 text-center'>X</span>
                          <span className='text-right'>₹{formatINR(item.emi)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='emi-no-break emi-print-tight rounded-2xl border border-black/10 bg-white p-5'>
                  <h2 className='text-lg font-black text-[#27563C]'>Breakdown</h2>
                  <p className='mt-1 text-xs font-medium text-[#6B7280]'>How total payable is calculated</p>

                  <div className='mt-4 space-y-2'>
                    <div className='flex items-center justify-between rounded-lg bg-[#F8FAF9] px-3 py-2'>
                      <span className='text-sm font-semibold text-[#4B5563]'>Finance Amount</span>
                      <span className='text-sm font-bold text-[#1F2937]'>₹{formatINR(result.amount)}</span>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-[#F8FAF9] px-3 py-2'>
                      <span className='text-sm font-semibold text-[#4B5563]'>Agreement (10%)</span>
                      <span className='text-sm font-bold text-[#1F2937]'>₹{formatINR(result.agreement)}</span>
                    </div>
                    <div className='flex items-center justify-between rounded-lg bg-[#F8FAF9] px-3 py-2'>
                      <span className='text-sm font-semibold text-[#4B5563]'>Documents</span>
                      <span className='text-sm font-bold text-[#1F2937]'>₹{formatINR(result.documents)}</span>
                    </div>
                  </div>

                  <div className='emi-no-break emi-print-tight mt-4 rounded-xl border border-[#27563C]/20 bg-[rgba(224,252,237,0.45)] px-4 py-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-bold text-[#27563C]'>Total Amount</span>
                      <span className='text-xl font-black text-[#27563C]'>₹{formatINR(result.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type='button'
                  onClick={() => handlePrint?.()}
                  className='emi-print-btn rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-5 py-2 text-sm font-bold text-[#1E3E2B] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'
                >
                  Print
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default EmiCalculator