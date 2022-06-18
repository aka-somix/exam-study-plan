import React from 'react'
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

export default StudyPlanList