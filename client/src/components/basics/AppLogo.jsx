import React from 'react'
import { useNavigate } from "react-router-dom";

function AppLogo({className}) {
  
  const navigate = useNavigate();

  return (
    <div 
      className={`${className} cursor-pointer relative border-4 border-primary-200 select-none`}
      onClick={() => navigate('/')}
    >

    <h1   className='relative p-4 h-full text-primary-200 font-sans text-4xl font-semibold 
                    hover:bg-primary-200 hover:text-paragraph-100 duration-300'>
        Piano Studi App
      </h1>
    </div>
  )
}

export default AppLogo