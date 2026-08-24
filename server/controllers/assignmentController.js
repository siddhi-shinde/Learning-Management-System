const Assignment = require("../models/assignmentModel");
const AssignmentSubmission = require(
  "../models/assignmentSubmissionModel"
);
const Course = require("../models/courseModel");

// ==========================================
// CREATE ASSIGNMENT
// Instructor can create assignment
// for their own course
// ==========================================
const createAssignment = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      dueDate,
      totalMarks,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !courseId ||
      !title ||
      !description ||
      !dueDate ||
      totalMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course, title, description, due date and total marks are required",
      });
    }

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // INSTRUCTOR CAN CREATE ONLY
    // FOR THEIR OWN COURSE
    // ==========================================

    if (
      req.user.role === "instructor" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can create assignments only for your own courses",
      });
    }

    // ==========================================
    // VALIDATE TOTAL MARKS
    // ==========================================

    const numericMarks =
      Number(totalMarks);

    if (
      Number.isNaN(numericMarks) ||
      numericMarks <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Total marks must be greater than 0",
      });
    }

    // ==========================================
    // VALIDATE DATE
    // ==========================================

    const assignmentDate =
      new Date(dueDate);

    if (
      Number.isNaN(
        assignmentDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    // ==========================================
    // CREATE ASSIGNMENT
    // ==========================================

    const assignment =
      await Assignment.create({
        courseId,
        title,
        description,
        dueDate: assignmentDate,
        totalMarks: numericMarks,
        createdBy: req.user._id,
      });

    // ==========================================
    // POPULATE RESPONSE
    // ==========================================

    const populatedAssignment =
      await Assignment.findById(
        assignment._id
      )
        .populate(
          "courseId",
          "title description thumbnail"
        )
        .populate(
          "createdBy",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message:
        "Assignment created successfully",
      assignment: populatedAssignment,
    });
  } catch (error) {
    console.error(
      "Create Assignment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ASSIGNMENTS BY COURSE
// ==========================================
const getCourseAssignments = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // GET ASSIGNMENTS
    // ==========================================

    const assignments =
      await Assignment.find({
        courseId,
      })
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          dueDate: 1,
        });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error(
      "Get Course Assignments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET SINGLE ASSIGNMENT
// ==========================================
const getAssignmentById = async (
  req,
  res
) => {
  try {
    const assignment =
      await Assignment.findById(
        req.params.id
      )
        .populate(
          "courseId",
          "title description thumbnail"
        )
        .populate(
          "createdBy",
          "name email"
        );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error(
      "Get Assignment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE ASSIGNMENT
// ==========================================
const updateAssignment = async (
  req,
  res
) => {
  try {
    const assignment =
      await Assignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course = await Course.findById(
      assignment.courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // OWNERSHIP CHECK
    // ==========================================

    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can update only your own course assignments",
      });
    }

    const {
      title,
      description,
      dueDate,
      totalMarks,
    } = req.body;

    // ==========================================
    // UPDATE FIELDS
    // ==========================================

    assignment.title =
      title ?? assignment.title;

    assignment.description =
      description ??
      assignment.description;

    if (dueDate) {
      const newDate =
        new Date(dueDate);

      if (
        Number.isNaN(
          newDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }

      assignment.dueDate = newDate;
    }

    if (
      totalMarks !== undefined
    ) {
      const numericMarks =
        Number(totalMarks);

      if (
        Number.isNaN(numericMarks) ||
        numericMarks <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Total marks must be greater than 0",
        });
      }

      assignment.totalMarks =
        numericMarks;
    }

    await assignment.save();

    const updatedAssignment =
      await Assignment.findById(
        assignment._id
      )
        .populate(
          "courseId",
          "title description thumbnail"
        )
        .populate(
          "createdBy",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(
      "Update Assignment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE ASSIGNMENT
// ==========================================
const deleteAssignment = async (
  req,
  res
) => {
  try {
    const assignment =
      await Assignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course = await Course.findById(
      assignment.courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // OWNERSHIP CHECK
    // ==========================================

    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can delete only your own course assignments",
      });
    }

    // ==========================================
    // DELETE SUBMISSIONS FIRST
    // ==========================================

    await AssignmentSubmission.deleteMany({
      assignmentId: assignment._id,
    });

    // ==========================================
    // DELETE ASSIGNMENT
    // ==========================================

    await assignment.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Assignment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Assignment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// SUBMIT ASSIGNMENT
// Student only
// ==========================================
const submitAssignment = async (
  req,
  res
) => {
  try {
    const studentId =
      req.user._id;

    const {
      assignmentId,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment ID is required",
      });
    }

    // ==========================================
    // CHECK ASSIGNMENT
    // ==========================================

    const assignment =
      await Assignment.findById(
        assignmentId
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // ==========================================
    // CHECK FILE
    // ==========================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload your assignment file",
      });
    }

    // ==========================================
    // CHECK DEADLINE
    // ==========================================

    const now = new Date();

    if (
      now >
      new Date(assignment.dueDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Assignment submission deadline has passed",
      });
    }

    // ==========================================
    // CHECK EXISTING SUBMISSION
    // ==========================================

    const existingSubmission =
      await AssignmentSubmission.findOne({
        assignmentId,
        studentId,
      });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted this assignment",
        submission:
          existingSubmission,
      });
    }

    // ==========================================
    // FILE URL
    // ==========================================

    // This will work with Multer/Cloudinary
    // depending on your upload middleware.
    const fileUrl =
      req.file.path ||
      req.file.secure_url ||
      req.file.url;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to process uploaded file",
      });
    }

    // ==========================================
    // CREATE SUBMISSION
    // ==========================================

    const submission =
      await AssignmentSubmission.create({
        assignmentId,
        studentId,
        fileUrl,
        submittedAt: new Date(),
      });

    // ==========================================
    // POPULATE RESPONSE
    // ==========================================

    const populatedSubmission =
      await AssignmentSubmission.findById(
        submission._id
      )
        .populate(
          "assignmentId",
          "title description dueDate totalMarks"
        )
        .populate(
          "studentId",
          "name email profileImage"
        );

    return res.status(201).json({
      success: true,
      message:
        "Assignment submitted successfully",
      submission:
        populatedSubmission,
    });
  } catch (error) {
    console.error(
      "Submit Assignment Error:",
      error
    );

    // Duplicate submission
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted this assignment",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY SUBMISSION
// Student only
// ==========================================
const getMySubmission = async (
  req,
  res
) => {
  try {
    const studentId =
      req.user._id;

    const {
      assignmentId,
    } = req.params;

    const submission =
      await AssignmentSubmission.findOne({
        assignmentId,
        studentId,
      })
        .populate(
          "assignmentId",
          "title description dueDate totalMarks"
        )
        .populate(
          "studentId",
          "name email profileImage"
        );

    return res.status(200).json({
      success: true,
      submitted:
        !!submission,
      submission:
        submission || null,
    });
  } catch (error) {
    console.error(
      "Get My Submission Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET STUDENT SUBMISSIONS
// Instructor/Admin
// ==========================================
const getAssignmentSubmissions =
  async (req, res) => {
    try {
      const {
        assignmentId,
      } = req.params;

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message:
            "Assignment not found",
        });
      }

      // ==========================================
      // CHECK COURSE
      // ==========================================

      const course =
        await Course.findById(
          assignment.courseId
        );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // ==========================================
      // INSTRUCTOR OWNERSHIP
      // ==========================================

      if (
        req.user.role !== "admin" &&
        course.instructorId.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can view submissions only for your own courses",
        });
      }

      const submissions =
        await AssignmentSubmission.find({
          assignmentId,
        })
          .populate(
            "studentId",
            "name email profileImage"
          )
          .populate(
            "assignmentId",
            "title totalMarks dueDate"
          )
          .sort({
            submittedAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: submissions.length,
        submissions,
      });
    } catch (error) {
      console.error(
        "Get Assignment Submissions Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

// ==========================================
// EVALUATE ASSIGNMENT
// Instructor/Admin
// ==========================================
const evaluateSubmission = async (
  req,
  res
) => {
  try {
    const {
      marks,
      feedback,
    } = req.body;

    const {
      submissionId,
    } = req.params;

    // ==========================================
    // VALIDATE MARKS
    // ==========================================

    if (marks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Marks are required",
      });
    }

    const numericMarks =
      Number(marks);

    if (
      Number.isNaN(numericMarks) ||
      numericMarks < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Marks must be a valid positive number",
      });
    }

    // ==========================================
    // FIND SUBMISSION
    // ==========================================

    const submission =
      await AssignmentSubmission.findById(
        submissionId
      ).populate(
        "assignmentId"
      );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    // ==========================================
    // CHECK TOTAL MARKS
    // ==========================================

    const totalMarks =
      submission.assignmentId
        .totalMarks;

    if (
      numericMarks >
      totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Marks cannot exceed ${totalMarks}`,
      });
    }

    // ==========================================
    // CHECK COURSE
    // ==========================================

    const course =
      await Course.findById(
        submission.assignmentId.courseId
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==========================================
    // OWNERSHIP CHECK
    // ==========================================

    if (
      req.user.role !== "admin" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can evaluate only your own course assignments",
      });
    }

    // ==========================================
    // UPDATE EVALUATION
    // ==========================================

    submission.marks =
      numericMarks;

    submission.feedback =
      feedback || "";

    await submission.save();

    const updatedSubmission =
      await AssignmentSubmission.findById(
        submission._id
      )
        .populate(
          "studentId",
          "name email profileImage"
        )
        .populate(
          "assignmentId",
          "title description dueDate totalMarks"
        );

    return res.status(200).json({
      success: true,
      message:
        "Assignment evaluated successfully",
      submission:
        updatedSubmission,
    });
  } catch (error) {
    console.error(
      "Evaluate Submission Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getMySubmission,
  getAssignmentSubmissions,
  evaluateSubmission,
};