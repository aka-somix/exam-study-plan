'use-strict';

const express = require('express');
// Import middlewares
const { logger } = require('../middleware/logging');
const isLoggedIn = require('../middleware/logged-in');

// Import handler
const studyPlanService = require('../services/studyPlanService');

// Define router
const router = express.Router();

/**
 * GET /study-plan/
 * Returns the study plan associated to the user
 */
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const { username } = req.user;

    // Ask Service for StudyPlan
    const studyPlanFromDB = await studyPlanService.getStudyPlanByUser(username);
    res.status(200).json(studyPlanFromDB);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);

    if (error.message.includes('NotFound')) {
      res.status(404).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

/**
 * POST /study-plan/
 * Creates an empty study plan
 */
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { username } = req.user;

    const { studentType } = req.body;

    // Ask Service to Create StudyPlan
    const studyPlanFromDB = await studyPlanService.createStudyPlanByUser(username, studentType);
    res.status(201).json(studyPlanFromDB);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);

    if (error.message.includes('BadRequest')) {
      res.status(400).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

/**
 * DELETE /study-plan/
 * Deletes an existing study plan
 */
router.delete('/', isLoggedIn, async (req, res) => {
  try {
    const { username } = req.user;
    // Ask Service to delete study plan
    const studyPlanFromDB = await studyPlanService.deletePlanByUser(username);
    res.status(204).json(studyPlanFromDB);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);
    res.status(500).json(error.message);
  }
});

/**
 * PUT /study-plan/
 * Deletes an existing study plan
 */
router.put('/', isLoggedIn, async (req, res) => {
  try {
    const { username } = req.user;
    const { courses } = req.body;

    console.log(req.body);

    // Ask Service to update study plan
    await studyPlanService.saveStudyPlanByUser(username, courses);
    res.status(200).json({});
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);

    if (error.message.includes('BadRequest')) {
      res.status(400).json(error.message);
    } else {
      res.status(500).json(error.message);
    }
  }
});

module.exports = router;
