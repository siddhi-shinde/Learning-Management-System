const express = require("express");

const {
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResult,
  getMyQuizResults,
} = require("../controllers/quizController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// STUDENT QUIZ ROUTES
// ==========================================

// Get quiz history
router.get(
  "/my-results",
  protect,
  authorizeRoles("student"),
  getMyQuizResults
);

// Get specific quiz result
router.get(
  "/result/:quizId",
  protect,
  authorizeRoles("student"),
  getQuizResult
);

// Submit quiz
router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitQuiz
);

// ==========================================
// COURSE QUIZZES
// ==========================================

// Get quizzes for a course
router.get(
  "/course/:courseId",
  protect,
  authorizeRoles(
    "student",
    "instructor",
    "admin"
  ),
  getCourseQuizzes
);

// ==========================================
// QUIZ MANAGEMENT
// ==========================================

// Get single quiz
router.get(
  "/:id",
  protect,
  authorizeRoles(
    "student",
    "instructor",
    "admin"
  ),
  getQuizById
);

// Create quiz
router.post(
  "/",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  createQuiz
);

// Update quiz
router.put(
  "/:id",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  updateQuiz
);

// Delete quiz
router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  deleteQuiz
);

module.exports = router;