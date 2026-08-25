import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTasks,
  FaCalendarAlt,
  FaBook,
  FaEye,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getMyEnrollments,
  getCourseAssignments,
  getMySubmission,
} from "../../api/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ASSIGNMENTS
  // ==========================================

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      // Get student's enrolled courses
      const enrollmentResponse =
        await getMyEnrollments();

      if (!enrollmentResponse.data.success) {
        return;
      }

      const enrollments =
        enrollmentResponse.data.enrollments || [];

      // Get assignments for every enrolled course
      const assignmentPromises =
        enrollments
          .filter(
            (enrollment) =>
              enrollment.courseId
          )
          .map(async (enrollment) => {
            const course =
              enrollment.courseId;

            try {
              const response =
                await getCourseAssignments(
                  course._id
                );

              if (
                response.data.success
              ) {
                const courseAssignments =
                  response.data.assignments.map(
                    (assignment) => ({
                      ...assignment,
                      course,
                    })
                  );

                return courseAssignments;
              }

              return [];
            } catch (error) {
              console.error(
                "Assignment Error:",
                error
              );

              return [];
            }
          });

      const assignmentResults =
        await Promise.all(
          assignmentPromises
        );

      const allAssignments =
        assignmentResults.flat();

      // ==========================================
      // GET SUBMISSION STATUS
      // ==========================================

      const assignmentsWithStatus =
        await Promise.all(
          allAssignments.map(
            async (assignment) => {
              try {
                const response =
                  await getMySubmission(
                    assignment._id
                  );

                return {
                  ...assignment,
                  submitted:
                    response.data.submitted,
                  submission:
                    response.data.submission,
                };
              } catch (error) {
                return {
                  ...assignment,
                  submitted: false,
                  submission: null,
                };
              }
            }
          )
        );

      // Sort nearest due date first
      assignmentsWithStatus.sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      );

      setAssignments(
        assignmentsWithStatus
      );
    } catch (error) {
      console.error(
        "Fetch Assignments Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3 text-muted">
          Loading assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            My Assignments
          </h2>

          <p className="text-muted mb-0">
            View and submit assignments
            from your enrolled courses.
          </p>
        </div>

        <div className="text-primary fs-4">
          <FaTasks />
        </div>

      </div>

      {/* EMPTY STATE */}

      {assignments.length === 0 ? (

        <div className="card shadow-sm border-0">

          <div className="card-body text-center py-5">

            <FaTasks
              size={55}
              className="text-muted mb-3"
            />

            <h5>
              No Assignments Available
            </h5>

            <p className="text-muted">
              You currently don't have any
              assignments from your enrolled
              courses.
            </p>

            <Link
              to="/student/my-courses"
              className="btn btn-primary"
            >
              <FaBook className="me-2" />

              My Courses
            </Link>

          </div>

        </div>

      ) : (

        <div className="row g-4">

          {assignments.map(
            (assignment) => {

              const isSubmitted =
                assignment.submitted;

              const isExpired =
                new Date() >
                new Date(
                  assignment.dueDate
                );

              return (

                <div
                  className="col-md-6 col-lg-4"
                  key={assignment._id}
                >

                  <div className="card shadow-sm border-0 h-100">

                    <div className="card-body d-flex flex-column">

                      {/* STATUS */}

                      <div className="d-flex justify-content-between align-items-start mb-3">

                        <span
                          className={`badge ${
                            isSubmitted
                              ? "bg-success"
                              : isExpired
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >

                          {isSubmitted ? (
                            <>
                              <FaCheckCircle className="me-1" />
                              Submitted
                            </>
                          ) : isExpired ? (
                            <>
                              <FaClock className="me-1" />
                              Deadline Passed
                            </>
                          ) : (
                            <>
                              <FaClock className="me-1" />
                              Pending
                            </>
                          )}

                        </span>

                        <span className="badge bg-primary">
                          {assignment.totalMarks} Marks
                        </span>

                      </div>

                      {/* TITLE */}

                      <h5 className="fw-bold">
                        {assignment.title}
                      </h5>

                      {/* COURSE */}

                      <p className="text-primary">

                        <FaBook className="me-2" />

                        {assignment.course?.title ||
                          assignment.courseId?.title ||
                          "Course"}

                      </p>

                      {/* DESCRIPTION */}

                      <p className="text-muted">

                        {assignment.description?.length >
                        100
                          ? `${assignment.description.substring(
                              0,
                              100
                            )}...`
                          : assignment.description}

                      </p>

                      {/* DUE DATE */}

                      <div className="mt-auto">

                        <p className="mb-3">

                          <FaCalendarAlt className="me-2 text-danger" />

                          <strong>
                            Due:
                          </strong>{" "}

                          {formatDate(
                            assignment.dueDate
                          )}

                        </p>

                        <Link
                          to={`/student/assignments/${assignment._id}`}
                          className="btn btn-primary w-100"
                        >

                          <FaEye className="me-2" />

                          {isSubmitted
                            ? "View Assignment"
                            : "View & Submit"}

                        </Link>

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
};

export default Assignments;