'use-strict';

const express = require('express');
const { logger } = require('../middleware/logging');

const courseService = require('../services/courseService');

const router = express.Router();

/*
 * GET api/courses/
 * Gets the main information of all courses, but not the details
 */
router.get('/', async (req, res) => {
  try {
    // Retrieve data from service
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);
    res.status(500).json(error.message);
  }
});

/*
 * GET /:code/details
 * Gets the details (preparatory/incompatible courses)
 */
router.get('/:code/details', async (req, res) => {
  // Retrieve code
  const { code } = req.params;

  try {
    // Retrieve data from service
    const details = await courseService.getCourseDetails(code);
    res.json(details);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error.message}`);
    // Handle Error type
    if (error.cause === 'NotFound') {
      res.status(404).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

/*
 * GET /incompatibles
 * Gets the incompatible courses given a list of courses
 */
router.post('/incompatibles', async (req, res) => {
  try {
    // Retrieve code
    const { courses } = req.body;
    // Retrieve data from service
    const details = await courseService.getIncompatiblesByCourseList(courses);
    res.json(details);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error.message}`);
    res.status(500).json(error.message);
  }
});

module.exports = router;
