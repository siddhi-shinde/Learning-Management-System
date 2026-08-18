const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    videoPublicId: {
      type: String,
      default: "",
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    pdfPublicId: {
      type: String,
      default: "",
    },

    pptUrl: {
      type: String,
      default: "",
    },

    pptPublicId: {
      type: String,
      default: "",
    },

    materialUrl: {
      type: String,
      default: "",
    },

    materialPublicId: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lecture", lectureSchema);