import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaClipboardList,
  FaArrowLeft,
  FaUpload,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getCourseAssignments,
  getCourseById,
} from "../../api/api";

const CourseAssignments = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const [
          courseResponse,
          assignmentResponse,
        ] = await Promise.all([
          getCourseById(courseId),
          getCourseAssignments(courseId),
        ]);

        if (courseResponse.data.success) {
          setCourse(
            courseResponse.data.course
          );
        }

        if (assignmentResponse.data.success) {
          setAssignments(
            assignmentResponse.data.assignments ||
              []
          );
        }
      } catch (error) {
        console.error(
          "Assignment Error:",
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

    fetchAssignments();
  }, [courseId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <Link
        to={`/student/learning/${courseId}`}
        className="btn btn-outline-secondary mb-4"
      >
        <FaArrowLeft className="me-2" />
        Back to Course
      </Link>

      <div className="mb-4">

        <h2 className="fw-bold">
          {course?.title}
        </h2>

        <p className="text-muted">
          Course Assignments
        </p>

      </div>

      {assignments.length === 0 ? (
        <div className="card shadow-sm border-0">

          <div className="card-body text-center py-5">

            <FaClipboardList
              size={60}
              className="text-muted mb-3"
            />

            <h4>
              No Assignments Available
            </h4>

            <p className="text-muted">
              Assignments will appear here when
              your instructor creates them.
            </p>

          </div>

        </div>
      ) : (
        <div className="row g-4">

          {assignments.map((assignment) => {

            const isOverdue =
              assignment.dueDate &&
              new Date(
                assignment.dueDate
              ) < new Date();

            return (
              <div
                className="col-md-6"
                key={assignment._id}
              >
                <div className="card shadow-sm border-0 h-100">

                  <div className="card-body d-flex flex-column">

                    <FaClipboardList
                      size={35}
                      className="text-primary mb-3"
                    />

                    <h5 className="fw-bold">
                      {assignment.title}
                    </h5>

                    <p className="text-muted">
                      {assignment.description}
                    </p>

                    <div className="mt-auto">

                      <p className="mb-2">

                        <FaCalendarAlt className="me-2" />

                        Due:{" "}

                        {assignment.dueDate
                          ? new Date(
                              assignment.dueDate
                            ).toLocaleString()
                          : "No deadline"}

                      </p>

                      <p>
                        Total Marks:{" "}
                        <strong>
                          {assignment.totalMarks}
                        </strong>
                      </p>

                      {isOverdue ? (
                        <button
                          className="btn btn-secondary w-100"
                          disabled
                        >
                          Assignment Closed
                        </button>
                      ) : (
                        <Link
                          to={`/student/assignment/${assignment._id}`}
                          className="btn btn-primary w-100"
                        >
                          <FaUpload className="me-2" />
                          View / Submit Assignment
                        </Link>
                      )}

                    </div>

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

export default CourseAssignments;