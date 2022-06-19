import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';


import { FaBook, FaLock } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import {MdDelete} from 'react-icons/md';

function StudyPlanCourseEntry({className, course, editMode, studyPlanCourses, remove}) {

  // Disabled SP Course Management
  const [disabled, setDisabled] = useState(false); 
  const [disabledReason, setDisabledReason] = useState(''); 
  const [disableMessageShown, setDisableMessageShown] = useState(false);

  useEffect(() => {
    if (editMode) {
      // ERROR 1 -> Missing preparatory code in study plan
      let errors = false;
      let errorsMessage = '';

      const preparatoryFails = studyPlanCourses
        .filter((spCourse) => spCourse.preparatoryCourseCode === course.code)
        .map((c) => c.name);

      if (preparatoryFails.length > 0){
        errors = true;
        errorsMessage = `Preparatory for: ${preparatoryFails.join(', ')}`;
      }
    
      setDisabled(errors);
      setDisabledReason(errorsMessage);
    }

  }, [course.code, editMode, studyPlanCourses])
  

  return (
    <div 
      className={`${className} relative`}
      onMouseEnter={() => setDisableMessageShown(true)}
      onMouseLeave={() => setDisableMessageShown(false)}
    >
      {/* 
        *   DISABLED Reason on Hover
        */
      
        editMode && disabled && disableMessageShown &&
        <div className='absolute top-0 left-0 h-16 w-3/4 lg:mx-6 md:mx-4 mx-2 mt-4 p-4 rounded-sm
                        border-4 border-accent-200 border-r-0
                        bg-background-200 grid grid-cols-course gap-0'
        >
          <div className='flex items-center justify-start text-error-200'>
            <FaLock className='py-1 mx-4 text-2xl'/> <u>{disabledReason}</u>
          </div>
        </div>
      }

      {/* 
        *   Main Info Entry
        */}
      <div className={`h-16 lg:mx-6 md:mx-4 mx-2 mt-4 p-4 rounded-sm
                      ${disabled && editMode? 'border-4 border-accent-200' : ''}
                      bg-background-200 shadow-inner
                      grid grid-cols-STcourse gap-4`}
      >
      
        <div className='grid grid-cols-title font-semibold text-lg text-paragraph-200'>
          {disabled && editMode ? <FaLock className='m-1 mx-4'/> : <FaBook className='m-1 mx-4'/>}
          <h3>{course.code}</h3>
          <h3>{course.name}</h3>
        </div>

        <div className='flex justify-start py-1 text-paragraph-200'>
          CFU: {course.credits}
        </div>

        <div className='flex justify-start py-1 text-paragraph-200'>
          <BsPeopleFill className='m-1 mx-4'/>
          <h3>{course.students || 0}{course.maxStudents ? `/${course.maxStudents}` : ''}</h3>
        </div>
        
        {
          editMode && !disabled ? (
            <button 
              className='text-paragraph-200 font-semibold m-auto'
              onClick={() => remove(course)}
            >
              <MdDelete className='text-2xl inline'/> Remove
            </button>
          ) : <div></div>
        }
      </div>
    </div>
  )
}

StudyPlanCourseEntry.propTypes = {
   course: PropTypes.object.isRequired,
   editMode: PropTypes.bool.isRequired,
   remove: PropTypes.func,
}


export default StudyPlanCourseEntry
