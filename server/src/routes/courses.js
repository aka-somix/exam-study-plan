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
    res.statusCode = 500;
    res.send(error);
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
      res.statusCode = 404;
    } else {
      res.statusCode = 500;
    }
    res.send(error.message);
  }
});

module.exports = router;
