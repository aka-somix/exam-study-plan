import React from 'react'
import PropTypes from 'prop-types';

import CourseEntry from './CourseEntry'

function CourseList({loading, courses, editMode, notAddable, addAction}) {
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
                disabled={notAddable.includes(course.code)}
                add={addAction}
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
   notAddable: PropTypes.array.isRequired,
   addAction: PropTypes.func.isRequired,
}

export default CourseList
