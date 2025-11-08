import React from "react";

// Usage: <FinanceTestimonialsMarquee testimonials={yourArray} />

export default function FinanceTestimonialsMarquee({
  testimonials = [],
  title = "Fast Finance Success Stories",
  subtitle = "Real riders who got vehicle finance fast and hassle-free.",
  cardWidth = 320, // px
  gap = 16,        // px
  speedMs = 22000, // lower = faster
}) {
  const row = (testimonials?.length ? testimonials : demoTestimonials);

  return (
    <section className="w-full py-12">
      {/* KEYFRAMES + helper classes */}
      <style>{`
        @keyframes marqueeXpx {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(var(--halfPx, 0px) * -1)); }
        }
        .marquee-track {
          display: flex;
          /* width is auto based on content; we move by --halfPx */
          animation: marqueeXpx var(--speed, 22000ms) linear infinite;
          will-change: transform;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight sm:text-5xl text-[#27563C]">{title}</h2>
            <p className="mt-1 text-xl sm:text-2xl text-slate-600">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="rounded-full bg-[#f8eeff] px-3 py-1 ring-1 ring-inset ring-slate-200 flex justify-center items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.16"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 8v5h5"/></g></svg>{'<24h'} delivered</span>
            <span className="rounded-full bg-[#fffbe6] px-3 py-1 ring-1 ring-inset ring-slate-200 flex justify-center items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3l4-3l2 3h2"/></g></svg>Vehicle finance</span>
            <span className="rounded-full bg-[#e3f9ff] px-3 py-1 ring-1 ring-inset ring-slate-200 flex justify-center items-center gap-1"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5v14h20V5zm5 12a3 3 0 0 0-3-3v-4a3 3 0 0 0 3-3h10a3 3 0 0 0 3 3v4a3 3 0 0 0-3 3zm5-8c1.1 0 2 1.3 2 3s-.9 3-2 3s-2-1.3-2-3s.9-3 2-3"/></svg>Easy EMIs</span>
          </div>
        </div>

        <Marquee
          row={row}
          cardWidth={cardWidth}
          gap={gap}
          speedMs={speedMs}
        />
      </div>
    </section>
  );
}

function Marquee({ row, cardWidth, gap, speedMs }) {
  const [paused, setPaused] = React.useState(false);
  const trackRef = React.useRef(null);
  const halfRef = React.useRef(null);
  const [halfPx, setHalfPx] = React.useState(0);

  React.useEffect(() => {
    const measure = () => {
      if (!halfRef.current) return;
      const w = halfRef.current.scrollWidth; // exact pixel width of one copy
      setHalfPx(w);
    };
    // measure after paint
    const id = requestAnimationFrame(measure);
    // re-measure on resize (debounced by rAF)
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [row, cardWidth, gap]);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border bg-white py-6"
      role="region"
      aria-label="Scrolling customer testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Left/Right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />

      {/* TRACK — two natural-width copies, animated by measured pixel distance */}
      <div
        ref={trackRef}
        className={`marquee-track ${paused ? 'paused' : ''}`}
        style={{
          ["--speed"]: `${speedMs}ms`,
          ["--halfPx"]: `${halfPx}px`,
          gap: `${gap}px`,
        }}
      >
        {/* Copy A (measured) */}
        <div ref={halfRef} className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {row.map((t, idx) => (
            <TestimonialCard key={`A-${idx}-${t.name || "user"}`} t={t} cardWidth={cardWidth} />
          ))}
        </div>

        {/* Copy B */}
        <div className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {row.map((t, idx) => (
            <TestimonialCard key={`B-${idx}-${t.name || "user"}`} t={t} cardWidth={cardWidth} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ t, cardWidth }) {
  return (
    <article
      tabIndex={0}
      className="h-full shrink-0 rounded-2xl border p-5 shadow-sm outline-none transition-shadow hover:shadow-md focus:shadow-md"
      style={{ width: cardWidth }}
      aria-label={`Testimonial from ${t?.name || "customer"}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{t?.name || "Customer"}</h3>
          {t?.city ? <p className="mt-0.5 text-xs text-slate-500">{t.city}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {t?.deliveredUnder24h && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 ring-1 ring-inset ring-green-600/15">
              {'<24h'} delivered
            </span>
          )}
          {t?.financeType && (
            <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/10">
              {t.financeType}
            </span>
          )}
        </div>
      </header>

      {t?.message ? (
        <p className="text-sm text-slate-700 line-clamp-4">{t.message}</p>
      ) : t?.whyHappy ? (
        <p className="text-sm text-slate-700 line-clamp-4">{t.whyHappy}</p>
      ) : (
        <p className="text-sm text-slate-700 line-clamp-4">
          Super quick approval and smooth process. Got my vehicle financed in under 24 hours!
        </p>
      )}

      {t?.vehicle && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
          {t.vehicle}
        </div>
      )}
    </article>
  );
}

// Example data (unchanged)
export const demoTestimonials = [
  {
    name: "Rohit Kumar",
    city: "Hyderabad",
    vehicle: "Honda Activa 6G (Used)",
    deliveredUnder24h: true,
    financeType: "Two-wheeler finance",
    message: "Applied in the morning, got approval by evening. Zero paperwork and EMI fits my budget!",
  },
  {
    name: "Pooja Sharma",
    city: "Pune",
    vehicle: "Royal Enfield Classic 350",
    deliveredUnder24h: true,
    financeType: "Bike loan",
    whyHappy: "Customer support kept me posted at every step. Vehicle delivered next day — super fast!",
  },
  {
    name: "Mohammed Irfan",
    city: "Chennai",
    vehicle: "TVS Jupiter",
    deliveredUnder24h: true,
    financeType: "Vehicle finance",
    message: "Lowest down payment I could find. Whole process done on WhatsApp. Highly recommend!",
  },
  {
    name: "Sneha Patel",
    city: "Ahmedabad",
    vehicle: "Hero Splendor Plus",
    deliveredUnder24h: true,
    financeType: "Used bike loan",
    message: "KYC on phone, approval same day. Smooth experience!",
  },
];
