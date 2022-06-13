import React from 'react';
import PropTypes from 'prop-types';

import {MdOutlineError} from 'react-icons/md';

function ErrorBanner({className, message, severity}) {

  return (
    <div className={`${className} bg-error-200`}>
      <div className='px-10 py-2'>
        <h3 className='flex justify-start items-center text-2xl font-semibold text-paragraph-100'>
          <MdOutlineError className='mr-2 text-3xl'/> Oops!
        </h3>
        <p className='text-paragraph-100 mt-2 mx-10'>
          {message}
        </p>
      </div>
    </div>
  )
}

ErrorBanner.propTypes = { 
  message: PropTypes.string.isRequired,
  severity: PropTypes.string
};


export default ErrorBanner
