import React, { useRef } from 'react'

function OtpInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([])

  const handleChange = (index, val) => {
    if (!/^[0-9]?$/.test(val)) return

    const newOtp = value.split('')
    newOtp[index] = val
    onChange(newOtp.join(''))

    // Move to next input if value is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        const newOtp = value.split('')
        newOtp[index - 1] = ''
        onChange(newOtp.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2 md:gap-3 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-bold rounded-lg border-2 border-[#0e6b53] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] focus:border-[#0e6b53] transition"
          placeholder="-"
        />
      ))}
    </div>
  )
}

export default OtpInput
