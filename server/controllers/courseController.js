const Course = require("../models/courseModel");
const User = require("../models/userModel");

// ==========================================
// CREATE COURSE
// ==========================================
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      category,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Only admin or instructor can create course
    if (!["admin", "instructor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admin or instructor can create courses",
      });
    }

    // If instructor creates course, instructorId = logged-in instructor
    // If admin creates course, instructorId must be provided
    let courseInstructor = req.user._id;

    if (req.user.role === "admin") {
      if (!req.body.instructorId) {
        return res.status(400).json({
          success: false,
          message: "Instructor ID is required for admin",
        });
      }

      const instructor = await User.findOne({
        _id: req.body.instructorId,
        role: "instructor",
      });

      if (!instructor) {
        return res.status(404).json({
          success: false,
          message: "Instructor not found",
        });
      }

      courseInstructor = instructor._id;
    }

    const course = await Course.create({
      title,
      description,
      price: price || 0,
      thumbnail: thumbnail || "",
      category: category || null,
      instructorId: courseInstructor,
      published: false,
    });

    const populatedCourse = await Course.findById(course._id)
      .populate("instructorId", "name email")
      .populate("category", "name");

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: populatedCourse,
    });
  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL COURSES
// ==========================================
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructorId", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get Courses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET SINGLE COURSE
// ==========================================
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructorId", "name email")
      .populate("category", "name");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE COURSE
// ==========================================
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Admin can update any course
    // Instructor can update only own course
    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own courses",
      });
    }

    const {
      title,
      description,
      price,
      thumbnail,
      category,
    } = req.body;

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ?? course.price;
    course.thumbnail = thumbnail ?? course.thumbnail;
    course.category = category ?? course.category;

    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate("instructorId", "name email")
      .populate("category", "name");

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE COURSE
// ==========================================
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Admin can delete any course
    // Instructor can delete only own course
    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own courses",
      });
    }

    await course.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// PUBLISH / UNPUBLISH COURSE
// ==========================================
const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Admin can publish any course
    // Instructor can publish own course
    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can publish only your own courses",
      });
    }

    course.published = !course.published;

    await course.save();

    return res.status(200).json({
      success: true,
      message: course.published
        ? "Course published successfully"
        : "Course unpublished successfully",
      course,
    });
  } catch (error) {
    console.error("Publish Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublishCourse,
};