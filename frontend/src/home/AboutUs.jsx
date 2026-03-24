import React from 'react'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'

const values = [
  {
    title: 'Customer First',
    text: 'Every loan plan is built around repayment comfort, transparency, and quick support.',
  },
  {
    title: 'Transparent Process',
    text: 'From document checks to final approval, each step is clear and easy to track.',
  },
  {
    title: 'Trusted Finance Partner',
    text: 'We help riders and families get reliable vehicle finance with practical EMI options.',
  },
]

function AboutUs() {
  return (
    <div>
      <PublicTopNav />

      <section className='mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-[rgba(224,252,237,0.4)] px-6 py-12 md:px-10'>
          <h1 className='text-[2rem] font-black text-[#27563C] md:text-[2.8rem]'>About Us</h1>
          <p className='mt-4 max-w-3xl text-sm font-medium leading-7 text-[#4B5563] md:text-base'>
            SGB Finance is focused on making two-wheeler financing simple, fast, and dependable. We support customers with
            practical plans, quick approvals, and guidance at every stage of the loan journey.
          </p>
          <p className='mt-4 max-w-3xl text-sm font-medium leading-7 text-[#4B5563] md:text-base'>
            Our mission is to remove financing stress with transparent terms and responsible lending, so customers can move
            forward with confidence and clarity.
          </p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <h2 className='text-[1.7rem] font-black text-[#27563C] md:text-[2.2rem]'>Why Customers Trust SGB Finance</h2>
        <div className='mt-6 grid grid-cols-1 gap-5 md:grid-cols-3'>
          {values.map((item) => (
            <article
              key={item.title}
              className='rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'
            >
              <h3 className='text-lg font-extrabold text-[#27563C]'>{item.title}</h3>
              <p className='pt-2 text-sm font-medium leading-7 text-[#737373]'>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutUs
