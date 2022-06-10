import {React, useState, useEffect} from 'react'
import PropTypes from 'prop-types';


import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { FaBook } from 'react-icons/fa';
import { BsPeopleFill } from 'react-icons/bs';
import CourseEntryDescription from './CourseEntryDescription';

import studyPlanService from '../service/studyPlanService';


function CourseEntry({className, course}) {

  // Details visible flag
  const [showDetails, setShowDetails] = useState(false); 
  const [courseDetails, setCourseDetails] = useState({}); 

  
  // Handle Show Details Button
  const handleDetailsButton = () => {
    setShowDetails(!showDetails);
  }

  // FETCH COURSE DETAILS
  useEffect(()=>{
      const fetchData = async () => {
      try {
        const courseDetailFromDB = await studyPlanService.getCourseDetails(course.code);
        console.log({courseDetailFromDB})
        setCourseDetails(courseDetailFromDB);
      }
      catch (error) {
        console.error(`Couldn't Retrieve Data from API due to: ${error} `);
      }
    };

    if (showDetails) {
      fetchData();
    }
  }, [showDetails, course.code])


  return (
    <div className={`${className}`}>
      {/* 
        *   Main Info Entry
        */}
      <div className='h-16 lg:mx-6 md:mx-4 mx-2 mt-4 p-4
                      bg-primary-100 shadow-inner
                      grid grid-cols-course gap-4'
      >
      
        <div className='flex justify-start align-middle font-semibold text-lg text-paragraph-100'>
          <FaBook className='m-1 mx-4'/>
          <h3>{course.name}</h3>
        </div>

        <div className='flex justify-start py-1 text-paragraph-100'>
          CFU: {course.credits}
        </div>
        
        <div className='flex justify-start py-1 text-paragraph-100'>
          <BsPeopleFill className='m-1 mx-4'/>
          <h3>{course.students || 0}{course.maxStudents ? `/${course.maxStudents}` : ''}</h3>
        </div>

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
}


export default CourseEntry
