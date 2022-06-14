import {React, useState} from 'react'
import PropTypes from 'prop-types';

import Title from '../components/basics/Title';
import Button from '../components/basics/Button';
import CourseEntry from '../components/CourseEntry';
import CreateStudyPlanModal from '../components/CreateStudyPlanModal';

function HomePage({isLogged, courses, loading, studyPlanCourses, studentType, createStudyPlan }) {

  const [showCreateModal, setShowCreateModal] = useState(false);

  const create = async (studentType) => {
    await createStudyPlan(studentType);
    setShowCreateModal(false);
  }

  return (
    <div>
      {/* 
        *   -- CREATE STUDY PLAN MODAL
        */}
      {
        showCreateModal &&
        <CreateStudyPlanModal 
          onCancel={() => {setShowCreateModal(false);}}
          create={create}
        />
      }

      {/* 
        *   -- CREATE STUDY PLAN BUTTON
        */}
      {
        isLogged && !studentType &&
        <Button 
          className='float-right'
          label='Create Study Plan'
          onClick={() => {setShowCreateModal(true)}}
        />
      }

      {/* 
        *   -- STUDY PLAN
        */}
      {
        isLogged && studentType &&
        <>
        <div className='flex justify-start items-center'>
          <Title value={`${studentType.toUpperCase()} Study Plan`}/>
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
