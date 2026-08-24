const express = require("express");

const {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getMySubmission,
  getAssignmentSubmissions,
  evaluateSubmission,
} = require("../controllers/assignmentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();
// ==========================================
// COURSE ASSIGNMENTS
// ==========================================

router.get(
  "/course/:courseId",
  protect,
  authorizeRoles(
    "student",
    "instructor",
    "admin"
  ),
  getCourseAssignments
);

// ==========================================
// MY SUBMISSION
// ==========================================

router.get(
  "/submission/:assignmentId",
  protect,
  authorizeRoles("student"),
  getMySubmission
);

// ==========================================
// ALL SUBMISSIONS
// ==========================================

router.get(
  "/submissions/:assignmentId",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  getAssignmentSubmissions
);

// ==========================================
// GET SINGLE ASSIGNMENT
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles(
    "student",
    "instructor",
    "admin"
  ),
  getAssignmentById
);

// ==========================================
// CREATE ASSIGNMENT
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  createAssignment
);

// ==========================================
// SUBMIT ASSIGNMENT
// ==========================================

router.post(
  "/submit",
  protect,
  authorizeRoles("student"),
  submitAssignment
);

// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  updateAssignment
);

// ==========================================
// DELETE ASSIGNMENT
// ==========================================

router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  deleteAssignment
);

// ==========================================
// EVALUATE SUBMISSION
// ==========================================

router.put(
  "/submission/:submissionId/evaluate",
  protect,
  authorizeRoles(
    "instructor",
    "admin"
  ),
  evaluateSubmission
);


module.exports = router;