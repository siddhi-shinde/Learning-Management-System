import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getQuizById,
  submitQuiz,
} from "../../api/api";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current question index
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  // Student answers
  const [answers, setAnswers] = useState({});

  // Timer in seconds
  const [timeLeft, setTimeLeft] = useState(0);

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================
  // FETCH QUIZ
  // ==========================================

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);

        const response =
          await getQuizById(quizId);

        if (response.data.success) {
          const quizData =
            response.data.quiz;

          setQuiz(quizData);

          // Convert minutes to seconds
          setTimeLeft(
            Number(quizData.duration || 30) *
              60
          );
        }
      } catch (error) {
        console.error(
          "Get Quiz Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load quiz"
        );

        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  // ==========================================
  // SUBMIT QUIZ
  // ==========================================

  const handleSubmitQuiz = async (
    autoSubmit = false
  ) => {
    if (!quiz || submitting) return;

    try {
      setSubmitting(true);

      // Convert answer object to backend format
      const formattedAnswers =
        Object.entries(answers).map(
          ([questionId, answer]) => ({
            questionId,
            answer,
          })
        );

      const response = await submitQuiz({
        quizId,
        answers: formattedAnswers,
      });

      if (response.data.success) {
        if (autoSubmit) {
          toast.warning(
            "Time is over! Quiz submitted automatically."
          );
        } else {
          toast.success(
            "Quiz submitted successfully!"
          );
        }

        navigate(
          `/student/quiz/result/${quizId}`,
          {
            replace: true,
          }
        );
      }
    } catch (error) {
      console.error(
        "Submit Quiz Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to submit quiz"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (
      loading ||
      !quiz ||
      submitting ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);

          // Auto-submit after timer reaches 0
          setTimeout(() => {
            handleSubmitQuiz(true);
          }, 0);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    loading,
    quiz,
    submitting,
    timeLeft,
  ]);

  // ==========================================
  // FORMAT TIMER
  // ==========================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  const handleAnswerChange = (
    questionId,
    answer
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: answer,
    }));
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNext = () => {
    if (
      currentQuestion <
      quiz.questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  // ==========================================
  // MANUAL SUBMIT
  // ==========================================

  const handleManualSubmit = () => {
    if (submitting) return;

    const unanswered =
      quiz.questions.length -
      Object.keys(answers).length;

    if (unanswered > 0) {
      const confirmed = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );

      if (!confirmed) {
        return;
      }
    }

    handleSubmitQuiz(false);
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
          Loading quiz...
        </p>

      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const question =
    quiz.questions[currentQuestion];

  const answeredCount =
    Object.keys(answers).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container py-4">

      {/* HEADER */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="d-flex flex-wrap justify-content-between align-items-center">

            <div>

              <h3 className="fw-bold mb-1">
                {quiz.title}
              </h3>

              {quiz.description && (
                <p className="text-muted mb-0">
                  {quiz.description}
                </p>
              )}

            </div>

            {/* TIMER */}

            <div
              className={`mt-3 mt-md-0 fw-bold fs-4 ${
                timeLeft <= 60
                  ? "text-danger"
                  : "text-primary"
              }`}
            >

              <FaClock className="me-2" />

              {formatTime(timeLeft)}

            </div>

          </div>

        </div>

      </div>

      <div className="row g-4">

        {/* ================================= */}
        {/* QUESTION NAVIGATION */}
        {/* ================================= */}

        <div className="col-lg-3">

          <div className="card shadow-sm border-0">

            <div className="card-body">

              <h5 className="mb-3">
                Questions
              </h5>

              <p className="text-muted small">
                {answeredCount} of{" "}
                {quiz.questions.length} answered
              </p>

              <div className="d-flex flex-wrap gap-2">

                {quiz.questions.map(
                  (item, index) => {

                    const isAnswered =
                      answers[item._id];

                    const isCurrent =
                      currentQuestion === index;

                    return (
                      <button
                        key={item._id}
                        type="button"
                        className={`btn ${
                          isCurrent
                            ? "btn-primary"
                            : isAnswered
                            ? "btn-success"
                            : "btn-outline-secondary"
                        }`}
                        style={{
                          width: "45px",
                          height: "45px",
                        }}
                        onClick={() =>
                          setCurrentQuestion(
                            index
                          )
                        }
                      >
                        {index + 1}
                      </button>
                    );
                  }
                )}

              </div>

              <hr />

              <button
                className="btn btn-danger w-100"
                onClick={
                  handleManualSubmit
                }
                disabled={submitting}
              >

                {submitting ? (

                  <>
                    <span className="spinner-border spinner-border-sm me-2" />

                    Submitting...
                  </>

                ) : (

                  <>
                    <FaCheckCircle className="me-2" />

                    Submit Quiz
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* QUESTION */}
        {/* ================================= */}

        <div className="col-lg-9">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <span className="badge bg-primary fs-6">

                  Question{" "}
                  {currentQuestion + 1} of{" "}
                  {quiz.questions.length}

                </span>

                <span className="text-muted">

                  {question.marks || 1} Mark
                  {question.marks > 1
                    ? "s"
                    : ""}

                </span>

              </div>

              <h4 className="mb-4">

                {question.question}

              </h4>

              {/* OPTIONS */}

              <div className="d-grid gap-3">

                {question.options.map(
                  (option, index) => {

                    const isSelected =
                      answers[
                        question._id
                      ] === option;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`btn text-start p-3 ${
                          isSelected
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() =>
                          handleAnswerChange(
                            question._id,
                            option
                          )
                        }
                      >

                        <strong className="me-2">

                          {String.fromCharCode(
                            65 + index
                          )}

                          .

                        </strong>

                        {option}

                      </button>
                    );
                  }
                )}

              </div>

              <hr className="my-4" />

              {/* PREVIOUS / NEXT */}

              <div className="d-flex justify-content-between">

                <button
                  className="btn btn-outline-primary"
                  onClick={
                    handlePrevious
                  }
                  disabled={
                    currentQuestion === 0
                  }
                >

                  <FaChevronLeft className="me-2" />

                  Previous

                </button>

                {currentQuestion ===
                quiz.questions.length - 1 ? (

                  <button
                    className="btn btn-success"
                    onClick={
                      handleManualSubmit
                    }
                    disabled={submitting}
                  >

                    Submit Quiz

                  </button>

                ) : (

                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                  >

                    Next

                    <FaChevronRight className="ms-2" />

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuizAttempt;