const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters"],
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

module.exports = mongoose.model("Course", courseSchema);