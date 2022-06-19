import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types';


import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { RiAddCircleLine } from 'react-icons/ri';

import { FaBook, FaLock } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import CourseEntryDescription from './CourseEntryDescription';

import courseService from '../../service/courseService';


function CourseEntry({className, course, studyPlanCourses, editMode, add}) {

  // Details visible flag
  const [showDetails, setShowDetails] = useState(false); 
  const [detailsLoaded, setDetailsLoaded] = useState(false); 
  const [courseDetails, setCourseDetails] = useState({}); 
  
  // Disabled Course Management
  const [disabled, setDisabled] = useState(false); 
  const [disabledReason, setDisabledReason] = useState(''); 
  const [disableMessageShown, setDisableMessageShown] = useState(false);

  
  // Handle Show Details Button
  const handleDetailsButton = () => {
    setShowDetails(!showDetails);
  }

  // FETCH COURSE DETAILS
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const courseDetailFromDB = await courseService.getCourseDetails(course.code);
        setCourseDetails(courseDetailFromDB);
        setDetailsLoaded(true);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };

    if (showDetails && !detailsLoaded) {
      fetchData();
    }
  }, [showDetails, course.code, detailsLoaded])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseDetailFromDB = await courseService.getCourseDetails(course.code);
        setCourseDetails(courseDetailFromDB);
        setDetailsLoaded(true);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };

    if (editMode) {
      if (!detailsLoaded) fetchData();

      const spCodes = studyPlanCourses.map((c) => c.code);
      
      // ERROR 1 -> Missing preparatory code in study plan
      let errors = false;
      let errorsMessage = '';

      if (courseDetails.preparatoryCourse && !spCodes.includes(courseDetails.preparatoryCourse.code)){
        errors = true;
        errorsMessage = `Missing Preparatory: ${courseDetails.preparatoryCourse.name}`;
      }

      // ERROR 2 -> Incompatibles courses in study plan
      if(courseDetails.incompatibleCourses){

        const incompatibleFails = courseDetails.incompatibleCourses
          .filter((course) => spCodes.includes(course.code))
          .map((course) => course.name);
        
        if (incompatibleFails.length > 0){
          errors = true;
          errorsMessage = `Incompatible with: ${incompatibleFails.join(', ')}`;
        }

      }  
      
      setDisabled(errors);
      setDisabledReason(errorsMessage);
    }

  }, [course.code, editMode, detailsLoaded, courseDetails, studyPlanCourses])
  

  return (
    <div 
      className={`${className} relative`}
      onMouseEnter={() => setDisableMessageShown(true)}
      onMouseLeave={() => setDisableMessageShown(false)}
    >
      {/* 
        *   DISABLED Reason on Hover
        */
      
        editMode && disabled && disableMessageShown &&
        <div className='absolute top-0 left-0 h-16 w-3/4 lg:mx-6 md:mx-4 mx-2 mt-4 p-4 rounded-sm
                        bg-disabled-100 grid grid-cols-course gap-0'
        >
          <div className='flex items-center justify-start text-paragraph-100'>
            <FaLock className='py-1 mx-4 text-2xl'/> {disabledReason}
          </div>
        </div>
      }

      {/* 
        *   Main Info Entry
        */}
      <div 
        className={`h-16 lg:mx-6 md:mx-4 mx-2 mt-4 p-4 rounded-sm 
                    ${editMode && disabled ? 'bg-disabled-100': 'bg-primary-100'} 
                    shadow-inner grid grid-cols-course gap-0`}
      >
      
        <div className='grid grid-cols-title font-semibold text-lg text-paragraph-100'>
          <FaBook className='m-1 mx-4'/>
          <h3>{course.code}</h3>
          <h3>{course.name}</h3>
        </div>

        <div className='flex justify-start py-1 text-paragraph-100'>
          CFU: {course.credits}
        </div>
        
        <div className='flex justify-start py-1 text-paragraph-100'>
          <BsPeopleFill className='m-1 mx-4'/>
          <h3>{course.students || 0}{course.maxStudents ? `/${course.maxStudents}` : ''}</h3>
        </div>

        {
          editMode && !disabled ? (
          <button 
            className='m-auto text-paragraph-100'
            onClick={() => add(course)}>
            <RiAddCircleLine className='text-2xl inline'/> Add
          </button>
          )
          : <div></div>
        }

        <div className='flex justify-end align-top'>

          {
            showDetails ?
            (
            <MdOutlineExpandLess onClick={handleDetailsButton} className='text-4xl text-paragraph-100 cursor-pointer hover:text-accent-200 duration-100'/>
            )
            : 
            (<MdOutlineExpandMore onClick={handleDetailsButton} className='text-4xl text-paragraph-100 cursor-pointer hover:text-accent-200 duration-100'/>)
          }
        </div>
      </div>

      {/* 
        *   Description Panel
        */}
      {
        showDetails ? 
        (
          <CourseEntryDescription details={courseDetails} />
        ) 
        : null
      }

    </div>
  )
}

CourseEntry.propTypes = {
   course: PropTypes.object.isRequired,
   studyPlanCourses: PropTypes.array.isRequired,
   editMode: PropTypes.bool,
   add: PropTypes.func,
}


export default CourseEntry
