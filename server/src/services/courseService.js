'use-strict';

const localDB = require('../libs/sqliteLocalDB');

/*
 *  Handlers for courses methods
 */

/**
 * Retrieve all courses from database
 */
const getAllCourses = async () => {
  const database = await localDB.connect();
  const courses = await database.all('SELECT * FROM courses;', []);

  return courses;
};

/**
 * Retrieve the details for a specific course
 */
const getCourseDetails = async (code) => {
  const database = await localDB.connect();
  const details = {
    preparatoryCourse: null,
    incompatibleCourses: [],
  };

  // Retrieve incompatible courses
  const incompatibleSQL = `
    SELECT c.name
    FROM courses c INNER JOIN incompatible i ON c.code = i.courseCodeWith
    WHERE i.courseCode = ?;
  `;
  const incompatibleCoursesRows = await database.all(incompatibleSQL, [code]);

  // Add incompatible courses to response payload
  details.incompatibleCourses = incompatibleCoursesRows.map((item) => (item.name));

  // Retrieve incompatible courses
  const preparatorySQL = `
    SELECT cp.name
    FROM courses cp INNER JOIN courses c ON cp.code = c.preparatoryCourseCode
    WHERE c.code = ?;
  `;
  const preparatoryCoursesRows = await database.all(preparatorySQL, [code]);

  // Add preparatory courses to response payload
  details.preparatoryCourse = preparatoryCoursesRows.length > 0 ? preparatoryCoursesRows[0] : null;

  // Return detail of course
  return details;
};

/**
 * TODO Description
 */
const getIncompatiblesByCourseList = async (courses) => {
  const database = await localDB.connect();

  const incompatibileCoursesPromises = courses.map((course) => database.all('SELECT courseCodeWith FROM incompatible WHERE courseCode = ?;', [course.code]));

  const incompatibileCourseEntries = (await Promise.all(incompatibileCoursesPromises));

  const incompatibileCourseCodes = [];

  incompatibileCourseEntries.forEach((entry) => {
    incompatibileCourseCodes.push(...entry.map((incompatible) => incompatible.courseCodeWith));
  });

  // Return detail of course
  return incompatibileCourseCodes;
};

module.exports = {
  getAllCourses,
  getCourseDetails,
  getIncompatiblesByCourseList,
};
