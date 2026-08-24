const mongoose = require("mongoose");

const assignmentSubmissionSchema =
  new mongoose.Schema(
    {
      // ==========================================
      // ASSIGNMENT
      // ==========================================

      assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
      },

      // ==========================================
      // STUDENT
      // ==========================================

      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // ==========================================
      // SUBMITTED FILE
      // ==========================================

      fileUrl: {
        type: String,
        required: [
          true,
          "Submission file is required",
        ],
      },

      // ==========================================
      // MARKS
      // ==========================================

      marks: {
        type: Number,
        default: null,
        min: 0,
      },

      // ==========================================
      // INSTRUCTOR FEEDBACK
      // ==========================================

      feedback: {
        type: String,
        default: "",
        trim: true,
      },

      // ==========================================
      // SUBMISSION DATE
      // ==========================================

      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

// ==========================================
// PREVENT DUPLICATE SUBMISSION
// ==========================================

assignmentSubmissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);