import React from 'react'
import PropTypes from 'prop-types';

import Title from '../components/basics/Title';
import CourseEntry from '../components/CourseEntry';

function HomePage({courses}) {

  return (
    <div>

      {/* 
       * //All COURSES 
       */}
      <Title value='All Courses'/>
      <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
        {
          courses.map((course) => {
            return (
              <CourseEntry course={course}/>
            )
          })
        }
      </div>

    </div>

  )
}

HomePage.propTypes = {
   courses: PropTypes.array.isRequired,
}

export default HomePage;  
