const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // ==========================================
    // COURSE
    // ==========================================

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },

    // ==========================================
    // ASSIGNMENT TITLE
    // ==========================================

    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      minlength: [
        3,
        "Assignment title must be at least 3 characters",
      ],
      maxlength: [
        150,
        "Assignment title cannot exceed 150 characters",
      ],
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: [true, "Assignment description is required"],
      trim: true,
    },

    // ==========================================
    // DUE DATE
    // ==========================================

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },

    // ==========================================
    // TOTAL MARKS
    // ==========================================

    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: [1, "Total marks must be at least 1"],
    },

    // ==========================================
    // CREATED BY
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Assignment",
  assignmentSchema
);