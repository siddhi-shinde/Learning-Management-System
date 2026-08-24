import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaBook,
  FaUser,
  FaTag,
  FaRupeeSign,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getCourseById,
  enrollInCourse,
  getMyEnrollments,
} from "../../api/api";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [enrolling, setEnrolling] = useState(false);

  const [enrolled, setEnrolled] = useState(false);

  // ==============================
  // GET COURSE
  // ==============================

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const response = await getCourseById(id);

      if (response.data.success) {
        setCourse(response.data.course);
      }
    } catch (error) {
      console.error("Get Course Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load course"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CHECK ENROLLMENT
  // ==============================

  const checkEnrollment = async () => {
    try {
      const response = await getMyEnrollments();

      if (response.data.success) {
        const enrollments =
          response.data.enrollments || [];

        const alreadyEnrolled =
          enrollments.some(
            (enrollment) =>
              enrollment.courseId?._id === id ||
              enrollment.courseId === id
          );

        setEnrolled(alreadyEnrolled);
      }
    } catch (error) {
      console.error(
        "Check Enrollment Error:",
        error
      );
    }
  };

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [id]);

  // ==============================
  // ENROLL
  // ==============================

  const handleEnroll = async () => {
    try {
      setEnrolling(true);

      const response =
        await enrollInCourse(id);

      if (response.data.success) {
        toast.success(
          "Course enrolled successfully!"
        );

        setEnrolled(true);
      }
    } catch (error) {
      console.error(
        "Enrollment Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to enroll in course";

      toast.error(message);

      // In case backend says already enrolled
      if (
        message
          .toLowerCase()
          .includes("already enrolled")
      ) {
        setEnrolled(true);
      }
    } finally {
      setEnrolling(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3 text-muted">
          Loading course...
        </p>

      </div>
    );
  }

  // ==============================
  // COURSE NOT FOUND
  // ==============================

  if (!course) {
    return (
      <div className="container py-5 text-center">

        <FaBook
          size={55}
          className="text-muted mb-3"
        />

        <h4>
          Course not found
        </h4>

        <Link
          to="/student/courses"
          className="btn btn-primary mt-3"
        >
          Browse Courses
        </Link>

      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* ============================== */}
      {/* BACK BUTTON */}
      {/* ============================== */}

      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() =>
          navigate("/student/courses")
        }
      >
        <FaArrowLeft className="me-2" />
        Back to Courses
      </button>

      <div className="row g-4">

        {/* ============================== */}
        {/* COURSE IMAGE */}
        {/* ============================== */}

        <div className="col-lg-5">

          <div className="card shadow-sm border-0">

            <div
              style={{
                height: "300px",
                backgroundColor: "#f5f5f5",
              }}
            >

              {course.thumbnail ? (

                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-100 h-100"
                  style={{
                    objectFit: "cover",
                  }}
                />

              ) : (

                <div className="d-flex justify-content-center align-items-center h-100">

                  <FaBook
                    size={80}
                    className="text-muted"
                  />

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ============================== */}
        {/* COURSE INFORMATION */}
        {/* ============================== */}

        <div className="col-lg-7">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body p-4">

              {/* TITLE */}

              <h2 className="fw-bold mb-3">
                {course.title}
              </h2>

              {/* CATEGORY */}

              {course.category && (
                <div className="mb-3">

                  <span className="badge bg-primary">

                    <FaTag className="me-1" />

                    {course.category.name}

                  </span>

                </div>
              )}

              {/* DESCRIPTION */}

              <h5 className="fw-bold">
                Course Description
              </h5>

              <p className="text-muted">
                {course.description}
              </p>

              <hr />

              {/* INSTRUCTOR */}

              {course.instructorId && (

                <div className="mb-3">

                  <h6 className="fw-bold">
                    Instructor
                  </h6>

                  <p className="text-muted mb-0">

                    <FaUser className="me-2" />

                    {course.instructorId.name}

                  </p>

                  {course.instructorId.email && (
                    <small className="text-muted">

                      {course.instructorId.email}

                    </small>
                  )}

                </div>

              )}

              {/* PRICE */}

              <div className="mb-4">

                <h6 className="fw-bold">
                  Course Price
                </h6>

                {course.price === 0 ? (

                  <span className="badge bg-success fs-6">
                    Free Course
                  </span>

                ) : (

                  <h3 className="text-primary fw-bold">

                    <FaRupeeSign />

                    {course.price}

                  </h3>

                )}

              </div>

              {/* ============================== */}
              {/* ENROLL BUTTON */}
              {/* ============================== */}

              {enrolled ? (

                <div>

                  <button
                    className="btn btn-success btn-lg w-100"
                    disabled
                  >
                    <FaCheckCircle className="me-2" />

                    Enrolled

                  </button>

                  <Link
                    to="/student/my-courses"
                    className="btn btn-outline-primary btn-lg w-100 mt-3"
                  >
                    Go to My Courses
                  </Link>

                </div>

              ) : (

                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >

                  {enrolling ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                      />

                      Enrolling...
                    </>
                  ) : (
                    "Enroll Now"
                  )}

                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseDetails;