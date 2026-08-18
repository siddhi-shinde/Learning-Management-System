import {
  FaBook,
  FaUsers,
  FaClipboardCheck,
  FaQuestionCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const InstructorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">

        <h2>
          Instructor Dashboard
        </h2>

        <p className="text-muted">
          Welcome, {user?.name}
        </p>

      </div>

      <div className="row g-4">

        {/* MY COURSES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaBook size={35} />

              <h5 className="mt-3">
                My Courses
              </h5>

              <p className="text-muted">
                Manage your courses.
              </p>

              <Link
                to="/instructor/courses"
                className="btn btn-primary"
              >
                My Courses
              </Link>

            </div>

          </div>

        </div>

        {/* STUDENTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaUsers size={35} />

              <h5 className="mt-3">
                Students
              </h5>

              <p className="text-muted">
                View your students.
              </p>

              <button
                className="btn btn-success"
                disabled
              >
                Students
              </button>

            </div>

          </div>

        </div>

        {/* ASSIGNMENTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaClipboardCheck size={35} />

              <h5 className="mt-3">
                Assignments
              </h5>

              <p className="text-muted">
                Manage assignments.
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

        {/* QUIZZES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaQuestionCircle size={35} />

              <h5 className="mt-3">
                Quizzes
              </h5>

              <p className="text-muted">
                Create and manage quizzes.
              </p>

              <button
                className="btn btn-info"
                disabled
              >
                Quizzes
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InstructorDashboard;