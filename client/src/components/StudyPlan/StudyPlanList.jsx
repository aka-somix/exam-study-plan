import React from 'react'
import PropTypes from 'prop-types';

import StudyPlanCourseEntry from './StudyPlanCourseEntry'

function StudyPlanList({studyPlan, loading, editMode, removeAction, notRemovable}) {
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
                disabled={notRemovable.includes(course.code)}
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
   notRemovable: PropTypes.array.isRequired,
   removeAction: PropTypes.func.isRequired,
}

export default StudyPlanList
