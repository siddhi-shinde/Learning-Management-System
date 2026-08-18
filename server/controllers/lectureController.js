const Lecture = require("../models/lectureModel");
const Course = require("../models/courseModel");
const cloudinary = require("../config/cloudinary");

// ==========================================
// CHECK COURSE ACCESS
// ==========================================
const checkCourseAccess = async (courseId, user) => {
  const course = await Course.findById(courseId);

  if (!course) {
    return {
      allowed: false,
      status: 404,
      message: "Course not found",
    };
  }

  // Admin can manage all courses
  if (user.role === "admin") {
    return {
      allowed: true,
      course,
    };
  }

  // Instructor can manage own courses
  if (
    user.role === "instructor" &&
    course.instructorId.toString() === user._id.toString()
  ) {
    return {
      allowed: true,
      course,
    };
  }

  return {
    allowed: false,
    status: 403,
    message: "You are not authorized to manage this course",
  };
};

// ==========================================
// UPLOAD FILE TO CLOUDINARY
// ==========================================
const uploadToCloudinary = (file, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(file.buffer);
  });
};

// ==========================================
// CREATE LECTURE
// ==========================================
const createLecture = async (req, res) => {
  try {
    const {
      courseId,
      title,
      duration,
      order,
    } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and lecture title are required",
      });
    }

    const access = await checkCourseAccess(
      courseId,
      req.user
    );

    if (!access.allowed) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please upload at least one file",
    //   });
    // }

    let videoUrl = "";
    let videoPublicId = "";

    let pdfUrl = "";
    let pdfPublicId = "";

    let pptUrl = "";
    let pptPublicId = "";

    let materialUrl = "";
    let materialPublicId = "";

    // ----------------------------
    // Video
    // ----------------------------
    if (req.files.video) {
      const result = await uploadToCloudinary(
        req.files.video[0],
        "video",
        "lms/lectures/videos"
      );

      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
    }

    // ----------------------------
    // PDF
    // ----------------------------
    if (req.files.pdf) {
      const result = await uploadToCloudinary(
        req.files.pdf[0],
        "raw",
        "lms/lectures/pdfs"
      );

      pdfUrl = result.secure_url;
      pdfPublicId = result.public_id;
    }

    // ----------------------------
    // PPT
    // ----------------------------
    if (req.files.ppt) {
      const result = await uploadToCloudinary(
        req.files.ppt[0],
        "raw",
        "lms/lectures/ppt"
      );

      pptUrl = result.secure_url;
      pptPublicId = result.public_id;
    }

    // ----------------------------
    // Study Material
    // ----------------------------
    if (req.files.material) {
      const result = await uploadToCloudinary(
        req.files.material[0],
        "raw",
        "lms/lectures/materials"
      );

      materialUrl = result.secure_url;
      materialPublicId = result.public_id;
    }

    const lecture = await Lecture.create({
      courseId,
      title,
      videoUrl,
      videoPublicId,
      pdfUrl,
      pdfPublicId,
      pptUrl,
      pptPublicId,
      materialUrl,
      materialPublicId,
      duration: duration || 0,
      order: order || 1,
    });

    const populatedLecture = await Lecture.findById(
      lecture._id
    ).populate("courseId", "title");

    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture: populatedLecture,
    });
  } catch (error) {
    console.error("Create Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};

// ==========================================
// GET COURSE LECTURES
// ==========================================
const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lectures = await Lecture.find({
      courseId,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      count: lectures.length,
      lectures,
    });
  } catch (error) {
    console.error("Get Lectures Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get lectures",
    });
  }
};

// ==========================================
// GET SINGLE LECTURE
// ==========================================
const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(
      req.params.id
    ).populate("courseId", "title instructorId");

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Get Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

// ==========================================
// UPDATE LECTURE
// ==========================================
const updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(
      req.params.id
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const access = await checkCourseAccess(
      lecture.courseId,
      req.user
    );

    if (!access.allowed) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    const {
      title,
      duration,
      order,
    } = req.body;

    lecture.title = title ?? lecture.title;
    lecture.duration = duration ?? lecture.duration;
    lecture.order = order ?? lecture.order;

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Update Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
    });
  }
};

// ==========================================
// DELETE CLOUDINARY FILE
// ==========================================
const deleteFromCloudinary = async (
  publicId,
  resourceType
) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(
      "Cloudinary Delete Error:",
      error.message
    );
  }
};

// ==========================================
// DELETE LECTURE
// ==========================================
const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(
      req.params.id
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const access = await checkCourseAccess(
      lecture.courseId,
      req.user
    );

    if (!access.allowed) {
      return res.status(access.status).json({
        success: false,
        message: access.message,
      });
    }

    // Delete files from Cloudinary
    await deleteFromCloudinary(
      lecture.videoPublicId,
      "video"
    );

    await deleteFromCloudinary(
      lecture.pdfPublicId,
      "raw"
    );

    await deleteFromCloudinary(
      lecture.pptPublicId,
      "raw"
    );

    await deleteFromCloudinary(
      lecture.materialPublicId,
      "raw"
    );

    await lecture.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lecture Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture",
    });
  }
};

module.exports = {
  createLecture,
  getCourseLectures,
  getLectureById,
  updateLecture,
  deleteLecture,
};