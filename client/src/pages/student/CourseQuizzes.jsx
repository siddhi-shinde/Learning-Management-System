import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaQuestionCircle,
  FaClock,
  FaArrowLeft,
  FaPlay,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getCourseById,
  getCourseQuizzes,
} from "../../api/api";

const CourseQuizzes = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH COURSE + QUIZZES
  // ==========================================

  const fetchQuizData = async () => {
    try {
      setLoading(true);

      const [
        courseResponse,
        quizResponse,
      ] = await Promise.all([
        getCourseById(courseId),
        getCourseQuizzes(courseId),
      ]);

      if (courseResponse.data.success) {
        setCourse(courseResponse.data.course);
      }

      if (quizResponse.data.success) {
        setQuizzes(
          quizResponse.data.quizzes || []
        );
      }
    } catch (error) {
      console.error(
        "Course Quiz Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load quizzes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [courseId]);

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
          Loading quizzes...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* BACK BUTTON */}

      <Link
        to={`/student/learning/${courseId}`}
        className="btn btn-outline-secondary mb-4"
      >
        <FaArrowLeft className="me-2" />

        Back to Course
      </Link>

      {/* HEADER */}

      <div className="mb-4">

        <h2 className="fw-bold">
          {course?.title}
        </h2>

        <p className="text-muted">
          Course Quizzes
        </p>

      </div>

      {/* QUIZZES */}

      <div className="row g-4">

        {quizzes.length === 0 ? (

          <div className="col-12">

            <div className="card shadow-sm border-0">

              <div className="card-body text-center py-5">

                <FaQuestionCircle
                  size={60}
                  className="text-muted mb-3"
                />

                <h4>
                  No Quizzes Available
                </h4>

                <p className="text-muted mb-0">
                  There are currently no quizzes
                  available for this course.
                </p>

              </div>

            </div>

          </div>

        ) : (

          quizzes.map((quiz, index) => (

            <div
              className="col-md-6 col-lg-4"
              key={quiz._id}
            >

              <div className="card shadow-sm border-0 h-100">

                <div className="card-body d-flex flex-column">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <FaQuestionCircle
                        size={35}
                        className="text-primary mb-3"
                      />

                      <h5 className="fw-bold">
                        {quiz.title}
                      </h5>

                    </div>

                    <span className="badge bg-primary">

                      Quiz {index + 1}

                    </span>

                  </div>

                  {quiz.description && (

                    <p className="text-muted">

                      {quiz.description}

                    </p>

                  )}

                  <div className="mt-auto">

                    <div className="mb-3">

                      <div className="mb-2">

                        <FaQuestionCircle className="me-2 text-primary" />

                        {quiz.questions?.length || 0} Questions

                      </div>

                      <div>

                        <FaClock className="me-2 text-warning" />

                        {quiz.duration} Minutes

                      </div>

                    </div>

                    <Link
                      to={`/student/quiz/${quiz._id}`}
                      className="btn btn-primary w-100"
                    >

                      <FaPlay className="me-2" />

                      Start Quiz

                    </Link>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default CourseQuizzes;