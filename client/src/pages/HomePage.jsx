import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types';

import Title from '../components/basics/Title';
import Button from '../components/basics/Button';
import CreateStudyPlanModal from '../components/CreateStudyPlanModal';
import StudyPlanList from '../components/StudyPlan/StudyPlanList';
import CourseList from '../components/Courses/CourseList';


const MIN_CREDITS = { 'part-time': 20, 'full-time': 60 };
const MAX_CREDITS = { 'part-time': 40, 'full-time': 80 };

function HomePage({isLogged, courses, loading, studyPlanCourses, studentType, createStudyPlan, 
                   deleteStudyPlan, saveStudyPlan }) {

  // Show Create modal flag
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit Mode switch flag
  const [editMode, setEditMode] = useState(false);

  // Courses to be displayed if study plan is opened
  const [coursesToDisplay, setCoursesToDisplay] = useState([]);

  // Local Variable Studyplan
  const [localStudyPlan, setLocalStudyPlan] = useState([]);
  
  // Current CFU amount in Study plan
  const [currentCFU, setCurrentCFU] = useState([]);

  // Action loading
  const [actionLoading, setActionLoading] = useState(false);


  // Wrapper create
  const localCreateStudyPlan = async (studentType) => {
    setShowCreateModal(false);
    setActionLoading(true);
    try{
      await createStudyPlan(studentType);
    }
    finally {
      setActionLoading(false);
    }
  }

  // Wrapper save
  const localSaveStudyPlan = async (courses) => {
    setActionLoading(true);
    try{
      await saveStudyPlan(courses);
    }
    finally {
      setActionLoading(false);
      setEditMode(false);
    }
  }

  // Wrapper delete
  const localDeleteStudyPlan = async () => {
    setActionLoading(true);
    try{
      await deleteStudyPlan();
    }
    finally {
      setActionLoading(false);
      setEditMode(false);
    }
  }

  // LOCALLY add a new course to study plan
  const addToStudyPlan = (course) => {
    setLocalStudyPlan([...localStudyPlan, course]);
  }
  // LOCALLY remove a course from study plan
  const removeFromStudyPlan = (course) => {
    setLocalStudyPlan(localStudyPlan.filter((c) => c.code !== course.code));
  }


  // Update editMode on logout
  useEffect(() => {
    if(!isLogged)setEditMode(false);
  }, [isLogged])

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
          disabled={actionLoading}
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
        
        <StudyPlanList
          loading={loading}
          editMode={editMode}
          studyPlan={localStudyPlan}
          removeAction={removeFromStudyPlan}
        />

        {/* FOOTER (StudyPlan Management Buttons) */}
        {
          editMode &&
          <div className='grid grid-flow-col'>
            <Button 
              className="my-auto mx-8" 
              label='Delete Plan' 
              onClick={() => localDeleteStudyPlan()}
              disabled={actionLoading}
            />  
            <Button 
              className="my-auto mx-8" 
              label='Cancel' 
              onClick={() => {setEditMode(false)}}
              disabled={actionLoading}
            />
            
            <Button 
              className="my-auto mx-8" 
              label='Save' 
              disabled={currentCFU > MAX_CREDITS[studentType] || currentCFU < MIN_CREDITS[studentType] || actionLoading} 
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
      <CourseList 
        loading={loading}
        courses={coursesToDisplay}
        editMode={editMode}
        addAction={addToStudyPlan}
        studyPlanCourses={localStudyPlan}
      />
    </div>

  )
}

HomePage.propTypes = {
   courses: PropTypes.array.isRequired,
   isLogged: PropTypes.bool.isRequired,
}

export default HomePage;  
