import React from 'react'
import { useNavigate } from 'react-router-dom'

function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <section className='min-h-screen bg-[linear-gradient(180deg,#F7FFF9_0%,#FFFFFF_55%,#EFFCEE_100%)] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='rounded-3xl border border-black/10 bg-white/90 p-6 shadow-[0px_12px_30px_rgba(0,_0,_0,_0.08)] sm:p-8 md:p-10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h1 className='text-3xl font-black text-[#27563C] sm:text-4xl'>Privacy Policy</h1>
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
              <h2 className='text-lg font-extrabold text-[#27563C]'>1. Information We Collect</h2>
              <p className='mt-2'>
                We collect details you provide during loan inquiry, registration, and communication, such as your name, phone number,
                email, address, KYC details, and finance-related documents.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>2. How We Use Your Information</h2>
              <p className='mt-2'>
                Your information is used to process loan applications, verify identity, communicate updates, improve customer support,
                and comply with regulatory and legal requirements.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>3. Data Sharing</h2>
              <p className='mt-2'>
                We may share relevant data with authorized partners, credit bureaus, and service providers strictly for financing,
                verification, and compliance purposes. We do not sell personal data.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>4. Data Protection</h2>
              <p className='mt-2'>
                We apply reasonable administrative and technical safeguards to protect personal information from unauthorized access,
                alteration, disclosure, or misuse.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>5. Your Rights</h2>
              <p className='mt-2'>
                You may request updates or corrections to your personal information by contacting us. We will act on valid requests as
                per applicable laws and internal policies.
              </p>
            </div>

            <div>
              <h2 className='text-lg font-extrabold text-[#27563C]'>6. Contact</h2>
              <p className='mt-2'>
                For privacy concerns, contact us at support@sgbfinance.in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
