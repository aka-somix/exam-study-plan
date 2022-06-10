const BASE_URL = new URL('http://localhost:3001/api');

/*
 * COURSES API 
 */
async function getAllCourses() {

  // call: GET /api/courses
  const response = await fetch(`${BASE_URL}/courses/`, { method: 'GET' });

  const coursesJson = await response.json();

  if (response.ok) {
    // return courses list
    return coursesJson.map((course) => ({ ...course }));

  } else {
    throw coursesJson;
  }
}

async function getCourseDetails(courseID) {

  // call: GET /api/courses
  const response = await fetch(`${BASE_URL}/courses/${courseID}/details`, { method: 'GET' });

  const courseDetailJson = await response.json();

  console.log({ courseDetailJson });

  if (response.ok) {
    // return courses list
    return courseDetailJson;

  } else {
    throw courseDetailJson;
  }
}


const studyPlanService = { getAllCourses, getCourseDetails };
export default studyPlanService;
