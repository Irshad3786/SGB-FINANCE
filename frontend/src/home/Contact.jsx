import React from 'react'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'

function Contact() {
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
                className='w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#9EEA88]'
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

      <Footer />
    </div>
  )
}

export default Contact
