const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 2;
        },
        message:
          "At least 2 options are required",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  }
);

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    totalMarks: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 30,
      min: 1,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// CALCULATE TOTAL MARKS
// ==========================================

quizSchema.pre("save", function (next) {
  this.totalMarks = this.questions.reduce(
    (total, question) =>
      total + Number(question.marks || 0),
    0
  );

  next();
});

module.exports = mongoose.model(
  "Quiz",
  quizSchema
);