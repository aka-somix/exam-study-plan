const BASE_URL = new URL('http://localhost:3001/api/study-plan');

/*
 * STUDY PLAN API 
 */

async function getStudyPlan() {

  // call: GET /api/study-plan/
  const response = await fetch(`${BASE_URL}/`, { method: 'GET', credentials: 'include' });


  const studyPlan = await response.json();
  if (response.ok) {
    // return found study plan
    return studyPlan;

  } else {
    throw studyPlan;
  }
}

async function createStudyPlan(studentType) {

  // call: POST /api/study-plan/
  const response = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentType }),
  });

  const studyPlanCreated = await response.json();


  if (response.ok) {
    // return newly created study plan
    return studyPlanCreated;

  } else {
    throw new Error(studyPlanCreated);
  }
}

async function deleteStudyPlan() {

  // call: DELETE /api/study-plan/
  const response = await fetch(`${BASE_URL}/`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.ok) {
    // return newly created study plan
    return {};

  } else {
    throw response;
  }
}

async function updateStudyPlan(courses) {
  // call: PUT api/study-plan/
  const response = await fetch(`${BASE_URL}/`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courses }),
  });

  const updateResponse = await response.json();

  if (response.ok) {
    // return newly created study plan
    return updateResponse;

  } else {
    throw updateResponse;
  }
}

const studyPlanService = { getStudyPlan, createStudyPlan, deleteStudyPlan, updateStudyPlan };
export default studyPlanService;
