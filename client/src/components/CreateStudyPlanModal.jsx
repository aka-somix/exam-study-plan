import React from 'react';
import Button from './basics/Button';

import PropTypes from 'prop-types';


function CreateStudyPlanModal({onCancel, create}) {
  return (
    <div className='bg-black/[0.3] fixed top-0 left-0 w-screen h-screen z-20
                    flex justify-center items-center'>
      
      <div className='flex flex-col'>
        
        <div className="relative flex p-10">
          <div 
            className="flex flex-col rounded-sm justify-between items-center p-6 m-10 bg-background-100 cursor-pointer shadow-lg"
            onClick={() => create('part-time')}
          >            
            <img
              className='w-32 m-2 mb-4'
              src='./50.png' alt='50%' 
            />
            <h3 className='font-semibold text-2xl'>Part-Time</h3>
          </div>
          <div 
              className="flex flex-col rounded-sm justify-between items-center p-6 m-10 bg-background-100 cursor-pointer shadow-lg"
              onClick={() => create('full-time')}
            >            
              <img
                className='w-32 m-2 mb-4'
                src='./100.png' alt='100%' 
              />
              <h3 className='font-semibold text-2xl'>Full-Time</h3>
            </div>
        </div>
        
        <Button className='mx-10 my-6 shadow-lg' label='Cancel' onClick={onCancel}/>
      </div>
    </div>
  )
}

CreateStudyPlanModal.propTypes = {
   onCancel: PropTypes.func.isRequired,
   create: PropTypes.func.isRequired,
}

export default CreateStudyPlanModal