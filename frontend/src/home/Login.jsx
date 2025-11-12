import React, { useState } from 'react'
import Logo from './components/Logo'
import Footer from './components/Footer'

function Login() {
  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({ identifier: '', password: '', remember: false })
  const [showPassword, setShowPassword] = useState(false)

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Login submit', { role, ...form })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-6 md:px-10">
        {/* Role toggle (pill switch with sliding indicator) */}
        <div className="w-fit max-w-md mb-6">
          <div className="relative inline-flex bg-[#f5f5f5] rounded-full shadow-md p-1 w-64 overflow-hidden">
            {/* sliding indicator */}
            <div
              className={`absolute top-1 bottom-1 rounded-full transition-transform duration-200 ease-in-out pointer-events-none ${role === 'subadmin' ? 'translate-x-full' : 'translate-x-0'}`}
              style={{ left: 4, width: 'calc(50% - 4px)', background: 'linear-gradient(180deg,#B0FF1C,#40FF00)' }}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => setRole('customer')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRole('customer') }}
              aria-pressed={role === 'customer'}
              className={`relative z-10 w-1/2 text-center px-4 py-3 text-sm font-semibold rounded-full  cursor-pointer ${role === 'customer' ? 'text-black' : 'text-gray-700'}`}
            >
              Sub Admin
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setRole('subadmin')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRole('subadmin') }}
              aria-pressed={role === 'subadmin'}
              className={`relative z-10 w-1/2 text-center px-4 py-3 text-sm font-semibold rounded-full cursor-pointer ${role === 'subadmin' ? 'text-black' : 'text-gray-700'}`}
            >
              Customer
            </div>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="w-full max-w-md">
          <div className="bg-[#eafef2] rounded-3xl p-8 md:p-10  shadow-[-1px_3px_3px_0px_rgba(0,_0,_0,_0.1)]">
            <h2 className="text-3xl font-bold text-center text-[#14493b] mb-6">Sign in</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#0e6b53] mb-1">Email Or Phone No</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#a6a6a6" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"/>
                      </svg>
                    </span>
                    <input
                      name="identifier"
                      value={form.identifier}
                      onChange={onChange}
                      className="w-full pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a]"
                      placeholder="Email or Phone"
                    />
                  </div>
              </div>

              <div className="flex flex-col relative">
                <label className="text-xs font-bold text-[#0e6b53] mb-1">Enter password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#a6a6a6" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/>
                    </svg>
                  </span>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    className="w-full pl-10 px-3 py-2 rounded-md border border-transparent shadow-inner bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#bff86a] pr-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 text-gray-500"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#a6a6a6" d="M4.707 3.293a1 1 0 0 0-1.414 1.414l2.424 2.424c-1.43 1.076-2.678 2.554-3.611 4.422a1 1 0 0 0 0 .894C4.264 16.764 8.096 19 12 19c1.555 0 3.1-.355 4.53-1.055l2.763 2.762a1 1 0 0 0 1.414-1.414zm10.307 13.135c-.98.383-2 .572-3.014.572c-2.969 0-6.002-1.62-7.87-5c.817-1.479 1.858-2.62 3.018-3.437l2.144 2.144a3 3 0 0 0 4.001 4.001zm3.538-2.532c.483-.556.926-1.187 1.318-1.896c-1.868-3.38-4.9-5-7.87-5q-.168 0-.336.007L9.879 5.223A10.2 10.2 0 0 1 12 5c3.903 0 7.736 2.236 9.894 6.553a1 1 0 0 1 0 .894a13 13 0 0 1-1.925 2.865z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-3">

                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center text-gray-700">
                   
                    <a href="#" className="text-blue-600 font-medium ml-1 hover:underline">Forgot your password ?</a>
                  </div>

                  <div className="flex items-center text-gray-700">
                    
                    <a href="/signup" className="text-blue-600 font-medium ml-1 hover:underline">Dont have an Account ?</a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                  <input id="remember" name="remember" type="checkbox" checked={form.remember} onChange={onChange} className="h-3 w-3" />
                  <label htmlFor="remember" className="text-gray-700">Remember me</label>
                </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] text-black font-bold px-6 py-2 rounded-full border-2 border-black "
                >
                  submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login