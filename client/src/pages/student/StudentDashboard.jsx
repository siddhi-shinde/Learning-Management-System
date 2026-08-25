import {
  FaBook,
  FaGraduationCap,
  FaTasks,
  FaChartLine,
  FaHistory,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Student Dashboard</h2>

        <p className="text-muted">Welcome, {user?.name}</p>
      </div>

      <div className="row g-4">
        {/* BROWSE COURSES */}

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <FaBook size={35} />

              <h5 className="mt-3">Browse Courses</h5>

              <p className="text-muted">Explore available courses.</p>

              <Link to="/student/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        {/* MY COURSES */}

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <FaGraduationCap size={35} />

              <h5 className="mt-3">My Courses</h5>

              <p className="text-muted">Continue your enrolled courses.</p>

              <Link to="/student/my-courses" className="btn btn-success">
                My Courses
              </Link>
            </div>
          </div>
        </div>

        {/* ASSIGNMENTS */}

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <FaTasks size={35} />

              <h5 className="mt-3">Assignments</h5>

              <p className="text-muted">
                View and submit assignments from your enrolled courses.
              </p>

              <Link to="/student/assignments" className="btn btn-warning">
                Assignments
              </Link>
            </div>
          </div>
        </div>

        {/* QUIZ HISTORY */}

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <FaHistory size={35} />

              <h5 className="mt-3">Quiz Scores</h5>

              <p className="text-muted">View your quiz attempts and scores.</p>

              <Link
                to="/student/quiz-history"
                className="btn btn-info text-white"
              >
                View Scores
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <FaChartLine size={35} className="me-3 text-primary" />

                <div>
                  <h5 className="mb-1">Learning Progress</h5>

                  <p className="text-muted mb-0">
                    Continue learning and track your progress from My Courses.
                  </p>
                </div>
              </div>

              <Link
                to="/student/my-courses"
                className="btn btn-outline-primary mt-3"
              >
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
