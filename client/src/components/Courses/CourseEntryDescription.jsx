import React from 'react'
import PropTypes from 'prop-types';

function CourseEntryDescription({details}) {
  
  return (
    <div className='lg:mx-6 md:mx-4 mx-2 mb-2 p-4
                    bg-background-200
                    grid grid-rows-2 gap-4'
    >
      {/* 
        *   CORSI INCOMPATIBILI
        */}
      <div className='flex flex-col justify-start font-semibold text-l text-paragraph-200'>
        <h3> <u>Incompatible Courses:</u> </h3>
        <div className='mt-2 flex flex-col justify-evenly'>
            {
              details.incompatibleCourses &&
              details.incompatibleCourses.length > 0 ?
                details.incompatibleCourses.map((course) => {
                  return <p className='font-medium text-sm ml-3' key={course.code}> {course.name} </p>
                })
              :
              <p className='font-medium text-sm ml-3'> None. </p>
            }
        </div>
      </div>

      {/* 
        *   CORSO PROPEDEUTICO
        */}
      <div className='flex flex-col justify-start font-semibold text-l text-paragraph-200'>
        <h3> <u>Preparatory Course:</u> </h3>
        <div className='mt-2 flex flex-col justify-evenly'>
            {
              <p className='font-medium text-sm ml-3'> { details.preparatoryCourse ? details.preparatoryCourse.name : 'None.'} </p>
            }
        </div>
      </div>
    </div>
  )
}

CourseEntryDescription.propTypes = {
   details: PropTypes.object.isRequired,
}

export default CourseEntryDescription
