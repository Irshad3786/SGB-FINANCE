import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Footer() {
  return (
    <div className="bg-[#262626] text-white">
      {/* main */}
      <footer className="max-w-20xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <div className="flex items-start gap-4 flex-col">
              <Logo />
              <div className="pt-1">
                <p className="text-xs text-gray-300">
                  Empowering Your Journey with Easy Vehicle Loans
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-300 max-w-xl ">
              SGB Finance provides seamless and trusted vehicle financing solutions,
              helping individuals and businesses drive their dreams with flexible
              loan options and transparent processes.
            </p>
          </div>

          
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                  <li><a className="hover:text-white" href="/">Home</a></li>
                  <li><a className="hover:text-white" href="/about">About Us</a></li>
                  <li><a className="hover:text-white" href="/services">Services</a></li>
                  <li><a className="hover:text-white" href="/emi-calculator">EMI Calculator</a></li>
                  <li><a className="hover:text-white" href="/signup">Apply Now</a></li>
                  <li><a className="hover:text-white" href="/contact">Contact</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Customer Support</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                  <li><a className="hover:text-white" href="/contact">FAQs</a></li>
                  <li><a className="hover:text-white" href="/contact">Loan Application Help</a></li>
                  <li><a className="hover:text-white" href="/contact">Track Application</a></li>
                  <li><a className="hover:text-white" href="/contact">Raise a Ticket</a></li>
                  <li><Link className="hover:text-white" to="/privacy-policy">Privacy Policy</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Our Services</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                  <li><a className="hover:text-white" href="/services">Two Wheeler Finance</a></li>
                  <li><a className="hover:text-white" href="/services">Used Vehicle Loans</a></li>
                  <li><a className="hover:text-white" href="/services">Loan Against Vehicle</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                  <li>
                    <a className="hover:text-white underline underline-offset-4 break-words break-all" href="mailto:support@sgbfinance.in">
                    support@sgbfinance.in
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-white" href="tel:+919182278505">+91 9182278505</a>
                  </li>
                  </ul>

                  {/* Socials */}
                <div className="mt-5 flex items-center gap-3 flex-wrap">
                {/* Mail */}
                <a
                  aria-label="Email"
                  href="mailto:support@sgbfinance.in"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 36 36" fill="none">
                <path d="M30 6H6C4.35 6 3.015 7.35 3.015 9L3 27C3 28.65 4.35 30 6 30H30C31.65 30 33 28.65 33 27V9C33 7.35 31.65 6 30 6ZM29.4 12.375L18.795 19.005C18.315 19.305 17.685 19.305 17.205 19.005L6.6 12.375C6.44959 12.2906 6.31788 12.1765 6.21283 12.0397C6.10779 11.9029 6.03159 11.7462 5.98886 11.5791C5.94613 11.4119 5.93775 11.2379 5.96423 11.0675C5.99072 10.897 6.0515 10.7337 6.14292 10.5875C6.23434 10.4412 6.35449 10.315 6.49609 10.2165C6.63769 10.118 6.79781 10.0493 6.96674 10.0144C7.13568 9.97963 7.30992 9.97945 7.47893 10.0139C7.64794 10.0484 7.8082 10.1168 7.95 10.215L18 16.5L28.05 10.215C28.1918 10.1168 28.3521 10.0484 28.5211 10.0139C28.6901 9.97945 28.8643 9.97963 29.0333 10.0144C29.2022 10.0493 29.3623 10.118 29.5039 10.2165C29.6455 10.315 29.7657 10.4412 29.8571 10.5875C29.9485 10.7337 30.0093 10.897 30.0358 11.0675C30.0622 11.2379 30.0539 11.4119 30.0111 11.5791C29.9684 11.7462 29.8922 11.9029 29.7872 12.0397C29.6821 12.1765 29.5504 12.2906 29.4 12.375Z" fill="white"/>
                </svg>
                </a>
                {/* Facebook */}
                <a
                  aria-label="Facebook"
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.495V14.708h-3.13v-3.62h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.59l-.467 3.62h-3.123V24h6.116C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  aria-label="Instagram"
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                >
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/>
                    <circle cx="12" cy="12" r="4" stroke="currentColor"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  aria-label="X"
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2H21l-7.5 8.09L22 22h-6.31l-4.95-6.71L5.1 22H2l8.04-9.01L2 2h6.31l4.52 6.02L18.244 2z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  aria-label="WhatsApp"
                  href="#"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* bottom bar */}
      <div className="bg-[#3A3A3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-gray-200 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>© 2025 SGB Finance. All Rights Reserved.</span>
          <span className="opacity-60 hidden sm:inline">|</span>
          <a href="/privacy-policy" className="hover:text-white underline underline-offset-4">Privacy Policy</a>
          <span className="opacity-60 hidden sm:inline">|</span>
          <a href="/terms" className="hover:text-white underline underline-offset-4">Terms</a>
        </div>
      </div>
    </div>
  )
}

export default Footer