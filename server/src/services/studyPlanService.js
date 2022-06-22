'use-strict';

const localDB = require('../libs/sqliteLocalDB');
const { logger } = require('../middleware/logging');
const courseService = require('./courseService');

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
    SELECT c.code, c.name, c.credits, c.preparatoryCourseCode, c.students, c.max_students
    FROM Courses c INNER JOIN study_plan sp ON c.code = sp.courseCode
    WHERE username = ?;
  `;

  const rows = await database.all(getAllQuery, [username]);

  // Assemble courses
  const courses = rows.map((item) => ({
    code: item.code,
    name: item.name,
    credits: item.credits,
    students: item.students,
    maxStudents: item.max_students,
    preparatoryCourseCode: item.preparatoryCourseCode,
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

  let oldCourses = [];
  try {
    // Get actual courses
    oldCourses = (await getStudyPlanByUser(username)).courses;
  } catch (getError) {
    logger.warn('Requested a delete for a non existing study plan');
  }

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

  // Decrement students of all courses that used to be in study plan
  const removeUpdatePromises = oldCourses.map((course) => courseService.updateCourseStudents(course, 'sub'));
  await Promise.all(removeUpdatePromises);
};

/**
 * Save a new version of the StudyPlan
 */
const saveStudyPlanByUser = async (username, courses) => {
  const database = await localDB.connect();

  /*
   * STEP 1: Check if user actually have a StudyPlan and validate credits
   */
  const { studentTypeFromDB } = (await database.all('SELECT student_type AS studentTypeFromDB FROM user WHERE username = ?', [username]))[0];

  // StudyPlan Not found Case
  if (!studentTypeFromDB) {
    throw new Error(`BadRequest: No Stuy plan for ${username} found!`);
  }

  // Check Credits not valid case
  const credits = courses.map((c) => c.credits).reduce((prev, cur) => prev + cur, 0);
  if (credits < MIN_CREDITS[studentTypeFromDB] || credits > MAX_CREDITS[studentTypeFromDB]) {
    // Credits not in the right interval error.
    throw new Error(`BadRequest: Credits requested: ${credits} not in the interval [${MIN_CREDITS[studentTypeFromDB]}-${MAX_CREDITS[studentTypeFromDB]}]`);
  }

  // Retrieve existing studyplan
  const oldCourses = (await getStudyPlanByUser(username)).courses;

  // Retrieve refreshed version of new courses
  const newCourses = await courseService.getCoursesByCodeList(courses.map((c) => c.code));

  // Create codes lists
  const oldCoursesCodes = oldCourses.map((c) => c.code);
  const newCoursesCodes = newCourses.map((c) => c.code);

  // Separate NEW Courses and DELETED Courses
  const addingCourses = newCourses.filter((c) => !oldCoursesCodes.includes(c.code));
  const deletingCourses = oldCourses.filter((c) => !newCoursesCodes.includes(c.code));

  /*
   * Validate DELETED courses
   */

  // ERROR 1 -> DELETED course has a preparatoryFor still in the studyplan
  let preparatoryFails = newCourses.filter(
    // If a course marked for deletion is preparatory for any of
    // the new courses that we are trying to save -> FAIL!
    (course) => deletingCourses.map((c) => c.code).includes(course.preparatoryCourseCode),
  ).map((c) => c.name);

  if (preparatoryFails.length > 0) {
    throw new Error(`BadRequest: Cannot Delete ${preparatoryFails.join(', ')}. They are preparatory for other courses`);
  }

  /*
   * Validate NEW courses
   */
  // ERROR 1 -> if any NEW course has incompatibilities with any other in the study plan
  const incompatibleFails = (await courseService.getIncompatiblesByCourseList(newCourses))
    // If a course in studyplan is in the incompatible courses list -> FAIL!
    .filter((incompatibleCourseCode) => newCoursesCodes.includes(incompatibleCourseCode))
    .map((c) => c.name);

  if (incompatibleFails.length > 0) {
    throw new Error(`BadRequest: Cannot Add ${incompatibleFails.join(', ')}. They violate incompatibilities.`);
  }

  //  ERROR 2 -> if any NEW course has an unmet preparatory course in the studyPlan
  preparatoryFails = addingCourses.filter(
    // If a course marked for addition requires a preparatory not in the
    // study plan we are trying to save -> FAIL!
    (c) => c.preparatoryCourseCode && !newCoursesCodes.includes(c.preparatoryCourseCode),
  ).map((c) => c.name);

  if (preparatoryFails.length > 0) {
    throw new Error(`BadRequest: Cannot Add ${preparatoryFails.join(', ')}. They need preparatory courses not enlisted`);
  }

  if (addingCourses.length > 0) {
    /*
     * Validate Max Students
     */
    const maxStudentsFails = addingCourses.filter(
      (course) => course.maxStudents && course.students === course.maxStudents,
    ).map((c) => c.name);

    if (maxStudentsFails.length > 0) {
      throw new Error(`BadRequest: Cannot Add ${maxStudentsFails.join(', ')}. They reached the max students limit`);
    }

    /*
     * Insert new courses
     */
    const flatInsertValues = [];
    const insertPlaceholders = [];

    addingCourses.forEach((course) => {
      flatInsertValues.push(course.code, username);
      insertPlaceholders.push('(?, ?)');
    });

    const insertSQL = `
    INSERT INTO study_plan 
    VALUES ${insertPlaceholders.join(', ')};  
    `;

    const insertRes = await database.run(insertSQL, flatInsertValues);
    if (insertRes.changes === 0) {
      throw new Error('Database Error. Study Plan not saved.');
    }
  }

  /*
   * Delete outdated courses
   */

  if (deletingCourses.length > 0) {
    const flatDeleteValues = [];
    const deletePlaceholders = [];

    deletingCourses.forEach((course) => {
      flatDeleteValues.push(course.code, username);
      deletePlaceholders.push('(courseCode = ? AND username = ?)');
    });

    const deleteSQL = `
    DELETE FROM study_plan 
    WHERE ${deletePlaceholders.join(' OR ')};  
    `;

    const deleteRes = await database.run(deleteSQL, flatDeleteValues);
    if (deleteRes.changes === 0) {
      throw new Error('Database Error. Study Plan not saved.');
    }
  }

  /*
   * Update Students Number
   */

  const addUpdatePromises = addingCourses.map((course) => courseService.updateCourseStudents(course, 'add'));
  const removeUpdatePromises = deletingCourses.map((course) => courseService.updateCourseStudents(course, 'sub'));

  await Promise.all([...addUpdatePromises, ...removeUpdatePromises]);

  // Return the fresh saved study plan courses
  return newCourses;
};

module.exports = {
  /* Study Plan Methods */
  getStudyPlanByUser,
  createStudyPlanByUser,
  deletePlanByUser,
  saveStudyPlanByUser,
};
