import React, { useEffect, useRef } from 'react'
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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 18h6.5l2.8-5.5h-4.2L11.8 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Refinance Options',
    description: 'Lower your EMI burden with refinancing plans designed for you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M4 7h10M4 12h7M4 17h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16 8l4 4l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Low Interest Plans',
    description: 'Competitive rates with transparent terms and no hidden surprises.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
        <path d="M12 3v18M7 7c0-1.7 1.7-3 5-3s5 1.3 5 3s-1.7 3-5 3s-5 1.3-5 3s1.7 3 5 3s5-1.3 5-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Quick Approval',
    description: 'Fast verification workflow so you can ride without long delays.',
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
  { label: 'Loans Approved', value: 12500, suffix: '+' },
  { label: 'Bikes Financed', value: 9800, suffix: '+' },
  { label: 'Customer Satisfaction', value: 98, suffix: '%' },
]

const successStoriesSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="801.95277" height="537" viewBox="0 0 801.95277 537" role="img" artist="Katerina Limpitsouni" source="https://undraw.co/"><path d="M857.27306,503.00345a10.52659,10.52659,0,0,1,1.6208-.34681l21.89865-44.4965-6.68563-10.02281,13.80744-12.06683,17.35728,21.24-35.35067,51.44811a10.49579,10.49579,0,1,1-12.64787-5.75514Z" transform="translate(-199.02361 -181.5)" fill="#a0616a"/><path d="M894.65563,442.21808a4.51373,4.51373,0,0,1-1.01617.801l-22.4057,12.98872a4.49929,4.49929,0,0,1-6.32407-1.96783l-10.89742-23.02258a4.47646,4.47646,0,0,1,1.53737-5.64507l13.88914-9.44831a4.502,4.502,0,0,1,5.718.54388L894.57,435.94935a4.504,4.504,0,0,1,.08559,6.26873Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><polygon points="727.092 515.689 715.262 518.908 697.217 474.811 714.677 470.06 727.092 515.689" fill="#a0616a"/><path d="M906.71654,697.9165h23.64387a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H891.82969a0,0,0,0,1,0,0v0A14.88686,14.88686,0,0,1,906.71654,697.9165Z" transform="translate(-352.24737 82.43915) rotate(-15.22067)" fill="#2f2e41"/><polygon points="625.961 524.716 613.702 524.715 607.869 477.427 625.963 477.428 625.961 524.716" fill="#a0616a"/><path d="M604.94435,521.2124h23.64387a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H590.05749a0,0,0,0,1,0,0v0A14.88686,14.88686,0,0,1,604.94435,521.2124Z" fill="#2f2e41"/><circle cx="638.87797" cy="194.16535" r="24.56103" fill="#a0616a"/><path d="M824.23418,672.5H807.48052a4.51307,4.51307,0,0,1-4.4956-4.22266c-4.99219-79.36132-2.072-136.28906,9.18969-179.15332a4.67831,4.67831,0,0,1,.18238-.55175l.89721-2.24317a4.47879,4.47879,0,0,1,4.17847-2.8291h34.4519a4.4927,4.4927,0,0,1,3.41675,1.57129l4.67945,5.46c.0913.10645.17675.21484.259.3291,21.10107,29.42578,40.01123,86.9541,61.91235,164.27832a4.48492,4.48492,0,0,1-2.95849,5.5166L901.18877,666.417a4.52419,4.52419,0,0,1-5.425-2.332l-46.72266-96.90723a3.50019,3.50019,0,0,0-6.62036,1.0459l-13.728,100.38575A4.51721,4.51721,0,0,1,824.23418,672.5Z" transform="translate(-199.02361 -181.5)" fill="#2f2e41"/><path d="M858.09209,490.93066c-.04711,0-.094-.001-.14135-.00195l-41.84839-1.32129a4.4854,4.4854,0,0,1-4.32862-3.9541c-5.30493-42.94141,9.24415-54.44531,15.74561-57.39746a3.45965,3.45965,0,0,0,2.01221-2.74316l.5625-4.501a4.48359,4.48359,0,0,1,.88916-2.18555c10.1936-13.20508,24.11279-17.43359,31.50268-18.77832a4.49307,4.49307,0,0,1,5.25122,3.84961l.84278,6.46289a3.56038,3.56038,0,0,0,.71338,1.69141c21.259,27.792-2.42456,68.82715-7.38819,76.77051h0A4.50839,4.50839,0,0,1,858.09209,490.93066Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M887.45489,378.43036A97.75259,97.75259,0,0,0,867.94952,358.01c-6.19825-4.84149-13.09766-8.97778-20.70948-10.95636-7.6123-1.97858-16.01855-1.64179-22.96338,2.04919-6.94531,3.691-14.12548,11.02454-14.16943,18.88941-.01367,2.52661.62891,5.94494,3.11719,5.50781l.71973.09546q9.00366-1.81851,18.00683-3.637,3.835,13.30782,7.66943,26.61572c.53907,1.86981,1.26172,3.96081,3.03663,4.75818,1.67187.751,3.60449.04345,5.29589-.66266.27832-.11627,2.66844-5.48164,2.66844-5.48164a1.00005,1.00005,0,0,1,1.72268-.28844l1.41987,1.77465a2,2,0,0,0,2.3321.59617q14.68261-6.12932,29.3657-12.25858c1.35254-.56476,2.86475-1.30218,3.25684-2.71478C889.09454,380.94391,888.26739,379.57556,887.45489,378.43036Z" transform="translate(-199.02361 -181.5)" fill="#2f2e41"/><path d="M999.97639,718.5h-301a1,1,0,0,1,0-2h301a1,1,0,0,1,0,2Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M836.79313,562.66406a3.20348,3.20348,0,0,1-1.88891-.62549l-4.552-3.30712a2.20585,2.20585,0,0,0-2.60181,0l-4.552,3.30712a3.21341,3.21341,0,0,1-4.94507-3.59228l1.73877-5.35108a2.20712,2.20712,0,0,0-.8042-2.4746l-4.552-3.30762a3.21342,3.21342,0,0,1,1.88891-5.813h5.62647a2.20812,2.20812,0,0,0,2.10522-1.5293l1.73853-5.35107a3.2133,3.2133,0,0,1,6.1123,0l1.73877,5.35107a2.20783,2.20783,0,0,0,2.105,1.5293h5.62647a3.21342,3.21342,0,0,1,1.88891,5.813l-4.552,3.30713a2.20831,2.20831,0,0,0-.804,2.47509l1.73877,5.35108a3.16508,3.16508,0,0,1-1.16748,3.59228A3.20336,3.20336,0,0,1,836.79313,562.66406Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M854.18878,551.96606a10.74269,10.74269,0,0,0,1.40649-16.41247l7.77327-93.87138-23.14412,3.1839-.4403,91.20458a10.80091,10.80091,0,0,0,14.40466,15.89537Z" transform="translate(-199.02361 -181.5)" fill="#a0616a"/><path d="M864.88091,455.19922a4.51364,4.51364,0,0,1-1.28051-.18555l-24.846-7.30762a4.49928,4.49928,0,0,1-2.92676-5.9414l9.19482-23.75391a4.47646,4.47646,0,0,1,5.15259-2.77148l16.4148,3.56836a4.502,4.502,0,0,1,3.54223,4.52148l-.76367,27.49219a4.504,4.504,0,0,1-4.48755,4.37793Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M631.02373,572.5H206.02361a7.00787,7.00787,0,0,1-7-7v-127a7.00787,7.00787,0,0,1,7-7H631.02373a7.00786,7.00786,0,0,1,7,7v127A7.00786,7.00786,0,0,1,631.02373,572.5Zm-425.00012-139a5.0058,5.0058,0,0,0-5,5v127a5.0058,5.0058,0,0,0,5,5H631.02373a5.00572,5.00572,0,0,0,5-5v-127a5.00572,5.00572,0,0,0-5-5Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M391.99874,625.97522a3.9245,3.9245,0,0,1-2.314-.76625l-5.57643-4.0514a2.70227,2.70227,0,0,0-3.18734,0l-5.57643,4.0514a3.9366,3.9366,0,0,1-6.058-4.40073l2.13008-6.55533a2.7053,2.7053,0,0,0-.98488-3.03212l-5.57643-4.0514a3.93647,3.93647,0,0,1,2.31372-7.1212h6.893a2.70468,2.70468,0,0,0,2.57871-1.87346l2.12978-6.55533a3.93667,3.93667,0,0,1,7.48818,0l2.12977,6.55533a2.70469,2.70469,0,0,0,2.57871,1.87346h6.893a3.93652,3.93652,0,0,1,2.31371,7.1212l-5.57642,4.0514a2.70531,2.70531,0,0,0-.98489,3.03212l2.13008,6.55533a3.87738,3.87738,0,0,1-1.43022,4.40073A3.92432,3.92432,0,0,1,391.99874,625.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M448.50715,625.97522a3.92453,3.92453,0,0,1-2.314-.76625l-5.57643-4.0514a2.70227,2.70227,0,0,0-3.18734,0l-5.57643,4.0514a3.93659,3.93659,0,0,1-6.058-4.40073l2.13008-6.55533a2.70532,2.70532,0,0,0-.98489-3.03212l-5.57643-4.0514a3.9366,3.9366,0,0,1,2.314-7.1212h6.8927a2.70467,2.70467,0,0,0,2.5787-1.87346l2.13008-6.55533a3.93646,3.93646,0,0,1,7.48788,0l2.12978,6.55533a2.705,2.705,0,0,0,2.579,1.87346h6.8927a3.9366,3.9366,0,0,1,2.314,7.1212l-5.57643,4.0514a2.705,2.705,0,0,0-.98518,3.03212l2.13007,6.55533a3.87738,3.87738,0,0,1-1.43022,4.40073A3.92429,3.92429,0,0,1,448.50715,625.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M505.01555,625.97522a3.92434,3.92434,0,0,1-2.31372-.76625l-5.57642-4.0514a2.70843,2.70843,0,0,0-3.18765,0l-5.57642,4.0514a3.93639,3.93639,0,0,1-6.05766-4.40073l2.12978-6.55533a2.7053,2.7053,0,0,0-.98488-3.03212l-5.57643-4.0514a3.9366,3.9366,0,0,1,2.314-7.1212h6.8927a2.70468,2.70468,0,0,0,2.57871-1.87346l2.13008-6.55533a3.93645,3.93645,0,0,1,7.48787,0l2.13008,6.55533a2.70469,2.70469,0,0,0,2.57871,1.87346h6.8927a3.9366,3.9366,0,0,1,2.314,7.1212l-5.57643,4.0514a2.7053,2.7053,0,0,0-.98488,3.03212l2.12978,6.55533a3.87769,3.87769,0,0,1-1.42992,4.40073A3.9252,3.9252,0,0,1,505.01555,625.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M561.52425,625.97522a3.92452,3.92452,0,0,1-2.314-.76625l-5.57643-4.0514a2.70227,2.70227,0,0,0-3.18734,0L544.87,625.209a3.93659,3.93659,0,0,1-6.058-4.40073l2.13007-6.55533a2.70383,2.70383,0,0,0-.98518-3.03152l-5.57643-4.052a3.9366,3.9366,0,0,1,2.314-7.1212h6.8927a2.705,2.705,0,0,0,2.579-1.87346l2.12978-6.55533a3.93646,3.93646,0,0,1,7.48788,0l2.13008,6.55533a2.70467,2.70467,0,0,0,2.5787,1.87346h6.8927a3.9366,3.9366,0,0,1,2.314,7.1212l-5.57643,4.0514a2.70532,2.70532,0,0,0-.98489,3.03212l2.13008,6.55533A3.87738,3.87738,0,0,1,563.838,625.209,3.92432,3.92432,0,0,1,561.52425,625.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M599.06451,626.36377a4.31316,4.31316,0,0,1-2.54126-.84082,4.26058,4.26058,0,0,1-1.57129-4.835l2.13037-6.55518a2.31852,2.31852,0,0,0-.84424-2.59814l-5.57666-4.05176a4.324,4.324,0,0,1,2.54175-7.82227H600.096a2.31763,2.31763,0,0,0,2.21-1.60595l2.13037-6.55518a4.32409,4.32409,0,0,1,8.22486,0l2.12988,6.55518a2.31815,2.31815,0,0,0,2.2102,1.60595h6.89283a4.32414,4.32414,0,0,1,2.54174,7.82227l-5.57641,4.05176a2.31752,2.31752,0,0,0-.84448,2.59814l2.13012,6.55518a4.32423,4.32423,0,0,1-6.65429,4.83447l-5.57618-4.05127a2.318,2.318,0,0,0-2.73217,0l-5.57642,4.05127A4.31,4.31,0,0,1,599.06451,626.36377Zm9.48413-7.33887a4.31539,4.31539,0,0,1,2.54126.82813l5.57641,4.05127a2.32385,2.32385,0,0,0,3.57642-2.59815l-2.12988-6.55517a4.31291,4.31291,0,0,1,1.571-4.83448l5.57617-4.05175a2.324,2.324,0,0,0-1.366-4.20411h-6.89283a4.31293,4.31293,0,0,1-4.1123-2.98779l-2.13013-6.55517a2.324,2.324,0,0,0-4.42065,0l-2.13013,6.55517a4.3124,4.3124,0,0,1-4.11206,2.98779h-6.89282a2.324,2.324,0,0,0-1.36621,4.20411l5.57666,4.05175a4.31367,4.31367,0,0,1,1.5708,4.83448l-2.13037,6.55517a2.324,2.324,0,0,0,3.57641,2.59815l5.57666-4.05127A4.31666,4.31666,0,0,1,608.54864,619.0249Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M254.02363,461.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,495.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,529.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,461.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,495.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,529.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,1,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M631.02373,322.5H206.02361a7.00787,7.00787,0,0,1-7-7v-127a7.00787,7.00787,0,0,1,7-7H631.02373a7.00786,7.00786,0,0,1,7,7v127A7.00786,7.00786,0,0,1,631.02373,322.5Zm-425.00012-139a5.0058,5.0058,0,0,0-5,5v127a5.0058,5.0058,0,0,0,5,5H631.02373a5.00572,5.00572,0,0,0,5-5v-127a5.00572,5.00572,0,0,0-5-5Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M391.99874,375.97522a3.9245,3.9245,0,0,1-2.314-.76625l-5.57643-4.0514a2.70227,2.70227,0,0,0-3.18734,0l-5.57643,4.0514a3.9366,3.9366,0,0,1-6.058-4.40073l2.13008-6.55533a2.7053,2.7053,0,0,0-.98488-3.03212l-5.57643-4.0514a3.93647,3.93647,0,0,1,2.31372-7.1212h6.893a2.70468,2.70468,0,0,0,2.57871-1.87346l2.12978-6.55533a3.93667,3.93667,0,0,1,7.48818,0l2.12977,6.55533a2.70469,2.70469,0,0,0,2.57871,1.87346h6.893a3.93652,3.93652,0,0,1,2.31371,7.1212l-5.57642,4.0514a2.70531,2.70531,0,0,0-.98489,3.03212l2.13008,6.55533a3.87738,3.87738,0,0,1-1.43022,4.40073A3.92432,3.92432,0,0,1,391.99874,375.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M448.50715,375.97522a3.92453,3.92453,0,0,1-2.314-.76625l-5.57643-4.0514a2.70227,2.70227,0,0,0-3.18734,0l-5.57643,4.0514a3.93659,3.93659,0,0,1-6.058-4.40073l2.13008-6.55533a2.70532,2.70532,0,0,0-.98489-3.03212l-5.57643-4.0514a3.9366,3.9366,0,0,1,2.314-7.1212h6.8927a2.70467,2.70467,0,0,0,2.5787-1.87346l2.13008-6.55533a3.93646,3.93646,0,0,1,7.48788,0l2.12978,6.55533a2.705,2.705,0,0,0,2.579,1.87346h6.8927a3.9366,3.9366,0,0,1,2.314,7.1212l-5.57643,4.0514a2.705,2.705,0,0,0-.98518,3.03212l2.13007,6.55533a3.87738,3.87738,0,0,1-1.43022,4.40073A3.92429,3.92429,0,0,1,448.50715,375.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M505.01555,375.97522a3.92434,3.92434,0,0,1-2.31372-.76625l-5.57642-4.0514a2.70843,2.70843,0,0,0-3.18765,0l-5.57642,4.0514a3.93639,3.93639,0,0,1-6.05766-4.40073l2.12978-6.55533a2.7053,2.7053,0,0,0-.98488-3.03212l-5.57643-4.0514a3.9366,3.9366,0,0,1,2.314-7.1212h6.8927a2.70468,2.70468,0,0,0,2.57871-1.87346l2.13008-6.55533a3.93645,3.93645,0,0,1,7.48787,0l2.13008,6.55533a2.70469,2.70469,0,0,0,2.57871,1.87346h6.8927a3.9366,3.9366,0,0,1,2.314,7.1212l-5.57643,4.0514a2.7053,2.7053,0,0,0-.98488,3.03212l2.12978,6.55533a3.87769,3.87769,0,0,1-1.42992,4.40073A3.9252,3.9252,0,0,1,505.01555,375.97522Z" transform="translate(-199.02361 -181.5)" fill="#9AEF5E"/><path d="M599.06451,376.36377a4.31316,4.31316,0,0,1-2.54126-.84082,4.26058,4.26058,0,0,1-1.57129-4.835l2.13037-6.55518a2.31852,2.31852,0,0,0-.84424-2.59814l-5.57666-4.05176a4.324,4.324,0,0,1,2.54175-7.82227H600.096a2.31763,2.31763,0,0,0,2.21-1.606l2.13037-6.55518a4.32409,4.32409,0,0,1,8.22486,0l2.12988,6.55518a2.31815,2.31815,0,0,0,2.2102,1.606h6.89283a4.32414,4.32414,0,0,1,2.54174,7.82227l-5.57641,4.05176a2.31752,2.31752,0,0,0-.84448,2.59814l2.13012,6.55518a4.32423,4.32423,0,0,1-6.65429,4.83447l-5.57618-4.05127a2.318,2.318,0,0,0-2.73217,0l-5.57642,4.05127A4.31,4.31,0,0,1,599.06451,376.36377Zm9.48413-7.33887a4.31539,4.31539,0,0,1,2.54126.82813l5.57641,4.05127a2.32385,2.32385,0,0,0,3.57642-2.59815l-2.12988-6.55517a4.31291,4.31291,0,0,1,1.571-4.83448l5.57617-4.05175a2.324,2.324,0,0,0-1.366-4.20411h-6.89283a4.31293,4.31293,0,0,1-4.1123-2.98779l-2.13013-6.55517a2.324,2.324,0,0,0-4.42065,0l-2.13013,6.55517a4.3124,4.3124,0,0,1-4.11206,2.98779h-6.89282a2.324,2.324,0,0,0-1.36621,4.20411l5.57666,4.05175a4.31367,4.31367,0,0,1,1.5708,4.83448l-2.13037,6.55517a2.324,2.324,0,0,0,3.57641,2.59815l5.57666-4.05127A4.31666,4.31666,0,0,1,608.54864,369.0249Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M542.06451,376.20313a4.31317,4.31317,0,0,1-2.54126-.84083,4.26058,4.26058,0,0,1-1.57129-4.835l2.13037-6.55517a2.31854,2.31854,0,0,0-.84424-2.59815l-5.57666-4.05175A4.324,4.324,0,0,1,536.20318,349.5H543.096a2.31764,2.31764,0,0,0,2.21-1.606l2.13037-6.55517a4.32409,4.32409,0,0,1,8.22486,0l2.12988,6.55517a2.31816,2.31816,0,0,0,2.2102,1.606h6.89283a4.32414,4.32414,0,0,1,2.54174,7.82227l-5.57641,4.05175a2.31754,2.31754,0,0,0-.84448,2.59815l2.13012,6.55517a4.32423,4.32423,0,0,1-6.65429,4.83448l-5.57618-4.05127a2.318,2.318,0,0,0-2.73217,0l-5.57642,4.05127A4.31009,4.31009,0,0,1,542.06451,376.20313Zm9.48413-7.33887a4.31545,4.31545,0,0,1,2.54126.82812l5.57641,4.05127a2.32385,2.32385,0,0,0,3.57642-2.59814l-2.12988-6.55518a4.31289,4.31289,0,0,1,1.571-4.83447l5.57617-4.05176a2.324,2.324,0,0,0-1.366-4.2041h-6.89283a4.31293,4.31293,0,0,1-4.1123-2.98779l-2.13013-6.55518a2.324,2.324,0,0,0-4.42065,0l-2.13013,6.55518A4.3124,4.3124,0,0,1,543.096,351.5h-6.89282a2.324,2.324,0,0,0-1.36621,4.2041l5.57666,4.05176a4.31365,4.31365,0,0,1,1.5708,4.83447l-2.13037,6.55518a2.324,2.324,0,0,0,3.57641,2.59814l5.57666-4.05127A4.31672,4.31672,0,0,1,551.54864,368.86426Z" transform="translate(-199.02361 -181.5)" fill="#3f3d56"/><path d="M254.02363,211.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,245.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,279.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,211.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,245.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/><path d="M254.02363,279.5a6.5,6.5,0,0,0,0,13h329a6.5,6.5,0,0,0,0-13Z" transform="translate(-199.02361 -181.5)" fill="#ccc"/></svg>`
  .replaceAll('fill="#9AEF5E"', 'fill="url(#successStoryGradient)"')
  .replace(
    '</svg>',
    '<defs><linearGradient id="successStoryGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#B0FF1C" /><stop offset="100%" stop-color="#40FF00" /></linearGradient></defs></svg>'
  )

function Home() {
  const navigate = useNavigate()
  const servicesRef = useRef([])
  const stepsRef = useRef([])
  const benefitsRef = useRef([])
  const benefitIconsRef = useRef([])
  const statsRef = useRef([])
  const ctaRef = useRef(null)

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

      gsap.from(benefitsRef.current, {
        scale: 0.92,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: benefitsRef.current[0],
          start: 'top 85%',
        },
      })

      gsap.to(benefitIconsRef.current, {
        rotation: 5,
        scale: 1.08,
        yoyo: true,
        repeat: -1,
        duration: 1.7,
        ease: 'sine.inOut',
        stagger: 0.15,
      })

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
    })

    return () => ctx.revert()
  }, [])

  const setNodeRef = (refArray, index) => (node) => {
    if (node) {
      refArray.current[index] = node
    }
  }

  return (
    <div>
      <div className='md:px-8 md:pt-6'>
        <div className='w-full bg-[rgba(246,246,246,0.45)] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:rounded-full'>
          <div className='flex items-center justify-between py-4 px-2 '>
            <div className='flex gap-0 sm:gap-5'>
              <div className='pt-2 sm:pl-4 pr-2 md:hidden'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#9c9c9c" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z" stroke-width="0.5" stroke="#9c9c9c" /></g></svg>
              </div>
              <div className='md:pl-6'>
                <Logo />
              </div>
            </div>

            <div className=''>
              <ul className='hidden md:flex items-center gap-5 font-semibold'>
                <li>Home</li>
                <li>About Us</li>
                <li>Services</li>
                <li>Contact</li>
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
            Over 10,000+
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

      <section className='mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-white p-0 sm:p-2'>
          <div
            className='mx-auto w-full max-w-6xl [&>svg]:h-auto [&>svg]:w-full'
            dangerouslySetInnerHTML={{ __html: successStoriesSvg }}
          />
        </div>
      </section>

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

      <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='pb-8 text-center'>
          <h2 className='text-[1.8rem] font-black text-[#27563C] md:text-[2.4rem]'>Why Choose Us</h2>
          <p className='mx-auto mt-2 max-w-2xl text-sm font-medium text-[#737373] md:text-base'>
            Reliable support, practical plans, and customer-first financing.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {benefits.map((item, index) => (
            <article
              key={item.title}
              ref={setNodeRef(benefitsRef, index)}
              className='rounded-2xl border border-black/10 bg-[rgba(246,246,246,0.55)] p-5 shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'
            >
              <div
                ref={setNodeRef(benefitIconsRef, index)}
                className='inline-flex rounded-xl bg-[#E0FCED] p-3 text-[#27563C]'
              >
                {item.icon}
              </div>
              <h3 className='pt-4 text-lg font-extrabold text-[#27563C]'>{item.title}</h3>
              <p className='pt-2 text-sm font-medium text-[#737373]'>{item.text}</p>
            </article>
          ))}
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

    </div>
  )
}

export default Home