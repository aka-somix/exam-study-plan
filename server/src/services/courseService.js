'use-strict';

const localDB = require('../libs/sqliteLocalDB');

/*
 *  Handlers for courses methods
 */

const assembleCourse = (course) => ({
  code: course.code,
  name: course.name,
  credits: course.credits,
  students: course.students,
  maxStudents: course.max_students,
  preparatoryCourseCode: course.preparatoryCourseCode,
});

/**
 * Retrieve all courses from database
 */
const getAllCourses = async () => {
  const database = await localDB.connect();
  const rows = await database.all('SELECT * FROM courses ORDER BY name ASC;', []);

  // Assemble courses
  const courses = rows.map((item) => (assembleCourse(item)));

  return courses;
};

/**
 * Retrieve course information by code
 */
const getCourseByCode = async (code) => {
  const database = await localDB.connect();
  const rows = await database.all('SELECT * FROM courses WHERE code = ?;', [code]);

  if (rows.length === 0) throw Error(`NotFound: No Course found with code ${code} `);
  if (rows.length > 1) throw Error(`Internal Error: Multiple Courses found with code ${code}`);
  return assembleCourse(rows[0]);
};

/**
 * Retrieve courses from a list of codes
 */
const getCoursesByCodeList = async (codeList) => {
  const database = await localDB.connect();

  const placeholders = codeList.map(() => '(?)');
  const courses = await database.all(`SELECT * FROM courses WHERE code IN (${placeholders.join(', ')});`, [...codeList]);
  return courses.map((course) => assembleCourse(course));
};

/**
 * Retrieve the details for a specific course
 */
const getCourseDetails = async (code) => {
  const database = await localDB.connect();

  // Validate course presence
  await getCourseByCode(code);

  const details = {
    preparatoryCourse: null,
    incompatibleCourses: [],
  };

  // Retrieve incompatible courses
  const incompatibleSQL = `
    SELECT c.code as code, c.name as name
    FROM courses c INNER JOIN incompatible i ON c.code = i.courseCodeWith
    WHERE i.courseCode = ?;
  `;
  const incompatibleCoursesRows = await database.all(incompatibleSQL, [code]);

  // Add incompatible courses to response payload
  details.incompatibleCourses = incompatibleCoursesRows;

  // Retrieve incompatible courses
  const preparatorySQL = `
    SELECT cp.code as code, cp.name as name
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
 * Get all the incompatible courses with a given list
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

const updateCourseStudents = async (course, mode) => {
  // mode validation
  if (!['add', 'sub'].includes(mode)) throw new Error('Design Error!');

  const database = await localDB.connect();

  const updateQuery = `
    UPDATE courses
    SET students = ?
    WHERE code = ?
  `;

  const res = await database.run(updateQuery, [mode === 'add' ? course.students + 1 : course.students - 1, course.code]);
  return res;
};

module.exports = {
  getAllCourses,
  getCourseByCode,
  getCoursesByCodeList,
  getCourseDetails,
  getIncompatiblesByCourseList,
  updateCourseStudents,
};
