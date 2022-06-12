'use-strict';

const localDB = require('../libs/sqliteLocalDB');
const { logger } = require('../middleware/logging');

const MIN_CREDITS = { 'part-time': 20, 'full-time': 60 };
const MAX_CREDITS = { 'part-time': 40, 'full-time': 80 };

/*
 *  Handlers for courses methods
 */

/**
 * Retrieve all courses from database
 */
const getStudyPlanByUser = async (username) => {
  const database = await localDB.connect();

  const getAllQuery = `
    SELECT c.code, c.name, c.credits
    FROM Courses c INNER JOIN study_plan sp ON c.code = sp.courseCode
    WHERE username = ?;
  `;

  const rows = await database.all(getAllQuery, [username]);

  // Assemble courses
  const courses = rows.map((item) => ({
    code: item.code,
    name: item.name,
    credits: item.credits,
  }));

  const { studentType } = (await database.all('SELECT student_type AS studentType FROM user WHERE username = ?', [username]))[0];

  // StudyPlan Not found Case
  if (!studentType) {
    throw new Error(`NotFound: Study Plan not found for user ${username}!`);
  }

  return {
    studentType,
    courses,
  };
};

/**
 * Create a new Empty StudyPlan
 */
const createStudyPlanByUser = async (username, studentType) => {
  const database = await localDB.connect();

  const { studentTypeFromDB } = (await database.all('SELECT student_type AS studentTypeFromDB FROM user WHERE username = ?', [username]))[0];

  // StudyPlan Not found Case
  if (studentTypeFromDB) {
    throw new Error(`BadRequest: No user ${username}, or Study Plan already exists!`);
  }

  // Update Student to have a StudentType
  const createQuery = `
    UPDATE user
    SET student_type = ?
    WHERE username = ?
  `;

  const res = await database.run(createQuery, [studentType, username]);

  if (res.changes === 0) {
    throw new Error('Database Error. Studyplan not created.');
  }

  return {
    studentType,
    courses: [],
  };
};

/**
 *  Delete a Study plan from Database by Username
 */
const deletePlanByUser = async (username) => {
  const database = await localDB.connect();

  // Delete all study_plan entries
  const deleteQuery = `
  DELETE FROM study_plan
  WHERE username = ?;
  `;
  await database.run(deleteQuery, [username]);

  // Update Student to not have a type again
  const updateUserQuery = `
    UPDATE user
    SET student_type = NULL
    WHERE username = ?
  `;
  await database.run(updateUserQuery, [username]);
};

module.exports = {
  /* Study Plan Methods */
  getStudyPlanByUser,
  createStudyPlanByUser,
  deletePlanByUser,
};
