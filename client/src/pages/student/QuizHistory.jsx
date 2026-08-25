import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHistory,
  FaTrophy,
  FaBook,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getMyQuizResults } from "../../api/api";

const QuizHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response =
          await getMyQuizResults();

        if (response.data.success) {
          setResults(
            response.data.results || []
          );
        }
      } catch (error) {
        console.error(
          "Quiz History Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load quiz history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="mb-4">
        <h2 className="fw-bold">
          <FaHistory className="me-2" />
          Quiz History
        </h2>

        <p className="text-muted">
          View all your quiz attempts and scores.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">

            <FaTrophy
              size={60}
              className="text-muted mb-3"
            />

            <h4>No Quiz Attempts Yet</h4>

            <p className="text-muted">
              Complete a quiz to see your results here.
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

          {results.map((result) => {
            const score =
              result.score || 0;

            const totalMarks =
              result.totalMarks || 0;

            const percentage =
              totalMarks > 0
                ? Math.round(
                    (score / totalMarks) * 100
                  )
                : 0;

            return (
              <div
                className="col-md-6 col-lg-4"
                key={result._id}
              >
                <div className="card shadow-sm border-0 h-100">

                  <div className="card-body">

                    <h5 className="fw-bold">
                      {result.quizId?.title ||
                        "Quiz"}
                    </h5>

                    <p className="text-muted small">
                      Course:{" "}
                      {result.quizId?.courseId
                        ?.title || "N/A"}
                    </p>

                    <hr />

                    <h3 className="text-primary">
                      {score} / {totalMarks}
                    </h3>

                    <p className="mb-2">
                      Percentage:{" "}
                      <strong>
                        {percentage}%
                      </strong>
                    </p>

                    <span
                      className={`badge ${
                        percentage >= 40
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {percentage >= 40
                        ? "Passed"
                        : "Not Passed"}
                    </span>

                    <p className="text-muted small mt-3 mb-0">
                      {new Date(
                        result.attemptDate
                      ).toLocaleString()}
                    </p>

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

export default QuizHistory;