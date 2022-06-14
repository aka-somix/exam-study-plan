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
            className="flex items-center p-6 m-10 bg-background-100 cursor-pointer shadow-lg"
            onClick={() => create('full-time')}
          >            
            <h3>PART-TIME</h3>
          </div>
          <div 
            className="flex items-center p-6 m-10 bg-background-100 cursor-pointer shadow-lg"
            onClick={() => create('full-time')}
          >
            <h3>FULL-TIME</h3>
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