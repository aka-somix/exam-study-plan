import React from 'react'

function CourseEntryDescription() {
  
  return (
    <div className='lg:mx-6 md:mx-4 mx-2 mb-2 p-4
                    bg-background-200
                    grid grid-rows-4 gap-8'
    >
      <div className='flex justify-start align-middle 
                      font-semibold text-l text-paragraph-200'>
        <h3>Incompatible Courses:</h3>
      </div>

      <div className='flex justify-start align-middle 
                      font-semibold text-l text-paragraph-200'>
        <h3>Preparatory Courses:</h3>
      </div>

    </div>
  )
}

export default CourseEntryDescription