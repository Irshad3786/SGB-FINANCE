import React from 'react'
import Logo from './components/Logo'

function Home() {
  return (
    <div>
      <div className='w-full bg-[rgba(246,246,246,0.45)] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'>
        <div className='flex items-center justify-between py-4 px-2'>
        <div className='flex gap-0'>
        <svg xmlns="http://www.w3.org/2000/svg" className='pt-2' width="34" height="34" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#9c9c9c" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z" stroke-width="0.5" stroke="#9c9c9c"/></g></svg>
        <Logo />
        </div>
        <div className='flex justify-center items-center gap-2'>
        <button className='px-4 py-1 bg-[#E0FCED] font-bold border-[2px] border-black rounded-xl text-sm shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'>
          Login
        </button>
        <button className='px-4 py-1 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-bold border-[2px] border-black rounded-xl text-sm shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)]'>
          Sign up
        </button>
        </div>
        </div>
      </div>
        
    </div>
  )
}

export default Home