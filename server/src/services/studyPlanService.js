'use-strict';

const localDB = require('../libs/sqliteLocalDB');

// const MIN_CREDITS = { part_time: 20, full_time: 60 };
// const MAX_CREDITS = { part_time: 40, full_time: 80 };

/*
 *  Handlers for courses methods
 */

/**
 * Retrieve all courses from database
 */
const getStudyPlanByUser = async (username) => {
  const database = await localDB.connect();

  const getAllQuery = `
    SELECT c.code, c.name, c.credits, c.max_students
    FROM Courses c INNER JOIN study_plan sp ON c.code = sp.courseCode   
    WHERE username = ?;
  `;

  const rows = await database.all(getAllQuery, [username]);

  // StudyPlan Not found Case
  if (rows.length === 0) {
    throw new Error(`NotFound: Study Plan not found for user ${username}!`);
  }

  // Assemble courses
  const courses = rows.map((item) => ({
    code: item.code,
    name: item.name,
    credits: item.credits,
    maxStudents: item.max_students,
  }));

  return courses;
};

/**
 *  Delete a Study plan from Database by Username
 */
const deletePlanByUser = async (username) => {
  const database = await localDB.connect();

  const deleteQuery = `
    DELETE *
    FROM StudyPlan sp
    WHERE username = ?;
  `;

  await database.run(deleteQuery, [username]);
};

module.exports = {
  /* Study Plan Methods */
  getStudyPlanByUser,
  deletePlanByUser,
};
