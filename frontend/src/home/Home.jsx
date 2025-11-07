import React from 'react'
import Logo from './components/Logo'

function Home() {
  return (
    <div>
    <div className='md:px-8 md:pt-6'>
      <div className='w-full bg-[rgba(246,246,246,0.45)] shadow-[1px_3px_4px_0px_rgba(0,_0,_0,_0.1)] md:rounded-full'>
        <div className='flex items-center justify-between py-4 px-2 '>
        <div className='flex gap-0 sm:gap-5'>
          <div className='pt-2 sm:pl-4 pr-2 md:hidden'>
            <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#9c9c9c" d="M20 17.5a1.5 1.5 0 0 1 .144 2.993L20 20.5H4a1.5 1.5 0 0 1-.144-2.993L4 17.5zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 0 1 0-3zm0-7a1.5 1.5 0 0 1 0 3H4a1.5 1.5 0 1 1 0-3z" stroke-width="0.5" stroke="#9c9c9c"/></g></svg>
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

    {/* content one */}

    <div className='flex justify-center items-center h-fit  flex-col'>
      <h1 className=' px-4 text-[1.80rem] sm:text-[2.25rem] pt-12 md:pt-24 md:text-[2.75rem] lg:text-[3rem] xl:text-[3.5rem] font-extrabold text-[#27563C]'><span className='sm:pl-16'>Drive Your Dream,</span><br/> We Finance the Journey.</h1>
      <h2 className='font-semibold text-[#737373]  px-4 text-sm md:text-xl'>Get fast, flexible, and affordable vehicle financing. <br/> 
     <span className='sm:pl-4'>whether it’s your first ride or your next upgrade.</span></h2>
      <div className='pt-9'>
      <button className='flex gap-2 justify-center rounded-lg items-center px-4 py-2 bg-gradient-to-b from-[#B0FF1C] to-[#40FF00] font-bold shadow-[0px_3px_2px_1px_rgba(0,_0,_0,_0.7)]'>Get Started
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 16 9"><path fill="currentColor" d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5"/><path fill="currentColor" d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z"/></svg>
      </button>
      </div>
      
    </div>

    {/* content two */}

    <div className="pt-14 md:pt-20  flex justify-between">
      <div className="bg-[#E0FCED] h-36 w-48 sm:h-40 sm:w-56 md:h-72 md:w-[50%]  rounded-r-3xl flex justify-center items-center flex-col text-center">
        <h1 className="font-extrabold text-[#27563C] text-lg sm:text-2xl md:text-5xl ">
          Over 10,000+
        </h1>
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-4 md:pt-2">
          Customers Financed Successfully
        </h3>
      </div>

      <div >
      <svg xmlns="http://www.w3.org/2000/svg" className='w-44 h-36 sm:w-64 sm:h-40 md:w-72 md:h-60 sm:mr-20 mr-3' width="305" height="305" viewBox="0 0 305 305" fill="none">
      <path d="M100.078 133.438C113.981 133.438 127.315 127.914 137.146 118.083C146.977 108.252 152.5 94.9188 152.5 81.0156C152.5 67.1125 146.977 53.7788 137.146 43.9478C127.315 34.1168 113.981 28.5938 100.078 28.5938C86.175 28.5938 72.8413 34.1168 63.0103 43.9478C53.1793 53.7788 47.6562 67.1125 47.6562 81.0156C47.6562 94.9188 53.1793 108.252 63.0103 118.083C72.8413 127.914 86.175 133.438 100.078 133.438ZM219.219 133.438C229.33 133.438 239.027 129.421 246.177 122.271C253.327 115.121 257.344 105.424 257.344 95.3125C257.344 85.2011 253.327 75.5039 246.177 68.3541C239.027 61.2042 229.33 57.1875 219.219 57.1875C209.107 57.1875 199.41 61.2042 192.26 68.3541C185.11 75.5039 181.094 85.2011 181.094 95.3125C181.094 105.424 185.11 115.121 192.26 122.271C199.41 129.421 209.107 133.438 219.219 133.438ZM133.438 219.219C133.438 193.37 144.875 170.2 162.946 154.473C159.618 153.168 156.075 152.499 152.5 152.5H47.6562C40.0727 152.5 32.7998 155.513 27.4374 160.875C22.075 166.237 19.0625 173.51 19.0625 181.094V182.523C19.0625 182.523 19.0625 238.281 100.078 238.281C113.822 238.281 125.241 236.68 134.705 234.011C133.856 229.126 133.432 224.177 133.438 219.219ZM290.703 219.219C290.703 238.178 283.172 256.36 269.766 269.766C256.36 283.172 238.178 290.703 219.219 290.703C200.26 290.703 182.078 283.172 168.672 269.766C155.266 256.36 147.734 238.178 147.734 219.219C147.734 200.26 155.266 182.078 168.672 168.672C182.078 155.266 200.26 147.734 219.219 147.734C238.178 147.734 256.36 155.266 269.766 168.672C283.172 182.078 290.703 200.26 290.703 219.219ZM212.432 172.878L203.473 199.832H174.937C167.969 199.832 165.119 208.772 170.8 212.804L193.732 229.074L184.878 255.685C182.705 262.233 190.167 267.761 195.8 263.768L219.219 247.155L242.637 263.768C248.27 267.771 255.733 262.243 253.56 255.685L244.696 229.074L267.637 212.804C273.328 208.772 270.468 199.832 263.501 199.832H234.964L226.005 172.878C223.832 166.358 214.606 166.358 212.432 172.878Z" fill="url(#paint0_linear_17_21)"/>
      <defs>
      <linearGradient id="paint0_linear_17_21" x1="155" y1="92.5" x2="154.883" y2="290.703" gradientUnits="userSpaceOnUse">
      <stop stop-color="#61FF09"/>
      <stop offset="1" stop-color="#3A9905"/>
      </linearGradient>
      </defs>
      </svg>
    </div>
    
    </div>

    <div className="pt-14 md:pt-20 pb-10  flex justify-between ">

      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className='w-44 h-36 sm:w-64 sm:h-40 md:w-72 md:h-60 sm:ml-20 ml-3' width="289" height="289" viewBox="0 0 289 289" fill="none">
        <path d="M144.38 24.0834C77.9096 24.0834 24.0833 78.03 24.0833 144.5C24.0833 210.97 77.9096 264.917 144.38 264.917C210.97 264.917 264.917 210.97 264.917 144.5C264.917 78.03 210.97 24.0834 144.38 24.0834ZM192.667 192.667C191.553 193.783 190.229 194.669 188.773 195.273C187.316 195.877 185.754 196.188 184.177 196.188C182.6 196.188 181.039 195.877 179.582 195.273C178.125 194.669 176.802 193.783 175.688 192.667L136.071 153.05C134.933 151.934 134.028 150.604 133.408 149.137C132.788 147.669 132.465 146.093 132.458 144.5V96.3334C132.458 89.7105 137.877 84.2917 144.5 84.2917C151.123 84.2917 156.542 89.7105 156.542 96.3334V139.563L192.667 175.688C197.363 180.384 197.363 187.97 192.667 192.667Z" fill="url(#paint0_linear_17_45)"/>
        <defs>
        <linearGradient id="paint0_linear_17_45" x1="144" y1="145" x2="144.5" y2="264.917" gradientUnits="userSpaceOnUse">
        <stop stop-color="#58FF07"/>
        <stop offset="1" stop-color="#359904"/>
        </linearGradient>
        </defs>
        </svg>
      </div>


      <div className="bg-[#E0FCED] h-36 w-48 sm:h-40 sm:w-56 md:h-72 md:w-[50%]  rounded-l-3xl flex justify-center items-center flex-col text-center">
        <h1 className="font-extrabold text-[#27563C] text-lg sm:text-2xl md:text-5xl ">
          Average  <br/>Approval Time
        </h1>
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-4 md:pt-2">
          Under 24 Hours
        </h3>
      </div>




    </div>


    
    

    </div>
  )
}

export default Home