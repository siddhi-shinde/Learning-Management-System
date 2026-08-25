import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFileUpload,
  FaTasks,
  FaBook,
  FaDownload,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  getAssignmentById,
  getMySubmission,
  submitAssignment,
} from "../../api/api";

const AssignmentDetails = () => {
  const { assignmentId } =
    useParams();

  const [assignment, setAssignment] =
    useState(null);

  const [submission, setSubmission] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // FETCH ASSIGNMENT + SUBMISSION
  // ==========================================

  const fetchAssignmentData =
    async () => {
      try {
        setLoading(true);

        const [
          assignmentResponse,
          submissionResponse,
        ] = await Promise.all([
          getAssignmentById(
            assignmentId
          ),
          getMySubmission(
            assignmentId
          ),
        ]);

        if (
          assignmentResponse.data.success
        ) {
          setAssignment(
            assignmentResponse.data
              .assignment
          );
        }

        if (
          submissionResponse.data.success
        ) {
          setSubmission(
            submissionResponse.data
              .submission
          );
        }
      } catch (error) {
        console.error(
          "Assignment Details Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load assignment"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  // ==========================================
  // HANDLE FILE
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFile =
      e.target.files[0];

    if (!selectedFile) {
      return;
    }

    // Maximum 10 MB

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {
      toast.error(
        "File size must be less than 10 MB"
      );

      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error(
        "Please select an assignment file"
      );

      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "assignmentId",
        assignmentId
      );

      formData.append(
        "file",
        file
      );

      const response =
        await submitAssignment(
          formData
        );

      if (response.data.success) {
        setSubmission(
          response.data.submission
        );

        setFile(null);

        toast.success(
          "Assignment submitted successfully"
        );
      }
    } catch (error) {
      console.error(
        "Submit Assignment Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          Loading assignment...
        </p>

      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!assignment) {
    return (
      <div className="container py-5 text-center">

        <FaTasks
          size={60}
          className="text-muted mb-3"
        />

        <h4>
          Assignment not found
        </h4>

        <Link
          to="/student/assignments"
          className="btn btn-primary mt-3"
        >
          Back to Assignments
        </Link>

      </div>
    );
  }

  const deadlinePassed =
    new Date() >
    new Date(assignment.dueDate);

  return (
    <div className="container py-4">

      {/* BACK BUTTON */}

      <Link
        to="/student/assignments"
        className="btn btn-outline-secondary mb-4"
      >

        <FaArrowLeft className="me-2" />

        Back to Assignments

      </Link>

      <div className="row g-4">

        {/* ========================================== */}
        {/* ASSIGNMENT DETAILS */}
        {/* ========================================== */}

        <div className="col-lg-8">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                  <h2 className="fw-bold">
                    {assignment.title}
                  </h2>

                  <p className="text-primary mb-0">

                    <FaBook className="me-2" />

                    {assignment.courseId?.title}

                  </p>

                </div>

                <span className="badge bg-primary fs-6">

                  {assignment.totalMarks} Marks

                </span>

              </div>

              <hr />

              <h5>
                Assignment Description
              </h5>

              <p className="text-muted">

                {assignment.description}

              </p>

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* SIDEBAR */}
        {/* ========================================== */}

        <div className="col-lg-4">

          {/* DUE DATE */}

          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body">

              <h6 className="fw-bold">

                <FaCalendarAlt className="me-2 text-danger" />

                Due Date

              </h6>

              <p className="mb-0">

                {formatDate(
                  assignment.dueDate
                )}

              </p>

              {deadlinePassed &&
                !submission && (

                  <div className="text-danger mt-2">

                    <FaClock className="me-2" />

                    Submission deadline has passed

                  </div>

                )}

            </div>

          </div>

          {/* ========================================== */}
          {/* SUBMISSION STATUS */}
          {/* ========================================== */}

          {submission ? (

            <div className="card shadow-sm border-0">

              <div className="card-body">

                <h5 className="text-success">

                  <FaCheckCircle className="me-2" />

                  Assignment Submitted

                </h5>

                <hr />

                <p>

                  <strong>
                    Submitted On:
                  </strong>

                  <br />

                  {formatDate(
                    submission.submittedAt
                  )}

                </p>

                {/* DOWNLOAD SUBMISSION */}

                {submission.fileUrl && (

                  <a
                    href={
                      submission.fileUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary w-100 mb-3"
                  >

                    <FaDownload className="me-2" />

                    View Submitted File

                  </a>

                )}

                {/* MARKS */}

                {submission.marks !== null &&
                  submission.marks !==
                    undefined && (

                    <div className="alert alert-success">

                      <strong>
                        Marks:
                      </strong>{" "}

                      {submission.marks} /{" "}
                      {
                        assignment.totalMarks
                      }

                    </div>

                  )}

                {/* FEEDBACK */}

                {submission.feedback && (

                  <div className="alert alert-info">

                    <strong>
                      Instructor Feedback:
                    </strong>

                    <p className="mb-0 mt-2">

                      {submission.feedback}

                    </p>

                  </div>

                )}

                {submission.marks === null && (

                  <p className="text-muted mb-0">

                    Your assignment is waiting
                    for instructor evaluation.

                  </p>

                )}

              </div>

            </div>

          ) : (

            /* ========================================== */
            /* SUBMIT FORM */
            /* ========================================== */

            <div className="card shadow-sm border-0">

              <div className="card-body">

                <h5 className="fw-bold mb-3">

                  <FaFileUpload className="me-2" />

                  Submit Assignment

                </h5>

                {deadlinePassed ? (

                  <div className="alert alert-danger mb-0">

                    The submission deadline
                    has passed.

                  </div>

                ) : (

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >

                    <div className="mb-3">

                      <label className="form-label">

                        Upload File

                      </label>

                      <input
                        type="file"
                        className="form-control"
                        onChange={
                          handleFileChange
                        }
                        accept=".pdf,.doc,.docx,.zip"
                      />

                      <small className="text-muted">

                        Supported: PDF, DOC,
                        DOCX, ZIP. Maximum 10 MB.

                      </small>

                    </div>

                    {file && (

                      <div className="alert alert-light border">

                        Selected:{" "}

                        <strong>
                          {file.name}
                        </strong>

                      </div>

                    )}

                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={
                        submitting
                      }
                    >

                      {submitting ? (

                        <>
                          <span className="spinner-border spinner-border-sm me-2" />

                          Submitting...

                        </>

                      ) : (

                        <>
                          <FaFileUpload className="me-2" />

                          Submit Assignment

                        </>

                      )}

                    </button>

                  </form>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default AssignmentDetails;