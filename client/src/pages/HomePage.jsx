import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types';

import courseService from '../service/courseService';

import Title from '../components/basics/Title';
import Button from '../components/basics/Button';
import CourseEntry from '../components/CourseEntry';
import StudyPlanCourseEntry from '../components/StudyPlanCourseEntry';
import CreateStudyPlanModal from '../components/CreateStudyPlanModal';

function HomePage({isLogged, courses, loading, studyPlanCourses, studentType, createStudyPlan, 
                   deleteStudyPlan, saveStudyPlan }) {

  const MIN_CREDITS = { 'part-time': 20, 'full-time': 60 };
  const MAX_CREDITS = { 'part-time': 40, 'full-time': 80 };

  // Show Create modal flag
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit Mode switch flag
  const [editMode, setEditMode] = useState(false);

  // Courses to be displayed if study plan is opened
  const [coursesToDisplay, setCoursesToDisplay] = useState([]);

  // Local Variable Studyplan
  const [localStudyPlan, setLocalStudyPlan] = useState([]);

  // Courses that cannot be added to StudyPlan
  const [notAddable, setNotAddable] = useState([]);

  // Courses that cannot be added to StudyPlan
  const [notRemovable, setNotRemovable] = useState([]);
  
  // Current CFU amount in Study plan
  const [currentCFU, setCurrentCFU] = useState([]);


  // Wrapper create
  const localCreateStudyPlan = async (studentType) => {
    setShowCreateModal(false);
    await createStudyPlan(studentType);
  }

  // Wrapper save
  const localSaveStudyPlan = async (courses) => {
    await saveStudyPlan(courses);
    setEditMode(false);
  }

  // Wrapper delete
  const localDeleteStudyPlan = async () => {
    await deleteStudyPlan();
    setEditMode(false);
  }

  // LOCALLY add a new course to study plan
  const addToStudyPlan = (course) => {
    setLocalStudyPlan([...localStudyPlan, course]);
  }
  // LOCALLY remove a course from study plan
  const removeFromStudyPlan = (course) => {
    setLocalStudyPlan(localStudyPlan.filter((c) => c.code !== course.code));
  }

  // Update local study plan
  useEffect(()=>{
    setLocalStudyPlan(studyPlanCourses);
  }, [editMode, studyPlanCourses]);

  // Get all displayable courses
  useEffect(() => {
    if (editMode){
      setCoursesToDisplay(courses.filter((c) => !localStudyPlan.map(sc => sc.code).includes(c.code)));
    }
    else {
      setCoursesToDisplay(courses);
    }
  }, [editMode, courses, localStudyPlan])

  // Get all Courses that could not be removed
  useEffect(() => {
    if (editMode){
      const notRemovableCoursesCodes = localStudyPlan
      .filter((course) => {
        const spPrepCourseCodes = localStudyPlan.map((c) =>c.preparatoryCourseCode);
        return spPrepCourseCodes.includes(course.code);
      })
      .map((course) => course.code);

      setNotRemovable(notRemovableCoursesCodes);
    }
  }, [editMode, localStudyPlan])

  // Get all Courses that could not be added 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1 - Incompatible courses
        const incompatiblesFromDB = await courseService.getIncompatiblesByCourseList(localStudyPlan);

        // 2 - Courses that don't have the preparatory in Study Plan
        const preparatoryMissing = courses
        .filter((course) => {
          const spCourseCodes = localStudyPlan.map((c) =>c.code);

          return course.preparatoryCourseCode && !spCourseCodes.includes(course.preparatoryCourseCode);
        })
        .map((course) => course.code);
        
        // 3 - Courses that reached the max students limit
        const maxStudentsReached = courses
        .filter((course) => course.students === course.maxStudents)
        .map((course) => course.code);

        // ASSEMBLE not addable
        setNotAddable([...incompatiblesFromDB, ...preparatoryMissing, ...maxStudentsReached]);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };
    if (editMode) {
      fetchData();
    }
  }, [editMode, localStudyPlan, courses]);

  // Refresh Total CFU Number
  useEffect(() => {
    setCurrentCFU(localStudyPlan.reduce((p,c) => p + c.credits, 0));
  }, [localStudyPlan])

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
          create={localCreateStudyPlan}
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
          
          {/* StudyPlan EDIT Button */}
          {
            !editMode && 
            <Button className="mx-8 w-28" label='Edit' onClick={() => {setEditMode(true)}}/>
          }
        
        </div>

        {/* BODY (StudyPlan Courses) */}

        <div className='w-full h-3/4 flex flex-col justify-start align-middle'>
          { 
            loading ? <div>LOADING...</div>
            : (
              localStudyPlan.map((course) => {
                return (
                  <StudyPlanCourseEntry 
                  key={course.code} 
                  course={course} 
                  remove={removeFromStudyPlan} 
                  disabled={notRemovable.includes(course.code)}
                    editMode={editMode}
                    />
                    )
                  })
                  )
                }
        </div>

        {/* FOOTER (StudyPlan Management Buttons) */}
        {
          editMode &&
          <div className='grid grid-flow-col'>
            <Button className="my-auto mx-8" label='Delete Plan' onClick={() => localDeleteStudyPlan()}/>  
            <Button className="my-auto mx-8" label='Cancel' onClick={() => {setEditMode(false)}}/>
            <Button 
              className="my-auto mx-8" 
              label='Save' 
              disabled={currentCFU > MAX_CREDITS[studentType] || currentCFU < MIN_CREDITS[studentType]} 
              onClick={() => localSaveStudyPlan(localStudyPlan)}
            />
            
            <div className='m-8 flex flex-col justify-evenly items-end'>
              <h3 className="font-2xl text-accent-200">
                Minimum CFU: <u>{MIN_CREDITS[studentType]}</u>
              </h3>
              <h3  className="font-2xl font-semibold text-primary-200">
                Current CFU: <b><u>{currentCFU}</u></b>
              </h3>
              <h3 className="font-2xl text-accent-200">
                Maximum CFU: <u>{MAX_CREDITS[studentType]}</u> 
              </h3> 
            </div>
          </div>
        }
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
                  disabled={notAddable.includes(course.code)}
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
