import React from 'react';
import PropTypes from 'prop-types';


function Title({value, className}) {
  return (
    <h1 className={`${className} font-sans text-3xl font-semibold text-accent-200
                    border-b-primary-200 border-b-4 w-fit my-6`} 
    >
      {value}
    </h1>
  )
}

Title.propTypes = {
  value: PropTypes.string.isRequired,
}

export default Title