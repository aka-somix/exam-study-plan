/* eslint-disable consistent-return */

'use-strict';

const express = require('express');
const { validationResult } = require('express-validator');
const { logger } = require('../middleware/logging');
const { validateGetCourseDetails } = require('../validations/courseValidations');

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
 * GET /:code
 * Gets the course information
 */
router.get('/:code', validateGetCourseDetails, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Retrieve code
  const { code } = req.params;

  try {
    // Retrieve data from service
    const details = await courseService.getCourseByCode(code);
    res.json(details);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error.message}`);
    // Handle Error type
    if (error.message.includes('NotFound')) {
      res.status(404).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

/*
 * GET /:code/details
 * Gets the details (preparatory/incompatible courses)
 */
router.get('/:code/details', validateGetCourseDetails, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Retrieve code
  const { code } = req.params;

  try {
    // Retrieve data from service
    const details = await courseService.getCourseDetails(code);
    res.json(details);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error.message}`);
    // Handle Error type
    if (error.message.includes('NotFound')) {
      res.status(404).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

/*
 * POST /incompatibles
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
