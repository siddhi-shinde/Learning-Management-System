import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaClipboardList,
  FaUpload,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  getAssignmentById,
  getMySubmission,
  submitAssignment,
} from "../../api/api";

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();

  const navigate = useNavigate();

  const [assignment, setAssignment] =
    useState(null);

  const [submission, setSubmission] =
    useState(null);

  const [file, setFile] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // FETCH ASSIGNMENT + EXISTING SUBMISSION
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          assignmentResponse,
          submissionResponse,
        ] = await Promise.all([
          getAssignmentById(assignmentId),
          getMySubmission(assignmentId),
        ]);

        if (
          assignmentResponse.data.success
        ) {
          setAssignment(
            assignmentResponse.data.assignment
          );
        }

        if (
          submissionResponse.data.success
        ) {
          setSubmission(
            submissionResponse.data.submission
          );
        }
      } catch (error) {
        // 404 submission means student has not submitted yet
        if (
          error.response?.status !== 404
        ) {
          toast.error(
            error.response?.data?.message ||
              "Failed to load assignment"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error(
        "Please select a file"
      );

      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append(
        "assignmentId",
        assignmentId
      );

      formData.append(
        "file",
        file
      );

      const response =
        await submitAssignment(formData);

      if (response.data.success) {
        setSubmission(
          response.data.submission
        );

        toast.success(
          "Assignment submitted successfully"
        );

        setFile(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container py-5 text-center">

        <h4>
          Assignment not found
        </h4>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>

      </div>
    );
  }

  return (
    <div className="container py-4">

      <Link
        to={`/student/course/${assignment.courseId}/assignments`}
        className="btn btn-outline-secondary mb-4"
      >
        <FaArrowLeft className="me-2" />
        Back to Assignments
      </Link>

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <FaClipboardList
                size={40}
                className="text-primary mb-3"
              />

              <h2 className="fw-bold">
                {assignment.title}
              </h2>

              <p className="text-muted">
                {assignment.description}
              </p>

              <hr />

              <p>
                <strong>
                  Total Marks:
                </strong>{" "}
                {assignment.totalMarks}
              </p>

              <p>
                <strong>
                  Due Date:
                </strong>{" "}
                {assignment.dueDate
                  ? new Date(
                      assignment.dueDate
                    ).toLocaleString()
                  : "No deadline"}
              </p>

              <hr />

              {/* EXISTING SUBMISSION */}

              {submission ? (

                <div>

                  <div className="alert alert-success">

                    <FaCheckCircle className="me-2" />

                    Assignment submitted successfully.

                  </div>

                  {submission.marks !== null &&
                    submission.marks !== undefined && (

                      <p>
                        <strong>
                          Marks:
                        </strong>{" "}
                        {submission.marks}
                        {" / "}
                        {assignment.totalMarks}
                      </p>

                    )}

                  {submission.feedback && (

                    <div className="alert alert-info">

                      <strong>
                        Instructor Feedback:
                      </strong>

                      <p className="mb-0">
                        {submission.feedback}
                      </p>

                    </div>

                  )}

                </div>

              ) : (

                <form
                  onSubmit={handleSubmit}
                >

                  <div className="mb-3">

                    <label className="form-label">

                      Upload Assignment File

                    </label>

                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setFile(
                          e.target.files[0]
                        )
                      }
                    />

                  </div>

                  {file && (

                    <p className="text-muted">

                      Selected: {file.name}

                    </p>

                  )}

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >

                    {submitting ? (

                      <>
                        <span className="spinner-border spinner-border-sm me-2" />

                        Uploading...
                      </>

                    ) : (

                      <>
                        <FaUpload className="me-2" />

                        Submit Assignment
                      </>

                    )}

                  </button>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AssignmentSubmission;