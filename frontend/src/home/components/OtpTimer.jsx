import React, { useState, useEffect } from 'react'

function OtpTimer({ initialSeconds = 60, onExpire }) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.()
      return
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, onExpire])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="text-center">
      <p className="text-[#14493b] font-semibold">
        Time remaining: <span className="text-[#0e6b53] font-bold">{minutes}:{secs.toString().padStart(2, '0')}</span>
      </p>
    </div>
  )
}

export default OtpTimer
