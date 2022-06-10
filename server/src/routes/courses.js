'use-strict';

const express = require('express');
const { logger } = require('../middleware/logging');

const { getAllCourses, getCourseDetails } = require('../handlers/coursesHandler');

const router = express.Router();

/*
 * GET api/courses/
 * Gets the main information of all courses, but not the details
 */
router.get('/', async (req, res) => {
  logger.info(`HANDLING Request-${req.id}`);

  try {
    // Retrieve data from service
    const courses = await getAllCourses();
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

  logger.info(`HANDLING Request-${req.id}, getting details for Course: ${code}`);

  try {
    // Retrieve data from service
    const details = await getCourseDetails(code);
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
