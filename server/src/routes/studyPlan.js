'use-strict';

const express = require('express');
// Import middlewares
const { logger } = require('../middleware/logging');
// Import handler
const studyPlanService = require('../services/studyPlanService');

// Define router
const router = express.Router();

/**
 * GET /:username
 * Returns the study plan associated to the user
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Ask Handler for StudyPlan
    const studyPlanFromDB = await studyPlanService.getStudyPlanByUser(username);
    res.status(200).json(studyPlanFromDB);
  } catch (error) {
    logger.error(`Request-${req.id} Failed due to: ${error}`);

    if (error.message.includes('NotFound')) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

module.exports = router;
