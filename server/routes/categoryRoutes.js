const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

// ==========================================
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

module.exports = router;