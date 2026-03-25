import React from 'react'
import { useNavigate } from 'react-router-dom'

function Terms() {
  const navigate = useNavigate()

  return (
    <section className='min-h-screen bg-[linear-gradient(180deg,#F7FFF9_0%,#FFFFFF_55%,#EFFCEE_100%)] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0px_12px_30px_rgba(0,_0,_0,_0.08)] sm:p-8 md:p-10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h1 className='text-3xl font-black text-[#27563C] sm:text-4xl'>Terms and Conditions</h1>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='rounded-lg bg-[#E0FCED] px-4 py-2 text-sm font-bold text-[#1E3E2B] transition hover:bg-[#C9F8DE]'
            >
              Back to Home
            </button>
          </div>

          <p className='mt-4 text-sm font-medium text-[#5C5C5C]'>
            Effective Date: March 25, 2026
          </p>

          <div className='mt-8 space-y-6 text-sm leading-7 text-[#4F4F4F] sm:text-base'>
            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>1. Acceptance of Terms</h2>
              <p className='mt-2'>
                By using SGB Finance services, website, or loan application channels, you agree to these terms and all applicable
                policies.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>2. Eligibility and Accuracy</h2>
              <p className='mt-2'>
                You must provide accurate and complete details while applying for finance products. Submission of false or misleading
                information can lead to rejection or cancellation.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>3. Loan Approval and Disbursal</h2>
              <p className='mt-2'>
                Loan approvals are subject to internal verification, credit evaluation, and policy checks. Approval, tenure,
                interest rate, and disbursal timelines may vary by profile.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>4. Repayment Responsibility</h2>
              <p className='mt-2'>
                Borrowers are responsible for timely repayment of EMIs and all contractual dues. Delays may attract penalties and
                impact credit standing.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>5. Changes to Services or Terms</h2>
              <p className='mt-2'>
                We may modify service offerings, policies, or these terms when required. Updated terms become effective once published
                on official channels.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>6. Contact</h2>
              <p className='mt-2'>
                For terms-related questions, contact us at support@sgbfinance.in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Terms
