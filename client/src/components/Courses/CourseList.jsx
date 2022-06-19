import React from 'react'
import PropTypes from 'prop-types';

import CourseEntry from './CourseEntry'

function CourseList({loading, courses, studyPlanCourses, editMode, addAction}) {
  return (
    <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
      { 
        loading ? <div>LOADING...</div>
        : (
          courses.map((course) => {
            return (
              <CourseEntry
                key={course.code}
                course={course}
                editMode={editMode}
                add={addAction}
                studyPlanCourses={studyPlanCourses}
              />
            )
          })
        )
      }
    </div>
  )
}

CourseList.propTypes = {
   courses: PropTypes.array.isRequired,
   loading: PropTypes.bool.isRequired,
   editMode: PropTypes.bool.isRequired,
   addAction: PropTypes.func.isRequired,
   studyPlanCourses: PropTypes.array.isRequired,
}

export default CourseList
