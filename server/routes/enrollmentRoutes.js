const express = require("express");

const {
  enrollCourse,
  getStudentEnrollments,
  updateProgress,
} = require("../controllers/enrollmentController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// STUDENT ENROLLMENT
// ==========================================

// Enroll in course
router.post(
  "/",
  protect,
  authorizeRoles("student"),
  enrollCourse
);

// Get logged-in student's courses
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentEnrollments
);

// Update course progress
router.put(
  "/progress",
  protect,
  authorizeRoles("student"),
  updateProgress
);

module.exports = router;