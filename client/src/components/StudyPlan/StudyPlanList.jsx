import React from 'react'
import PropTypes from 'prop-types';

import StudyPlanCourseEntry from './StudyPlanCourseEntry'

function StudyPlanList({studyPlan, loading, editMode, removeAction}) {
  return (
    <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
      { 
        loading ? <div>LOADING...</div>
        : (
          studyPlan.map((course) => {
            return (
              <StudyPlanCourseEntry
                key={course.code} 
                course={course} 
                remove={removeAction} 
                studyPlanCourses={studyPlan}
                editMode={editMode}
              />
            )
          })
        )
      }
    </div>
  )
}

StudyPlanList.propTypes = {
   studyPlan: PropTypes.array.isRequired,
   loading: PropTypes.bool.isRequired,
   editMode: PropTypes.bool.isRequired,
   removeAction: PropTypes.func.isRequired,
}

export default StudyPlanList
