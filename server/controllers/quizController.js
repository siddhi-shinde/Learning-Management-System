const Quiz = require("../models/quizModel");
const QuizAttempt = require("../models/quizAttemptModel");
const Course = require("../models/courseModel");

// ==========================================
// CREATE QUIZ
// ==========================================

const createQuiz = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      questions,
      duration,
    } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and quiz title are required",
      });
    }

    if (
      !questions ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one question is required",
      });
    }

    // ==============================
    // CHECK COURSE
    // ==============================

    const course = await Course.findById(
      courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ==============================
    // AUTHORIZATION
    // ==============================

    if (
      req.user.role === "instructor" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can create quizzes only for your own courses",
      });
    }

    // ==============================
    // VALIDATE QUESTIONS
    // ==============================

    for (const question of questions) {
      if (
        !question.question ||
        !question.options ||
        question.options.length < 2 ||
        !question.correctAnswer
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must contain question, at least 2 options and correct answer",
        });
      }

      if (
        !question.options.includes(
          question.correctAnswer
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Correct answer must be one of the options",
        });
      }
    }

    // ==============================
    // CREATE QUIZ
    // ==============================

    const quiz = await Quiz.create({
      courseId,
      title,
      description: description || "",
      questions,
      duration: duration || 30,
      published: false,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error(
      "Create Quiz Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET COURSE QUIZZES
// ==========================================

const getCourseQuizzes = async (
  req,
  res
) => {
  try {
    const { courseId } = req.params;

    const quizzes = await Quiz.find({
      courseId,
    }).sort({
      createdAt: -1,
    });

    // Students should see only published quizzes
    const filteredQuizzes =
      req.user.role === "student"
        ? quizzes.filter(
            (quiz) => quiz.published
          )
        : quizzes;

    return res.status(200).json({
      success: true,
      count: filteredQuizzes.length,
      quizzes: filteredQuizzes,
    });
  } catch (error) {
    console.error(
      "Get Course Quizzes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET SINGLE QUIZ
// ==========================================

const getQuizById = async (
  req,
  res
) => {
  try {
    const quiz = await Quiz.findById(
      req.params.id
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Student cannot access unpublished quiz
    if (
      req.user.role === "student" &&
      !quiz.published
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This quiz is not available",
      });
    }

    // ==============================
    // HIDE CORRECT ANSWERS
    // ==============================

    if (req.user.role === "student") {
      const safeQuiz = quiz.toObject();

      safeQuiz.questions =
        safeQuiz.questions.map(
          ({ correctAnswer, ...question }) =>
            question
        );

      return res.status(200).json({
        success: true,
        quiz: safeQuiz,
      });
    }

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error(
      "Get Quiz Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE QUIZ
// ==========================================

const updateQuiz = async (
  req,
  res
) => {
  try {
    const quiz = await Quiz.findById(
      req.params.id
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const course = await Course.findById(
      quiz.courseId
    );

    if (
      req.user.role === "instructor" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can update quizzes only for your own courses",
      });
    }

    const {
      title,
      description,
      questions,
      duration,
    } = req.body;

    quiz.title =
      title ?? quiz.title;

    quiz.description =
      description ?? quiz.description;

    quiz.duration =
      duration ?? quiz.duration;

    if (
      questions &&
      Array.isArray(questions)
    ) {
      quiz.questions = questions;
    }

    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error(
      "Update Quiz Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE QUIZ
// ==========================================

const deleteQuiz = async (
  req,
  res
) => {
  try {
    const quiz = await Quiz.findById(
      req.params.id
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const course = await Course.findById(
      quiz.courseId
    );

    if (
      req.user.role === "instructor" &&
      course.instructorId.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can delete quizzes only for your own courses",
      });
    }

    await quiz.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Quiz Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// SUBMIT QUIZ
// ==========================================

const submitQuiz = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const {
      quizId,
      answers,
    } = req.body;

    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required",
      });
    }

    const quiz = await Quiz.findById(
      quizId
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!quiz.published) {
      return res.status(400).json({
        success: false,
        message:
          "This quiz is not available",
      });
    }

    // ==============================
    // CALCULATE SCORE
    // ==============================

    let score = 0;

    const submittedAnswers =
      answers || [];

    for (
      const question of quiz.questions
    ) {
      const studentAnswer =
        submittedAnswers.find(
          (answer) =>
            answer.questionId.toString() ===
            question._id.toString()
        );

      if (
        studentAnswer &&
        studentAnswer.answer ===
          question.correctAnswer
      ) {
        score += question.marks;
      }
    }

    // ==============================
    // SAVE ATTEMPT
    // ==============================

    const attempt =
      await QuizAttempt.create({
        quizId,
        studentId,
        answers: submittedAnswers,
        score,
        totalMarks: quiz.totalMarks,
      });

    return res.status(201).json({
      success: true,
      message:
        "Quiz submitted successfully",
      result: {
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        attemptId: attempt._id,
      },
    });
  } catch (error) {
    console.error(
      "Submit Quiz Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET QUIZ RESULT
// ==========================================

const getQuizResult = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const attempt =
      await QuizAttempt.findOne({
        quizId: req.params.quizId,
        studentId,
      })
        .populate(
          "quizId",
          "title totalMarks"
        )
        .sort({
          createdAt: -1,
        });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message:
          "Quiz result not found",
      });
    }

    return res.status(200).json({
      success: true,
      result: attempt,
    });
  } catch (error) {
    console.error(
      "Get Quiz Result Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY QUIZ HISTORY
// ==========================================

const getMyQuizResults = async (
  req,
  res
) => {
  try {
    const studentId = req.user._id;

    const attempts =
      await QuizAttempt.find({
        studentId,
      })
        .populate({
          path: "quizId",
          select:
            "title totalMarks courseId",
          populate: {
            path: "courseId",
            select: "title",
          },
        })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      results: attempts,
    });
  } catch (error) {
    console.error(
      "Get Quiz History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createQuiz,
  getCourseQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResult,
  getMyQuizResults,
};