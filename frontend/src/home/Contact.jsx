import React, { useState } from 'react'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'
import apiClient from '../api/axios'
import { useToast } from '../components/ToastProvider'

function Contact() {
  const [formType, setFormType] = useState('')
  const { showToast } = useToast()
  const [supportLoading, setSupportLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    applicationNumber: '',
    applicationType: '',
    applicationDate: '',
    applicationStatus: '',
    loanAmount: '',
    remarks: '',
    issueCategory: '',
    ticketSubject: '',
    issueDescription: '',
  })

  const handleSupportChange = (e) => {
    const { name, value } = e.target
    setSupportForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequestChange = (e) => {
    const { name, value } = e.target
    setRequestForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetRequestForm = () => {
    setRequestForm({
      name: '',
      email: '',
      phoneNumber: '',
      applicationNumber: '',
      applicationType: '',
      applicationDate: '',
      applicationStatus: '',
      loanAmount: '',
      remarks: '',
      issueCategory: '',
      ticketSubject: '',
      issueDescription: '',
    })
  }

  const handleSupportSubmit = async (e) => {
    e.preventDefault()
    if (!supportForm.name || !supportForm.email || !supportForm.message) {
      showToast({ type: 'error', title: 'Validation Error', message: 'Please fill all support fields' })
      return
    }

    try {
      setSupportLoading(true)
      await apiClient.post('/api/user/requests/contact', {
        requestType: 'support',
        name: supportForm.name,
        email: supportForm.email,
        message: supportForm.message,
        subject: 'Support Request',
      })

      showToast({ type: 'success', title: 'Submitted', message: 'Support request submitted successfully' })
      setSupportForm({ name: '', email: '', message: '' })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed',
        message: error?.response?.data?.message || 'Failed to submit support request',
      })
    } finally {
      setSupportLoading(false)
    }
  }

  const handleMainSubmit = async (e) => {
    e.preventDefault()

    if (!formType) {
      showToast({ type: 'error', title: 'Validation Error', message: 'Please select request type' })
      return
    }

    if (!requestForm.name || !requestForm.email || !requestForm.phoneNumber) {
      showToast({ type: 'error', title: 'Validation Error', message: 'Name, email and phone are required' })
      return
    }

    const requestType = formType === 'ticket' ? 'ticket' : 'application'

    const payload = {
      requestType,
      name: requestForm.name,
      email: requestForm.email,
      phoneNumber: requestForm.phoneNumber,
      purpose: requestType,
      subject:
        requestType === 'application'
          ? requestForm.applicationType || 'Application Details'
          : requestForm.ticketSubject || 'Raise a Ticket',
      message:
        requestType === 'application'
          ? requestForm.remarks
          : requestForm.issueDescription,
      extraData: {
        applicationNumber: requestForm.applicationNumber,
        applicationDate: requestForm.applicationDate,
        applicationStatus: requestForm.applicationStatus,
        loanAmount: requestForm.loanAmount ? Number(requestForm.loanAmount) : 0,
        issueCategory: requestForm.issueCategory,
      },
    }

    try {
      setSubmitLoading(true)
      await apiClient.post('/api/user/requests/contact', payload)
      showToast({ type: 'success', title: 'Submitted', message: 'Your request has been submitted' })
      setFormType('')
      resetRequestForm()
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed',
        message: error?.response?.data?.message || 'Failed to submit request',
      })
    } finally {
      setSubmitLoading(false)
    }
  }

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
            <form className='pt-4' onSubmit={handleSupportSubmit}>
              <input
                type='text'
                name='name'
                value={supportForm.name}
                onChange={handleSupportChange}
                placeholder='Your Name'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <input
                type='email'
                name='email'
                value={supportForm.email}
                onChange={handleSupportChange}
                placeholder='Your Email'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <textarea
                rows='4'
                name='message'
                value={supportForm.message}
                onChange={handleSupportChange}
                placeholder='Your Message'
                className='mb-3 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
              />
              <button
                type='submit'
                disabled={supportLoading}
                className='mt-4 rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-4 py-2 text-sm font-bold text-[#1E3E2B]'
              >
                {supportLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </article>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'>
          <h2 className='text-xl font-extrabold text-[#27563C] mb-6'>Submit Your Request</h2>
          <form className='grid grid-cols-1 md:grid-cols-2 gap-4' onSubmit={handleMainSubmit}>
            {/* Form Type Selection */}
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white font-semibold'
            >
              <option value=''>Select Request Type</option>
              <option value='application'>Application Details</option>
              <option value='ticket'>Raise a Ticket</option>
            </select>

            {/* Common Fields - Always Show */}
            <input
              type='text'
              name='name'
              value={requestForm.name}
              onChange={handleRequestChange}
              placeholder={formType === 'application' ? 'Applicant Name' : 'Full Name'}
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />
            <input
              type='email'
              name='email'
              value={requestForm.email}
              onChange={handleRequestChange}
              placeholder='Email Address'
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />
            <input
              type='tel'
              name='phoneNumber'
              value={requestForm.phoneNumber}
              onChange={handleRequestChange}
              placeholder='Phone Number'
              className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
            />

            {/* Application Details Fields */}
            {formType === 'application' && (
              <>
                <input
                  type='text'
                  name='applicationNumber'
                  value={requestForm.applicationNumber}
                  onChange={handleRequestChange}
                  placeholder='Application Number'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <input
                  type='text'
                  name='applicationType'
                  value={requestForm.applicationType}
                  onChange={handleRequestChange}
                  placeholder='Application Type'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <input
                  type='date'
                  name='applicationDate'
                  value={requestForm.applicationDate}
                  onChange={handleRequestChange}
                  placeholder='dd-mm-yyyy'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <select name='applicationStatus' value={requestForm.applicationStatus} onChange={handleRequestChange} className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white'>
                  <option value=''>Select Status</option>
                  <option value='pending'>Pending</option>
                  <option value='under-review'>Under Review</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                </select>
                <input
                  type='number'
                  name='loanAmount'
                  value={requestForm.loanAmount}
                  onChange={handleRequestChange}
                  placeholder='Loan Amount'
                  className='rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <textarea
                  rows='3'
                  name='remarks'
                  value={requestForm.remarks}
                  onChange={handleRequestChange}
                  placeholder='Remarks or Additional Details'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
              </>
            )}

            {/* Raise a Ticket Fields */}
            {formType === 'ticket' && (
              <>
                <select name='issueCategory' value={requestForm.issueCategory} onChange={handleRequestChange} className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88] bg-white'>
                  <option value=''>Select Issue Category</option>
                  <option value='application'>Application Issue</option>
                  <option value='payment'>Payment Issue</option>
                  <option value='repayment'>Repayment Query</option>
                  <option value='technical'>Technical Issue</option>
                  <option value='other'>Other</option>
                </select>
                <input
                  type='text'
                  name='ticketSubject'
                  value={requestForm.ticketSubject}
                  onChange={handleRequestChange}
                  placeholder='Ticket Subject'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
                <textarea
                  rows='4'
                  name='issueDescription'
                  value={requestForm.issueDescription}
                  onChange={handleRequestChange}
                  placeholder='Describe Your Issue in Detail'
                  className='col-span-1 md:col-span-2 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
                />
              </>
            )}

            {/* Submit Button */}
            {formType && (
              <button
                type='submit'
                disabled={submitLoading}
                className='col-span-1 md:col-span-2 rounded-xl border-[2px] border-black bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-4 py-2 text-sm font-bold text-[#1E3E2B]'
              >
                {submitLoading
                  ? 'Submitting...'
                  : formType === 'application'
                  ? 'Submit Application Details'
                  : 'Submit Ticket'}
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
