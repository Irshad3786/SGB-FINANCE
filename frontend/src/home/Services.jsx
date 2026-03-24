import React from 'react'
import PublicTopNav from './components/PublicTopNav'
import Footer from './components/Footer'

const serviceCards = [
  {
    title: 'Two Wheeler Loan',
    description: 'Flexible tenure and quick disbursal for new or used bike purchases.',
  },
  {
    title: 'Refinance Options',
    description: 'Reduce EMI pressure with revised plans based on your repayment profile.',
  },
  {
    title: 'Low Interest Plans',
    description: 'Transparent rates with practical repayment terms and no hidden surprises.',
  },
  {
    title: 'Quick Approval',
    description: 'Fast verification workflow so customers can proceed without long delays.',
  },
]

const flow = [
  'Apply online with basic details',
  'Get document verification and approval call',
  'Receive finance and complete your vehicle purchase',
]

function Services() {
  return (
    <div>
      <PublicTopNav />

      <section className='mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-[rgba(224,252,237,0.4)] px-6 py-12 md:px-10'>
          <h1 className='text-[2rem] font-black text-[#27563C] md:text-[2.8rem]'>Our Services</h1>
          <p className='mt-4 max-w-3xl text-sm font-medium leading-7 text-[#4B5563] md:text-base'>
            SGB Finance offers customer-focused vehicle financing services designed for speed, affordability, and clear
            repayment visibility.
          </p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {serviceCards.map((card) => (
            <article
              key={card.title}
              className='rounded-2xl border border-black/10 bg-[rgba(246,246,246,0.55)] p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'
            >
              <h3 className='text-lg font-extrabold text-[#27563C]'>{card.title}</h3>
              <p className='pt-2 text-sm font-medium leading-7 text-[#737373]'>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8'>
        <div className='rounded-3xl border border-black/10 bg-white/80 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)] md:p-8'>
          <h2 className='text-[1.6rem] font-black text-[#27563C] md:text-[2rem]'>How Service Delivery Works</h2>
          <ul className='mt-4 space-y-3'>
            {flow.map((step) => (
              <li key={step} className='text-sm font-medium text-[#4B5563] md:text-base'>
                • {step}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Services
