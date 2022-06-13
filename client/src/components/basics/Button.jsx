import React from 'react'
import PropTypes from 'prop-types';


function Button({label, onClick, className}) {
  return (
    <div 
      onClick={onClick}
      className={`${className} group relative cursor-pointer overflow-hidden
                text-paragraph-100  hover:text-primary-200 bg-transparent
                text-center`}
    >
      <div className='absolute top-0 left-0 w-full h-full
                    bg-primary-200 duration-300 z-0
                      group-hover:translate-y-10' 
      />
      <h3 className='relative px-6 py-2 font-sans text-xl z-10 font-semibold select-none'>
        {label}
      </h3>

    </div>
  )
}

Button.propTypes = {
   onClick: PropTypes.func.isRequired,
   label: PropTypes.string.isRequired,
}

export default Button
