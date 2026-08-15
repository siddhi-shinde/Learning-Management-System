const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublishCourse,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all courses
router.get("/", getAllCourses);

// Get single course
router.get("/:id", getCourseById);

// ==========================================
// PROTECTED ROUTES
// ==========================================

// Create course
router.post(
  "/",
  protect,
  authorizeRoles("admin", "instructor"),
  createCourse
);

// Update course
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "instructor"),
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "instructor"),
  deleteCourse
);

// Publish / Unpublish
router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("admin", "instructor"),
  togglePublishCourse
);

module.exports = router;