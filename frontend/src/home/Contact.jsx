import React, { useState } from 'react'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'

function Contact() {
  const [formType, setFormType] = useState('')

  return (
    <div>
      <PublicTopNav />

      <section className='mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-[rgba(224,252,237,0.4)] px-6 py-12 md:px-10'>
          <h1 className='text-[2rem] font-black text-[#27563C] md:text-[2.8rem]'>Contact</h1>
          <p className='mt-4 max-w-3xl text-sm font-medium leading-7 text-[#4B5563] md:text-base'>
            Reach out to our support team for loan guidance, application help, repayment support, or service queries.
          </p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <article className='rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'>
            <h2 className='text-xl font-extrabold text-[#27563C]'>Get In Touch</h2>
            <p className='pt-2 text-sm font-medium text-[#737373] md:text-base'>
              Email: support@sgbfinance.in
            </p>
            <p className='pt-1 text-sm font-medium text-[#737373] md:text-base'>
              Phone: +91 9182278505
            </p>
            <p className='pt-1 text-sm font-medium text-[#737373] md:text-base'>
              Service Hours: Mon - Sat, 9:30 AM to 7:00 PM
            </p>
          </article>

          <article className='rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'>
            <h2 className='text-xl font-extrabold text-[#27563C]'>Support Request</h2>
            <form className='pt-4'>
              <input
                type='text'
                placeholder='Your Name'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <input
                type='email'
                placeholder='Your Email'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <textarea
                rows='4'
                placeholder='Your Message'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <button
                type='button'
                className='mt-4 rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-4 py-2 text-sm font-bold text-[#1E3E2B]'
              >
                Send Message
              </button>
            </form>
          </article>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'>
          <h2 className='text-xl font-extrabold text-[#27563C] mb-6'>Submit Your Request</h2>
          <form className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Form Type Selection */}
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white font-semibold'
            >
              <option value=''>Select Request Type</option>
              <option value='application'>Application Details</option>
              <option value='documentation'>Documentation Guide</option>
              <option value='ticket'>Raise a Ticket</option>
            </select>

            {/* Common Fields - Always Show */}
            <input
              type='text'
              placeholder={formType === 'application' ? 'Applicant Name' : 'Full Name'}
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />
            <input
              type='email'
              placeholder='Email Address'
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />
            <input
              type='tel'
              placeholder='Phone Number'
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />

            {/* Application Details Fields */}
            {formType === 'application' && (
              <>
                <input
                  type='text'
                  placeholder='Application Number'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <input
                  type='text'
                  placeholder='Application Type'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <input
                  type='date'
                  placeholder='dd-mm-yyyy'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <select className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white'>
                  <option value=''>Select Status</option>
                  <option value='pending'>Pending</option>
                  <option value='under-review'>Under Review</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                </select>
                <input
                  type='number'
                  placeholder='Loan Amount'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <textarea
                  rows='3'
                  placeholder='Remarks or Additional Details'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
              </>
            )}

            {/* Documentation Guide Fields */}
            {formType === 'documentation' && (
              <>
                <select className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white'>
                  <option value=''>Select Document Type</option>
                  <option value='identity'>Identity Proof</option>
                  <option value='address'>Address Proof</option>
                  <option value='income'>Income Proof</option>
                  <option value='vehicle'>Vehicle Documents</option>
                  <option value='other'>Other</option>
                </select>
                <textarea
                  rows='3'
                  placeholder='Description of Required Documents'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
              </>
            )}

            {/* Raise a Ticket Fields */}
            {formType === 'ticket' && (
              <>
                <select className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white'>
                  <option value=''>Select Issue Category</option>
                  <option value='application'>Application Issue</option>
                  <option value='payment'>Payment Issue</option>
                  <option value='repayment'>Repayment Query</option>
                  <option value='technical'>Technical Issue</option>
                  <option value='other'>Other</option>
                </select>
                <input
                  type='text'
                  placeholder='Ticket Subject'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <textarea
                  rows='4'
                  placeholder='Describe Your Issue in Detail'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
              </>
            )}

            {/* Submit Button */}
            {formType && (
              <button
                type='button'
                className='col-span-1 md:col-span-2 rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-4 py-2 text-sm font-bold text-[#1E3E2B]'
              >
                {formType === 'application' && 'Submit Application Details'}
                {formType === 'documentation' && 'Request Documentation Guide'}
                {formType === 'ticket' && 'Submit Ticket'}
              </button>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
