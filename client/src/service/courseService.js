const BASE_URL = new URL('http://localhost:3001/api/courses');

/*
 * COURSES API 
 */
async function getAllCourses() {

  // call: GET /api/courses
  const response = await fetch(`${BASE_URL}/`, { method: 'GET' });

  const coursesJson = await response.json();

  if (response.ok) {
    // return courses list
    return coursesJson;

  } else {
    throw coursesJson;
  }
}

async function getCourseDetails(courseID) {

  // call: GET /api/courses
  const response = await fetch(`${BASE_URL}/${courseID}/details`, { method: 'GET' });

  const courseDetailJson = await response.json();

  console.log({ courseDetailJson });

  if (response.ok) {
    // return courses list
    return courseDetailJson;

  } else {
    throw courseDetailJson;
  }
}


const courseService = { getAllCourses, getCourseDetails };
export default courseService;
