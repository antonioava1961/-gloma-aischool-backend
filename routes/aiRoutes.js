const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Rutas académicas
router.post('/math/generate', aiController.generateMathProblem);
router.post('/physics/generate', aiController.generatePhysicsProblem);
router.post('/social/summary', aiController.generateSocialTimeline);
router.post('/english/generate', aiController.generateEnglishQuiz);
router.post('/chemistry/balance', aiController.balanceChemistryEquation);
router.post('/tutor/chat', aiController.chatWithTutor);

module.exports = router;
