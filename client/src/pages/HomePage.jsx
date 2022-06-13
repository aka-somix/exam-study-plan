import React from 'react'
import PropTypes from 'prop-types';

import Title from '../components/basics/Title';
import Button from '../components/basics/Button';
import CourseEntry from '../components/CourseEntry';

function HomePage({isLogged, courses, loading, studyPlanCourses, studentType }) {

  return (
    <div>
      {/* 
        *   -- CREATE STUDY PLAN BUTTON
        */}
      {
        isLogged && !studentType &&
        <Button label='Create Study Plan'/>
      }

      {/* 
        *   -- STUDY PLAN
        */}
      {
        isLogged && studentType &&
        <>
        <div className='flex justify-start items-center'>
          <Title value='My Study Plan'/>
          <Button className="mx-8 w-28" label='Edit'/>
        </div>
        <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
          { 
            loading ? <div>LOADING...</div>
            : (
              studyPlanCourses.map((course) => {
                return (
                  <CourseEntry key={course.code} course={course}/>
                )
              })
            )
          }
        </div>
        </>

      }

      {/* 
        *   -- All COURSES 
        */}
      <Title value='All Courses'/>
      <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
        { 
          loading ? <div>LOADING...</div>
          : (
            courses.map((course) => {
              return (
                <CourseEntry key={course.code} course={course}/>
              )
            })
          )
        }
      </div>

    </div>

  )
}

HomePage.propTypes = {
   courses: PropTypes.array.isRequired,
   isLogged: PropTypes.bool.isRequired,
}

export default HomePage;  
