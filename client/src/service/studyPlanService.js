const BASE_URL = new URL('http://localhost:3001/api');

/*
 * COURSES API 
 */
async function getAllCourses() {

  // call: GET /api/courses
  const response = await fetch(`${BASE_URL}/courses/`, { method: 'GET', credentials: 'include' });

  const coursesJson = await response.json();

  if (response.ok) {
    // return courses list
    return coursesJson.map((course) => ({ ...course }));

  } else {
    throw coursesJson;
  }
}


const studyPlanService = { getAllCourses };
export default studyPlanService;
