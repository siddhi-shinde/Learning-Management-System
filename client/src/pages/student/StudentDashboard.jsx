import {
  FaBook,
  FaGraduationCap,
  FaTasks,
  FaChartLine,
  FaUser,
  FaClipboardCheck,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">

      {/* ============================= */}
      {/* WELCOME SECTION */}
      {/* ============================= */}

      <div className="mb-4">

        <h2 className="fw-bold">
          Student Dashboard
        </h2>

        <p className="text-muted mb-0">
          Welcome back, {user?.name || "Student"}!
        </p>

      </div>

      {/* ============================= */}
      {/* STATISTICS */}
      {/* ============================= */}

      <div className="row g-4 mb-4">

        {/* ENROLLED COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Enrolled Courses
                  </h6>

                  <h3 className="fw-bold">
                    0
                  </h3>
                </div>

                <FaGraduationCap
                  size={40}
                  className="text-success"
                />

              </div>

            </div>

          </div>

        </div>

        {/* COMPLETED COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Completed Courses
                  </h6>

                  <h3 className="fw-bold">
                    0
                  </h3>
                </div>

                <FaChartLine
                  size={40}
                  className="text-primary"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Assignments
                  </h6>

                  <h3 className="fw-bold">
                    0
                  </h3>
                </div>

                <FaTasks
                  size={40}
                  className="text-warning"
                />

              </div>

            </div>

          </div>

        </div>

        {/* QUIZZES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 h-100">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Quizzes
                  </h6>

                  <h3 className="fw-bold">
                    0
                  </h3>
                </div>

                <FaClipboardCheck
                  size={40}
                  className="text-info"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ============================= */}
      {/* STUDENT MENU */}
      {/* ============================= */}

      <div className="row g-4">

        {/* BROWSE COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaBook
                size={35}
                className="text-primary"
              />

              <h5 className="mt-3 fw-bold">
                Browse Courses
              </h5>

              <p className="text-muted">
                Explore available courses and find the right course for you.
              </p>

              <Link
                to="/student/courses"
                className="btn btn-primary"
              >
                Browse Courses
              </Link>

            </div>

          </div>

        </div>

        {/* MY COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaGraduationCap
                size={35}
                className="text-success"
              />

              <h5 className="mt-3 fw-bold">
                My Courses
              </h5>

              <p className="text-muted">
                View all the courses you have enrolled in.
              </p>

              <Link
                to="/student/my-courses"
                className="btn btn-success"
              >
                My Courses
              </Link>

            </div>

          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaTasks
                size={35}
                className="text-warning"
              />

              <h5 className="mt-3 fw-bold">
                Assignments
              </h5>

              <p className="text-muted">
                View and submit your course assignments.
              </p>

              <Link
                to="/student/assignments"
                className="btn btn-warning"
              >
                Assignments
              </Link>

            </div>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaChartLine
                size={35}
                className="text-info"
              />

              <h5 className="mt-3 fw-bold">
                My Progress
              </h5>

              <p className="text-muted">
                Track your course and learning progress.
              </p>

              <Link
                to="/student/progress"
                className="btn btn-info"
              >
                View Progress
              </Link>

            </div>

          </div>

        </div>

        {/* QUIZZES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaClipboardCheck
                size={35}
                className="text-danger"
              />

              <h5 className="mt-3 fw-bold">
                Quizzes
              </h5>

              <p className="text-muted">
                Attempt quizzes and check your results.
              </p>

              <Link
                to="/student/quizzes"
                className="btn btn-danger"
              >
                View Quizzes
              </Link>

            </div>

          </div>

        </div>

        {/* PROFILE */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100 border-0">

            <div className="card-body">

              <FaUser
                size={35}
                className="text-secondary"
              />

              <h5 className="mt-3 fw-bold">
                My Profile
              </h5>

              <p className="text-muted">
                View and update your profile information.
              </p>

              <Link
                to="/student/profile"
                className="btn btn-secondary"
              >
                View Profile
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;