import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaArrowLeft,
  FaHistory,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getQuizResult } from "../../api/api";

const QuizResult = () => {
  const { quizId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);

        const response = await getQuizResult(quizId);

        if (response.data.success) {
          setResult(response.data.result);
        }
      } catch (error) {
        console.error("Quiz Result Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load quiz result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3 text-muted">
          Loading quiz result...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container py-5 text-center">
        <h4>Quiz result not found</h4>

        <Link
          to="/student/dashboard"
          className="btn btn-primary mt-3"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const score = result.score || 0;
  const totalMarks = result.totalMarks || 0;

  const percentage =
    totalMarks > 0
      ? Math.round((score / totalMarks) * 100)
      : 0;

  const passed = percentage >= 40;

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-8 col-lg-6">

          <div className="card shadow border-0">

            <div className="card-body text-center p-5">

              {passed ? (
                <FaTrophy
                  size={70}
                  className="text-warning mb-3"
                />
              ) : (
                <FaTimesCircle
                  size={70}
                  className="text-danger mb-3"
                />
              )}

              <h2 className="fw-bold">
                {result.quizId?.title || "Quiz Result"}
              </h2>

              <p className="text-muted">
                Your quiz has been submitted successfully.
              </p>

              <div className="my-4">

                <h1
                  className={
                    passed
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {score} / {totalMarks}
                </h1>

                <h4 className="text-muted">
                  {percentage}%
                </h4>

              </div>

              <div
                className={`alert ${
                  passed
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {passed ? (
                  <>
                    <FaCheckCircle className="me-2" />
                    Congratulations! You passed the quiz.
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="me-2" />
                    You did not pass this attempt.
                  </>
                )}
              </div>

              {result.attemptDate && (
                <p className="text-muted small">
                  Attempted on{" "}
                  {new Date(
                    result.attemptDate
                  ).toLocaleString()}
                </p>
              )}

              <div className="d-flex gap-2 justify-content-center flex-wrap mt-4">

                <Link
                  to="/student/quiz-history"
                  className="btn btn-outline-primary"
                >
                  <FaHistory className="me-2" />
                  Quiz History
                </Link>

                <Link
                  to="/student/my-courses"
                  className="btn btn-primary"
                >
                  <FaArrowLeft className="me-2" />
                  My Courses
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuizResult;