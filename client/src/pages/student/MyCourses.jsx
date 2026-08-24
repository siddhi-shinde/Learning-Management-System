import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaPlay, FaCheckCircle, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

import { getMyEnrollments } from "../../api/api";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==============================
  // GET MY COURSES
  // ==============================

  const fetchMyCourses = async () => {
    try {
      setLoading(true);

      const response = await getMyEnrollments();

      if (response.data.success) {
        setEnrollments(response.data.enrollments || []);
      }
    } catch (error) {
      console.error("Get My Courses Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load your courses",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />

        <p className="mt-3 text-muted">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className="mb-4">
        <h2 className="fw-bold">My Courses</h2>

        <p className="text-muted">
          Continue learning from your enrolled courses.
        </p>
      </div>

      {/* ============================== */}
      {/* NO COURSES */}
      {/* ============================== */}

      {enrollments.length === 0 && (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <FaBook size={60} className="text-muted mb-3" />

            <h4>No courses yet</h4>

            <p className="text-muted">
              You haven't enrolled in any courses yet.
            </p>

            <Link to="/student/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      )}

      {/* ============================== */}
      {/* COURSE CARDS */}
      {/* ============================== */}

      {enrollments.length > 0 && (
        <div className="row g-4">
          {enrollments.map((enrollment) => {
            const course = enrollment.courseId;

            if (!course) {
              return null;
            }

            return (
              <div className="col-md-6 col-lg-4" key={enrollment._id}>
                <div className="card shadow-sm border-0 h-100">
                  {/* THUMBNAIL */}

                  <div
                    style={{
                      height: "190px",
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
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
                        <FaBook size={60} className="text-muted" />
                      </div>
                    )}
                  </div>

                  {/* BODY */}

                  <div className="card-body">
                    <h5 className="fw-bold">{course.title}</h5>

                    <p className="text-muted small">
                      {course.description?.length > 100
                        ? `${course.description.substring(0, 100)}...`
                        : course.description}
                    </p>

                    {/* INSTRUCTOR */}

                    {course.instructorId && (
                      <p className="small text-muted mb-2">
                        <FaUser className="me-2" />

                        {course.instructorId.name}
                      </p>
                    )}

                    {/* PROGRESS */}

                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <small className="fw-bold">Progress</small>

                        <small>{enrollment.progress || 0}%</small>
                      </div>

                      <div className="progress mt-1">
                        <div
                          className={`progress-bar ${
                            enrollment.completed ? "bg-success" : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{
                            width: `${enrollment.progress || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* STATUS */}

                    {enrollment.completed ? (
                      <div className="text-success small mb-3">
                        <FaCheckCircle className="me-1" />
                        Course Completed
                      </div>
                    ) : (
                      <div className="text-muted small mb-3">
                        Continue your learning
                      </div>
                    )}

                    {/* BUTTON */}

                    <Link
                      to={`/student/learning/${course._id}`}
                      className={`btn w-100 ${
                        enrollment.completed ? "btn-success" : "btn-primary"
                      }`}
                    >
                      {enrollment.completed ? (
                        <>
                          <FaCheckCircle className="me-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <FaPlay className="me-2" />
                          Continue Learning
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
