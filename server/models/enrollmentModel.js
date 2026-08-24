const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

  progress: {
  type: Number,
  default: 0,
  min: 0,
  max: 100,
},

completed: {
  type: Boolean,
  default: false,
},

completedLectures: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  },
],
   completedLectures: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  },
],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate enrollment
enrollmentSchema.index(
  {
    studentId: 1,
    courseId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
