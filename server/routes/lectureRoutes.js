const express = require("express");

const {
  createLecture,
  getCourseLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
} = require("../controllers/lectureController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// GET COURSE LECTURES
// ==========================================
router.get(
  "/course/:courseId",
  protect,
  getCourseLectures
);

// ==========================================
// GET SINGLE LECTURE
// ==========================================
router.get(
  "/single/:id",
  protect,
  getLectureById
);

// ==========================================
// CREATE LECTURE
// ==========================================
router.post(
  "/",
  protect,
  authorizeRoles("admin", "instructor"),
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "pdf",
      maxCount: 1,
    },
    {
      name: "ppt",
      maxCount: 1,
    },
    {
      name: "material",
      maxCount: 1,
    },
  ]),
  createLecture
);

// ==========================================
// UPDATE LECTURE
// ==========================================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "instructor"),
  updateLecture
);

// ==========================================
// DELETE LECTURE
// ==========================================
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "instructor"),
  deleteLecture
);

module.exports = router;