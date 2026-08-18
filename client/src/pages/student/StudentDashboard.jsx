import {
  FaBook,
  FaGraduationCap,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">

        <h2>
          Student Dashboard
        </h2>

        <p className="text-muted">
          Welcome, {user?.name}
        </p>

      </div>

      <div className="row g-4">

        {/* BROWSE COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaBook size={35} />

              <h5 className="mt-3">
                Browse Courses
              </h5>

              <p className="text-muted">
                Explore available courses.
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

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaGraduationCap size={35} />

              <h5 className="mt-3">
                My Courses
              </h5>

              <p className="text-muted">
                View your enrolled courses.
              </p>

              <button
                className="btn btn-success"
                disabled
              >
                My Courses
              </button>

            </div>

          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaTasks size={35} />

              <h5 className="mt-3">
                Assignments
              </h5>

              <p className="text-muted">
                View upcoming assignments.
              </p>

              <button
                className="btn btn-warning"
                disabled
              >
                Assignments
              </button>

            </div>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaChartLine size={35} />

              <h5 className="mt-3">
                My Progress
              </h5>

              <p className="text-muted">
                Track your learning progress.
              </p>

              <button
                className="btn btn-info"
                disabled
              >
                View Progress
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;