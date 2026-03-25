import React, { useEffect, useRef, useState } from 'react'
import Logo from './components/Logo'
import FinanceTestimonials from './components/FinanceTestimonials'
import Footer from './components/Footer'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const serviceCards = [
  {
    title: 'Two Wheeler Loan',
    description: 'Flexible tenure and quick disbursal for your next bike purchase.',
    details: 'Our two-wheeler loan helps you finance new or used bikes with flexible tenure, competitive EMI plans, and quick processing. We guide you from eligibility check to final disbursal so you can complete your purchase without delay and with full clarity on repayment terms.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="m18 14l-1-3" />
          <path d="M3 9l6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81" />
          <path d="M8 17h3a1 1 0 0 0 1-1a6 6 0 0 1 6-6a1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5" />
          <circle cx="19" cy="17" r="3" />
          <circle cx="5" cy="17" r="3" />
        </g>
      </svg>
    ),
  },
  {
    title: 'Refinance Options',
    description: 'Lower your EMI burden with refinancing plans designed for you.',
    details: 'Refinancing lets you restructure your existing vehicle loan to reduce EMI pressure and improve monthly cash flow. Based on your repayment history and profile, we offer revised plans that are easier to manage while keeping the process transparent and hassle-free.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3.75 10.5a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75zm10.5 0a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75zm-10.5 10.5a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75zm10.5 0a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75z"
        />
      </svg>
    ),
  },
  {
    title: 'Low Interest Plans',
    description: 'Competitive rates with transparent terms and no hidden surprises.',
    details: 'Our low-interest plans are designed to keep total borrowing cost affordable with clear terms from day one. You get transparent rate slabs, no hidden surprises, and repayment options that balance affordability with faster loan closure when needed.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10.5 3h-3a5.25 5.25 0 1 0 0 10.5h3V18H3.75v3H10.5v3h3v-3h3a5.25 5.25 0 1 0 0-10.5h-3V6h6.75V3H13.5V0h-3zm3 10.5h3a2.25 2.25 0 0 1 0 4.5h-3zm-3-3h-3a2.25 2.25 0 1 1 0-4.5h3z"
        />
      </svg>
    ),
  },
  {
    title: 'Quick Approval',
    description: 'Fast verification workflow so you can ride without long delays.',
    details: 'With a streamlined verification workflow and faster internal checks, we reduce wait time for loan decisions. From document review to approval confirmation, every stage is optimized so eligible customers can move ahead quickly and confidently.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const workSteps = [
  {
    title: 'Apply Online',
    text: 'Fill a quick application with basic details and select your bike model.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="5" y="3.5" width="14" height="17" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Get Approval Call',
    text: 'Our team verifies details and confirms your approval on a quick call.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M6.8 4.5h3l1.2 3.5l-2 1.5a14 14 0 0 0 5 5l1.5-2l3.5 1.2v3a1.8 1.8 0 0 1-2 1.8A14.8 14.8 0 0 1 5 7a1.8 1.8 0 0 1 1.8-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Receive Finance',
    text: 'Funds are processed quickly so your vehicle delivery stays on track.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="3" y="7" width="18" height="10" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

const benefits = [
  {
    title: 'Fast Approval',
    text: 'Quicker decisions with streamlined document checks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M12 3l7 4v5c0 4.5-3 7.8-7 9c-4-1.2-7-4.5-7-9V7l7-4Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="m9 12l2 2l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Low Documentation',
    text: 'Simple paperwork so you spend less time in process.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Trusted Service',
    text: 'A dependable team supporting customers at every step.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M12 3l2.7 5.5l6.1.9l-4.4 4.3l1 6.1L12 17l-5.4 2.8l1-6.1L3.2 9.4l6.1-.9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Flexible EMI',
    text: 'Installments tailored to your income and repayment comfort.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M4 12h16M4 7h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

const stats = [
  { label: 'Customers Financed Successfully', value: 5000, suffix: '+' },
  { label: 'Bikes Financed', value: 3800, suffix: '+' },
  { label: 'Customer Satisfaction', value: 98, suffix: '%' },
]

function Home() {
  const navigate = useNavigate()
  const [activeService, setActiveService] = useState(serviceCards[0])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const servicesRef = useRef([])
  const stepsRef = useRef([])
  const benefitsRef = useRef([])
  const benefitIconsRef = useRef([])
  const benefitTitlesRef = useRef([])
  const benefitsLineRef = useRef(null)
  const benefitsSectionRef = useRef(null)
  const statsRef = useRef([])
  const ctaRef = useRef(null)
  const serviceInfoRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        servicesRef.current,
        {
          y: 36,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.services-section',
            start: 'top 85%',
            once: true,
          },
        }
      )

      gsap.timeline({
        scrollTrigger: {
          trigger: stepsRef.current[0],
          start: 'top 85%',
        },
      }).from(stepsRef.current, {
        y: 28,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.2,
        ease: 'back.out(1.2)',
      })

      const benefitItems = benefitsRef.current.filter(Boolean)
      const benefitIcons = benefitIconsRef.current.filter(Boolean)
      const benefitTitles = benefitTitlesRef.current.filter(Boolean)
      const benefitTrigger = benefitsSectionRef.current || benefitItems[0]

      if (benefitItems.length) {
        gsap.from(benefitItems, {
          y: 26,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: benefitTrigger,
            start: 'top 82%',
          },
        })
      }

      if (benefitsLineRef.current) {
        gsap.fromTo(
          benefitsLineRef.current,
          {
            scaleY: 0,
            transformOrigin: 'top center',
          },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: benefitTrigger,
              start: 'top 86%',
            },
          }
        )
      }

      if (benefitIcons.length) {
        gsap.to(benefitIcons, {
          y: -4,
          scale: 1.05,
          yoyo: true,
          repeat: -1,
          duration: 1.35,
          ease: 'sine.inOut',
          stagger: 0.15,
        })
      }

      if (benefitTitles.length) {
        gsap.to(benefitTitles, {
          y: -4,
          yoyo: true,
          repeat: -1,
          duration: 1.35,
          ease: 'sine.inOut',
          stagger: 0.15,
        })
      }

      statsRef.current.forEach((node, idx) => {
        const target = stats[idx]?.value || 0
        const suffix = stats[idx]?.suffix || ''
        const valueObj = { value: 0 }

        gsap.to(valueObj, {
          value: target,
          duration: 2,
          ease: 'power1.out',
          onUpdate: () => {
            const next = Math.floor(valueObj.value).toLocaleString()
            node.textContent = `${next}${suffix}`
          },
          scrollTrigger: {
            trigger: node,
            start: 'top 88%',
            once: true,
          },
        })
      })

      gsap.to('.hero-badge-star-path', {
        rotation: 360,
        svgOrigin: '219 219',
        duration: 3.2,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.clock-hand-small', {
        rotation: 360,
        svgOrigin: '144.5 144.5',
        duration: 2,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.clock-hand-large', {
        rotation: 360,
        svgOrigin: '144.5 144.5',
        duration: 6,
        repeat: -1,
        ease: 'none',
      })

      gsap.to('.cta-glow', {
        backgroundPosition: '100% 50%',
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: 'sine.inOut',
      })

      gsap.to('.cta-pulse-btn', {
        scale: 1.04,
        boxShadow: '0px 10px 24px rgba(64,255,0,0.25)',
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'sine.inOut',
      })

      gsap.to('.emi-float-btn', {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!serviceInfoRef.current || !activeService) {
      return
    }

    gsap.fromTo(
      serviceInfoRef.current,
      {
        y: 14,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.35,
        ease: 'power2.out',
      }
    )
  }, [activeService])

  const setNodeRef = (refArray, index) => (node) => {
    if (node) {
      refArray.current[index] = node
    }
  }

  const handleMobileNavClick = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <div>
      <div className='md:px-8 md:pt-6'>
        <div className='w-full bg-[rgba(246,246,246,0.45)] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:rounded-full'>
          <div className='flex items-center justify-between py-4 px-2 '>
            <div className='flex gap-0 sm:gap-5'>
              <button
                type='button'
                aria-label='Toggle navigation menu'
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className='pt-2 sm:pl-4 pr-2 md:hidden'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#9c9c9c" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z" strokeWidth="0.5" stroke="#9c9c9c" /></g></svg>
              </button>
              <div className='md:pl-6'>
                <Logo />
              </div>
            </div>

            <div className=''>
              <ul className='hidden md:flex items-center gap-5 font-semibold'>
                <li>
                  <button type='button' onClick={() => navigate('/')} className='text-[#27563C] transition hover:text-[#1E3E2B]'>
                    Home
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => navigate('/about')} className='text-[#27563C] transition hover:text-[#1E3E2B]'>
                    About Us
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => navigate('/services')} className='text-[#27563C] transition hover:text-[#1E3E2B]'>
                    Services
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => navigate('/contact')} className='text-[#27563C] transition hover:text-[#1E3E2B]'>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div className='flex justify-center items-center gap-2 sm:px-5'>
              <button type="button"
                onClick={() => navigate('/login')}
                aria-label='Login'
                className='px-3 md:px-4 py-1 bg-[#E0FCED] font-bold border-[2px] border-black rounded-xl text-sm shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] text-[#27563C]'
              >
                <span className='md:hidden flex items-center justify-center' aria-hidden='true'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M10 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H10V19H6V5H10V3Z" fill="currentColor" />
                    <path d="M13.586 7.00005L12.172 8.41405L14.758 11.0001H8V13.0001H14.758L12.172 15.5861L13.586 17.0001L18.586 12.0001L13.586 7.00005Z" fill="currentColor" />
                  </svg>
                </span>
                <span className='hidden md:inline'>Login</span>
              </button>
              <button type="button" aria-label='Sign up' onClick={() => navigate('/signup')} className='px-3 md:px-4 py-1 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-bold border-[2px] border-black rounded-xl text-sm shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] text-[#1E3E2B]'>
                <span className='md:hidden flex items-center justify-center' aria-hidden='true'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 3H14C15.1046 3 16 3.89543 16 5V8H14V5H6V19H14V16H16V19C16 20.1046 15.1046 21 14 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z" fill="currentColor" />
                    <path d="M8 8H12V10H8V8ZM8 12H11V14H8V12Z" fill="currentColor" />
                    <path d="M19 8V10H17V12H19V14H21V12H23V10H21V8H19Z" fill="currentColor" />
                  </svg>
                </span>
                <span className='hidden md:inline'>Sign up</span>
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className='border-t border-black/10 px-4 pb-3 pt-2 md:hidden'>
              <ul className='space-y-2 text-sm font-semibold text-[#27563C]'>
                <li>
                  <button type='button' onClick={() => handleMobileNavClick('/')} className='w-full rounded-lg px-2 py-2 text-left hover:bg-[#E0FCED]'>
                    Home
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => handleMobileNavClick('/about')} className='w-full rounded-lg px-2 py-2 text-left hover:bg-[#E0FCED]'>
                    About Us
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => handleMobileNavClick('/services')} className='w-full rounded-lg px-2 py-2 text-left hover:bg-[#E0FCED]'>
                    Services
                  </button>
                </li>
                <li>
                  <button type='button' onClick={() => handleMobileNavClick('/contact')} className='w-full rounded-lg px-2 py-2 text-left hover:bg-[#E0FCED]'>
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* content one */}

      <div className='flex justify-center items-center h-fit  flex-col'>
        <h1 className=' px-4 text-[1.80rem] sm:text-[2.25rem] pt-12 md:pt-24 md:text-[2.75rem] lg:text-[3rem] xl:text-[3.5rem] font-extrabold text-[#27563C]'><span className='sm:pl-16'>Drive Your Dream,</span><br /> We Finance the Journey.</h1>
        <h2 className='font-semibold text-[#737373]  px-4 text-sm md:text-xl'>Get fast, flexible, and affordable vehicle financing. <br />
          <span className='sm:pl-4'>whether it’s your first ride or your next upgrade.</span></h2>
        <div className='pt-9'>
          <button className='flex gap-2 justify-center rounded-lg items-center px-4 py-2 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-bold shadow-[0px_3px_2px_1px_rgba(0,_0,_0,_0.7)]'>Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 16 9"><path fill="currentColor" d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5" /><path fill="currentColor" d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z" /></svg>
          </button>
        </div>

      </div>

      {/* content two */}

      <div className="pt-14 md:pt-20 flex justify-between">
        <div className="h-36 w-48 sm:h-40 sm:w-56 md:h-72 md:w-[50%] rounded-r-3xl flex justify-center items-center flex-col text-center bg-gradient-to-r from-[#E0FCED] via-[#E0FCED]/60 to-transparent">
          <h1 className="font-extrabold text-[#27563C] text-lg sm:text-2xl md:text-5xl">
            Over 5000+
          </h1>
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-4 md:pt-2">
            Customers Financed Successfully
          </h3>
        </div>



        <div className='flex justify-center items-center w-full gap-28'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48' width="305" height="305" viewBox="0 0 305 305" fill="none">
            <path d="M100.078 133.438C113.981 133.438 127.315 127.914 137.146 118.083C146.977 108.252 152.5 94.9188 152.5 81.0156C152.5 67.1125 146.977 53.7788 137.146 43.9478C127.315 34.1168 113.981 28.5938 100.078 28.5938C86.175 28.5938 72.8413 34.1168 63.0103 43.9478C53.1793 53.7788 47.6562 67.1125 47.6562 81.0156C47.6562 94.9188 53.1793 108.252 63.0103 118.083C72.8413 127.914 86.175 133.438 100.078 133.438ZM219.219 133.438C229.33 133.438 239.027 129.421 246.177 122.271C253.327 115.121 257.344 105.424 257.344 95.3125C257.344 85.2011 253.327 75.5039 246.177 68.3541C239.027 61.2042 229.33 57.1875 219.219 57.1875C209.107 57.1875 199.41 61.2042 192.26 68.3541C185.11 75.5039 181.094 85.2011 181.094 95.3125C181.094 105.424 185.11 115.121 192.26 122.271C199.41 129.421 209.107 133.438 219.219 133.438ZM133.438 219.219C133.438 193.37 144.875 170.2 162.946 154.473C159.618 153.168 156.075 152.499 152.5 152.5H47.6562C40.0727 152.5 32.7998 155.513 27.4374 160.875C22.075 166.237 19.0625 173.51 19.0625 181.094V182.523C19.0625 182.523 19.0625 238.281 100.078 238.281C113.822 238.281 125.241 236.68 134.705 234.011C133.856 229.126 133.432 224.177 133.438 219.219ZM290.703 219.219C290.703 238.178 283.172 256.36 269.766 269.766C256.36 283.172 238.178 290.703 219.219 290.703C200.26 290.703 182.078 283.172 168.672 269.766C155.266 256.36 147.734 238.178 147.734 219.219C147.734 200.26 155.266 182.078 168.672 168.672C182.078 155.266 200.26 147.734 219.219 147.734C238.178 147.734 256.36 155.266 269.766 168.672C283.172 182.078 290.703 200.26 290.703 219.219Z" fill="url(#paint0_linear_17_21)" />
            <path className='hero-badge-star-path' d='M212.432 172.878L203.473 199.832H174.937C167.969 199.832 165.119 208.772 170.8 212.804L193.732 229.074L184.878 255.685C182.705 262.233 190.167 267.761 195.8 263.768L219.219 247.155L242.637 263.768C248.27 267.771 255.733 262.243 253.56 255.685L244.696 229.074L267.637 212.804C273.328 208.772 270.468 199.832 263.501 199.832H234.964L226.005 172.878C223.832 166.358 214.606 166.358 212.432 172.878Z' fill='#ffffff' />
            <defs>
              <linearGradient id="paint0_linear_17_21" x1="155" y1="92.5" x2="154.883" y2="290.703" gradientUnits="userSpaceOnUse">
                <stop stop-color="#61FF09" />
                <stop offset="1" stop-color="#3A9905" />
              </linearGradient>
            </defs>
          </svg>

        </div>

      </div>

      <div className="pt-14 md:pt-20 pb-10  flex justify-between ">

        <div className='flex justify-center items-center  w-full'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44' width="289" height="289" viewBox="0 0 289 289" fill="none">
            <path d="M144.38 24.0834C77.9096 24.0834 24.0833 78.03 24.0833 144.5C24.0833 210.97 77.9096 264.917 144.38 264.917C210.97 264.917 264.917 210.97 264.917 144.5C264.917 78.03 210.97 24.0834 144.38 24.0834Z" fill="url(#paint0_linear_17_45)" />
            <path className='clock-hand-large' d='M144.5 144.5V95.5' stroke='#ffffff' strokeWidth='12' strokeLinecap='round' />
            <path className='clock-hand-small' d='M144.5 144.5L184 185' stroke='#ffffff' strokeWidth='10' strokeLinecap='round' />
            <circle cx='144.5' cy='144.5' r='10' fill='#ffffff' />
            <defs>
              <linearGradient id="paint0_linear_17_45" x1="144" y1="145" x2="144.5" y2="264.917" gradientUnits="userSpaceOnUse">
                <stop stop-color="#58FF07" />
                <stop offset="1" stop-color="#359904" />
              </linearGradient>
            </defs>
          </svg>
        </div>


        <div className="h-36 w-48 sm:h-40 sm:w-56 md:h-72 md:w-[50%] rounded-l-3xl flex justify-center items-center flex-col text-center bg-gradient-to-l from-[#E0FCED] via-[#E0FCED]/60 to-transparent">
          <h1 className="font-extrabold text-[#27563C] text-lg sm:text-2xl md:text-5xl">
            Average <br />Approval Time
          </h1>
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-4 md:pt-2">
            Under 24 Hours
          </h3>
        </div>


      </div>

      <div>
        <FinanceTestimonials />
      </div>

      <section className='services-section mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8'>
        <div className='pb-8 text-center'>
          <h2 className='text-[1.85rem] font-black text-[#27563C] md:text-[2.4rem]'>Our Services</h2>
          <p className='mx-auto mt-2 max-w-2xl text-sm font-medium text-[#737373] md:text-base'>
            Financing built for modern two-wheeler buyers with speed, clarity, and flexibility.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {serviceCards.map((card, index) => (
            <article
              key={card.title}
              ref={setNodeRef(servicesRef, index)}
              onMouseEnter={() => setActiveService(card)}
              onFocus={() => setActiveService(card)}
              onClick={() => setActiveService(card)}
              className='group rounded-2xl border border-black/10 bg-[rgba(246,246,246,0.55)] p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] transition duration-300 hover:scale-[1.03] hover:shadow-[0px_12px_24px_rgba(0,_0,_0,_0.14)]'
            >
              <div className='inline-flex rounded-xl bg-[#E0FCED] p-3 text-[#27563C]'>
                {card.icon}
              </div>
              <h3 className='pt-4 text-lg font-extrabold text-[#27563C]'>{card.title}</h3>
              <p className='pt-2 text-sm font-medium text-[#737373]'>{card.description}</p>
              <button
                type='button'
                onClick={() => navigate('/login')}
                className='mt-5 rounded-lg bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-4 py-2 text-sm font-extrabold text-[#1E3E2B] shadow-[0px_3px_2px_1px_rgba(0,_0,_0,_0.35)]'
              >
                Apply Now
              </button>
            </article>
          ))}
        </div>

        <div
          ref={serviceInfoRef}
          className='mt-6 rounded-2xl border border-black/10 bg-white/75 px-5 py-4 text-center shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'
        >
          <h3 className='text-base font-extrabold text-[#27563C] md:text-lg'>{activeService?.title}</h3>
          <p className='pt-2 text-sm font-medium leading-7 text-[#737373] md:text-base'>{activeService?.details || activeService?.description}</p>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-[rgba(224,252,237,0.45)] px-5 py-10 md:px-10'>
          <div className='text-center'>
            <h2 className='text-[1.8rem] font-black text-[#27563C] md:text-[2.4rem]'>How It Works</h2>
            <p className='mx-auto mt-2 max-w-2xl text-sm font-medium text-[#737373] md:text-base'>
              Complete your bike financing in three simple steps.
            </p>
          </div>

          <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {workSteps.map((step, index) => (
              <div key={step.title} className='relative'>
                <article
                  ref={setNodeRef(stepsRef, index)}
                  className='rounded-2xl border border-black/10 bg-white/70 p-6 text-center shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'
                >
                  <div className='mx-auto inline-flex rounded-full bg-[#E0FCED] p-3 text-[#27563C]'>
                    {step.icon}
                  </div>
                  <h3 className='pt-4 text-lg font-extrabold text-[#27563C]'>{step.title}</h3>
                  <p className='pt-2 text-sm font-medium text-[#737373]'>{step.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={benefitsSectionRef} className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='pb-8 text-center'>
          <h2 className='text-[1.8rem] font-black text-[#27563C] md:text-[2.4rem]'>Why Choose Us</h2>
          <p className='mx-auto mt-2 max-w-2xl text-sm font-medium text-[#737373] md:text-base'>
            Reliable support, practical plans, and customer-first financing.
          </p>
        </div>

        <div className='relative mx-auto max-w-5xl'>
          <div ref={benefitsLineRef} className='absolute left-6 top-6 h-[calc(100%-52px)] w-[2px] bg-gradient-to-b from-[#B0FF1C] to-[#40FF00]' />

          <div className='space-y-6 md:space-y-7'>
            {benefits.map((item, index) => (
              <article
                key={item.title}
                ref={setNodeRef(benefitsRef, index)}
                className='relative md:grid md:grid-cols-[18rem_1fr] md:items-center md:gap-4'
              >
                <div className='benefit-anchor relative z-10 mb-3 grid w-full max-w-[11rem] grid-cols-[48px_1fr] items-start gap-3 md:static md:mb-0 md:w-[18rem] md:max-w-none md:grid-cols-[52px_1fr] md:items-center md:justify-start'>
                  <div
                    ref={setNodeRef(benefitIconsRef, index)}
                    className='inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0FCED] p-3 text-[#27563C] ring-4 ring-white shadow-[0px_6px_14px_rgba(39,86,60,0.14)] md:h-[52px] md:w-[52px]'
                  >
                    {item.icon}
                  </div>
                  <h3
                    ref={setNodeRef(benefitTitlesRef, index)}
                    className='text-base font-extrabold leading-tight text-[#27563C] md:text-lg'
                  >
                    {item.title}
                  </h3>
                </div>

                <div className='benefit-content ml-3 min-w-0 rounded-xl border border-black/10 bg-white/70 px-4 py-3 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0px_12px_22px_rgba(0,_0,_0,_0.12)] md:ml-0 md:px-5 md:py-4'>
                  <p className='break-words text-sm font-medium text-[#737373] md:text-base'>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-5 rounded-3xl bg-[rgba(224,252,237,0.4)] p-6 text-center md:grid-cols-3 md:p-10'>
          {stats.map((item, index) => (
            <article key={item.label} className='rounded-2xl border border-black/10 bg-white/65 p-6 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.08)]'>
              <h3
                ref={setNodeRef(statsRef, index)}
                className='text-3xl font-black text-[#27563C] md:text-5xl'
              >
                0{item.suffix}
              </h3>
              <p className='pt-2 text-sm font-bold text-[#737373] md:text-base'>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8'>
        <div
          ref={ctaRef}
          className='cta-glow rounded-3xl border border-black/10 bg-[linear-gradient(120deg,rgba(224,252,237,0.75),rgba(255,255,255,0.9),rgba(176,255,28,0.45))] bg-[length:200%_200%] px-6 py-12 text-center shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:px-12'
        >
          <h2 className='text-[1.95rem] font-black text-[#27563C] md:text-[2.6rem]'>Get Your Bike Finance Today</h2>
          <p className='mx-auto mt-3 max-w-2xl text-sm font-medium text-[#737373] md:text-base'>
            Start your application now and move one step closer to your next ride.
          </p>
          <button
            type='button'
            onClick={() => navigate('/signup')}
            className='cta-pulse-btn mt-7 rounded-xl bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] px-6 py-3 text-sm font-extrabold text-[#1E3E2B] shadow-[0px_5px_14px_rgba(0,_0,_0,_0.18)] md:text-base'
          >
            Apply Now
          </button>
        </div>
      </section>


      <div>
        <Footer />
      </div>

      {/* Floating EMI Calculator Button */}
      <button
        onClick={() => navigate('/emi-calculator')}
        type='button'
        aria-label='EMI Calculator'
        className='emi-float-btn fixed bottom-4 right-8 z-40 cursor-pointer rounded-2xl bg-white px-3 py-2 border-0 appearance-none flex flex-col items-center gap-1 shadow-[0px_10px_22px_rgba(0,_0,_0,_0.18)]'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fillRule="evenodd" clipRule="evenodd">
          <defs>
            <linearGradient id="emiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B0FF1C" />
              <stop offset="100%" stopColor="#40FF00" />
            </linearGradient>
          </defs>
          <path fill="url(#emiGradient)" d="M12 22c-4.243 0-6.364 0-7.682-1.465C3 19.072 3 16.714 3 12s0-7.071 1.318-8.536S7.758 2 12 2s6.364 0 7.682 1.464C21 4.93 21 7.286 21 12s0 7.071-1.318 8.535S16.242 22 12 22m3-16H9c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C7 7.304 7 7.536 7 8s0 .697.051.888a1.5 1.5 0 0 0 1.06 1.06C8.304 10 8.536 10 9 10h6c.465 0 .697 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C17 8.696 17 8.464 17 8s0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C15.697 6 15.464 6 15 6m-6 7a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m5-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-1 5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-3-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/>
        </svg>
        <span className='text-[10px] leading-none font-medium text-[#1E3E2B]'>EMI Calculator</span>
      </button>

    </div>
  )
}

export default Home