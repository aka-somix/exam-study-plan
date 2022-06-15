import React from 'react'
import PropTypes from 'prop-types';


import { FaBook } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import {MdDelete} from 'react-icons/md';

function StudyPlanCourseEntry({className, course, editMode, disabled, remove}) {

  return (
    <div className={`${className}`}>
      {/* 
        *   Main Info Entry
        */}
      <div className={`h-16 lg:mx-6 md:mx-4 mx-2 mt-4 p-4
                      ${disabled && editMode? 'border-4 border-accent-100' : ''}
                      bg-paragraph-100 shadow-inner
                      grid grid-cols-STcourse gap-4`}
      >
      
        <div className='flex justify-start align-middle font-semibold text-lg text-accent-100'>
          <FaBook className='m-1 mx-4'/>
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
   disabled: PropTypes.bool,
   remove: PropTypes.func,
}


export default StudyPlanCourseEntry
