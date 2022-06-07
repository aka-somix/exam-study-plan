'use-strict';

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// open the database
let database;
(async () => {
  // open the database
  database = await open({
    filename: path.join(__dirname, '..', 'data', 'studyPlan.db'),
    driver: sqlite3.Database,
  });
})();

/*
 *  Handlers for courses methods
 */

/**
 * Retrieve all courses from database
 */
const getAllCourses = async () => {
  const rows = await database.all('SELECT * FROM courses;', []);
  // Assemble courses
  const courses = rows.map((item) => ({
    code: item.code,
    name: item.name,
    credits: item.credits,
    max_students: item.max_students,
  }));

  return courses;
};

/**
 * Retrieve the details for a specific course
 */
const getCourseDetails = async (code) => {
  const details = {
    preparatoryCourses: [],
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
    SELECT c.name
    FROM courses c INNER JOIN preparatory p ON c.code = p.courseCode
    WHERE p.courseCodeFor = ?;
  `;
  const preparatoryCoursesRows = await database.all(preparatorySQL, [code]);

  // Add preparatory courses to response payload
  details.preparatoryCourses = preparatoryCoursesRows.map((item) => (item.name));

  // Return detail of course
  return details;
};

module.exports = {
  getAllCourses,
  getCourseDetails,
};
