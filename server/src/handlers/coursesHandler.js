const fakeCourses = require('../data/fakeCourses.json').courses;

/*
 *  Handlers for courses methods
 */

/**
 * Retrieve all courses from database
 */
const getAllCourses = async () => new Promise((resolve) => {
  // TODO Implement REAL Method
  resolve(fakeCourses);
});

/**
 * Retrieve the details for a specific course
 */
const getCourseDetails = async (code) => new Promise((resolve, reject) => {
  // TODO Implement REAL Method

  if (code === '404') {
    const error = Error('Could not find course 404');
    error.cause = 'NotFound';
    reject(error);
  }

  const details = {
    preparatoryCourses: ['Course-X', 'Course-Y'],
    incompatibleCourses: ['Course-Z'],
  };

  resolve(details);
});

module.exports = {
  getAllCourses,
  getCourseDetails,
};
