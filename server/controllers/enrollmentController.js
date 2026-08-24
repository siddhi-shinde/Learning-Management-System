const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");

// ==========================================
// ENROLL IN COURSE
// ==========================================
const enrollCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.body;

    // ==============================
    // COURSE ID REQUIRED
    // ==============================

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // ==============================
    // CHECK COURSE
    // ==============================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==============================
    // ONLY PUBLISHED COURSE
    // ==============================

    if (!course.published) {
      return res.status(400).json({
        success: false,
        message: "This course is not available for enrollment",
      });
    }

    // ==============================
    // CHECK EXISTING ENROLLMENT
    // ==============================

    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
        enrollment: existingEnrollment,
      });
    }

    // ==============================
    // CREATE ENROLLMENT
    // ==============================

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      progress: 0,
      completed: false,
    });

    // ==============================
    // POPULATE DATA
    // ==============================

    const populatedEnrollment =
      await Enrollment.findById(enrollment._id)
        .populate(
          "studentId",
          "name email profileImage"
        )
        .populate(
          {
            path: "courseId",
            populate: [
              {
                path: "instructorId",
                select: "name email",
              },
              {
                path: "category",
                select: "name",
              },
            ],
          }
        );

    return res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error(
      "Enroll Course Error:",
      error
    );

    // Handle duplicate index error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "You are already enrolled in this course",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET STUDENT ENROLLMENTS
// ==========================================
const getStudentEnrollments = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const enrollments =
      await Enrollment.find({
        studentId,
      })
        .populate(
          "studentId",
          "name email profileImage"
        )
        .populate(
          {
            path: "courseId",
            populate: [
              {
                path: "instructorId",
                select: "name email",
              },
              {
                path: "category",
                select: "name",
              },
            ],
          }
        )
        .sort({
          enrolledAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    console.error(
      "Get Student Enrollments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE COURSE PROGRESS
// ==========================================
const updateProgress = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const {
      enrollmentId,
      lectureId,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: "Enrollment ID is required",
      });
    }

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: "Lecture ID is required",
      });
    }

    // ==========================================
    // FIND ENROLLMENT
    // ==========================================

    const enrollment =
      await Enrollment.findOne({
        _id: enrollmentId,
        studentId,
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // ==========================================
    // CHECK IF ALREADY COMPLETED
    // ==========================================

    const alreadyCompleted =
      enrollment.completedLectures.some(
        (id) =>
          id.toString() ===
          lectureId.toString()
      );

    // ==========================================
    // ADD COMPLETED LECTURE
    // ==========================================

    if (!alreadyCompleted) {
      enrollment.completedLectures.push(
        lectureId
      );
    }

    // ==========================================
    // GET TOTAL LECTURES
    // ==========================================

    const Lecture = require(
      "../models/lectureModel"
    );

    const totalLectures =
      await Lecture.countDocuments({
        courseId: enrollment.courseId,
      });

    // ==========================================
    // CALCULATE PROGRESS
    // ==========================================

    const completedCount =
      enrollment.completedLectures.length;

    let progress = 0;

    if (totalLectures > 0) {
      progress = Math.round(
        (completedCount /
          totalLectures) *
          100
      );
    }

    // ==========================================
    // UPDATE ENROLLMENT
    // ==========================================

    enrollment.progress = progress;

    enrollment.completed =
      progress === 100;

    await enrollment.save();

    // ==========================================
    // GET UPDATED ENROLLMENT
    // ==========================================

    const updatedEnrollment =
      await Enrollment.findById(
        enrollment._id
      )
        .populate(
          "studentId",
          "name email profileImage"
        )
        .populate({
          path: "courseId",
          populate: [
            {
              path: "instructorId",
              select: "name email",
            },
            {
              path: "category",
              select: "name",
            },
          ],
        })
        .populate(
          "completedLectures"
        );

    return res.status(200).json({
      success: true,
      message:
        "Lecture completed and progress updated",
      enrollment: updatedEnrollment,
    });

  } catch (error) {
    console.error(
      "Update Progress Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  enrollCourse,
  getStudentEnrollments,
  updateProgress,
};