import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types';

import courseService from '../service/courseService';

import Title from '../components/basics/Title';
import Button from '../components/basics/Button';
import CourseEntry from '../components/CourseEntry';
import StudyPlanCourseEntry from '../components/StudyPlanCourseEntry';
import CreateStudyPlanModal from '../components/CreateStudyPlanModal';

function HomePage({isLogged, courses, loading, studyPlanCourses, studentType, createStudyPlan, 
                   deleteStudyPlan, addToStudyPlan, removeFromStudyPlan, saveStudyPlan }) {

  // Show Create modal flag
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit Mode switch flag
  const [editMode, setEditMode] = useState(false);

  // Courses to be displayed if study plan is opened
  const [coursesToDisplay, setCoursesToDisplay] = useState([]);

  // Courses that cannot be added to StudyPlan
  const [incompatibles, setIncompatibles] = useState([]);


  // StudyPlan Creation Wrap method
  const create = async (studentType) => {
    setShowCreateModal(false);
    await createStudyPlan(studentType);
  }

  const localSaveStudyPlan = async (courses) => {
    await saveStudyPlan(courses);
    setEditMode(false);
  }

  const localDeleteStudyPlan = async () => {
    await deleteStudyPlan();
    setEditMode(false);
  }

  // Get all displayable courses
  useEffect(() => {
    if (editMode){
      setCoursesToDisplay(courses.filter((c) => !studyPlanCourses.map(sc => sc.code).includes(c.code)));
    }
    else {
      setCoursesToDisplay(courses);
    }
  }, [editMode, courses, studyPlanCourses])

  // Get all Courses incompatible with actual studyplan
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve incompatible courses
        const incompatiblesFromDB = await courseService.getIncompatiblesByCourseList(studyPlanCourses);
        setIncompatibles(incompatiblesFromDB);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };
    if (editMode) {
      fetchData();
    }
  }, [editMode, studyPlanCourses]);

  /*
   *  -- JSX Composition -- 
   */
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
        {/* HEADING */}
        <div className='flex justify-start items-center'>
        
          <Title value={`${studentType.toUpperCase()} Study Plan`}/>
          
          {/* StudyPlan Management Buttons */}
          {
            editMode ? (
              <>
                <Button className="mx-8 w-28" label='Delete Plan' onClick={() => localDeleteStudyPlan()}/>  
                <Button className="mx-8 w-28" label='Cancel' onClick={() => {setEditMode(false)}}/>
                <Button className="mx-8 w-28" label='Save' onClick={() => localSaveStudyPlan(studyPlanCourses)}/>  
              </>
              )
            : (
              <Button className="mx-8 w-28" label='Edit' onClick={() => {setEditMode(true)}}/>
            )
          }
        
        </div>

        {/* BODY (StudyPlan Courses) */}

        <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
          { 
            loading ? <div>LOADING...</div>
            : (
              studyPlanCourses.map((course) => {
                return (
                  <StudyPlanCourseEntry key={course.code} course={course} remove={removeFromStudyPlan}/>
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
            coursesToDisplay.map((course) => {
              return (
                <CourseEntry 
                  key={course.code} 
                  course={course} 
                  editMode={editMode} 
                  disabled={incompatibles.includes(course.code)}
                  add={addToStudyPlan}
                />
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
