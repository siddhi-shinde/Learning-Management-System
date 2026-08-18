import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}

      <div className="mb-4">

        <h2>
          Admin Dashboard
        </h2>

        <p className="text-muted">
          Welcome back, {user?.name}
        </p>

      </div>

      {/* CARDS */}

      <div className="row g-4">

        {/* STUDENTS */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaUserGraduate
                size={35}
                className="mb-3"
              />

              <h5>
                Students
              </h5>

              <p className="text-muted">
                Manage all students.
              </p>

              <Link
                to="/admin/students"
                className="btn btn-primary"
              >
                Manage Students
              </Link>

            </div>

          </div>

        </div>

        {/* INSTRUCTORS */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaChalkboardTeacher
                size={35}
                className="mb-3"
              />

              <h5>
                Instructors
              </h5>

              <p className="text-muted">
                Manage instructors.
              </p>

              <Link
                to="/admin/instructors"
                className="btn btn-success"
              >
                Manage Instructors
              </Link>

            </div>

          </div>

        </div>

        {/* COURSES */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaBook
                size={35}
                className="mb-3"
              />

              <h5>
                Courses
              </h5>

              <p className="text-muted">
                Manage all courses.
              </p>

              <Link
                to="/admin/courses"
                className="btn btn-warning"
              >
                Manage Courses
              </Link>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaClipboardList
                size={35}
                className="mb-3"
              />

              <h5>
                Categories
              </h5>

              <p className="text-muted">
                Manage course categories.
              </p>

              <Link
                to="/admin/categories"
                className="btn btn-info"
              >
                Categories
              </Link>

            </div>

          </div>

        </div>

        {/* ENROLLMENTS */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaUsers
                size={35}
                className="mb-3"
              />

              <h5>
                Enrollments
              </h5>

              <p className="text-muted">
                Manage course enrollments.
              </p>

              <Link
                to="/admin/enrollments"
                className="btn btn-secondary"
              >
                Enrollments
              </Link>

            </div>

          </div>

        </div>

        {/* REPORTS */}

        <div className="col-md-4 col-lg-3">

          <div className="card shadow-sm h-100">

            <div className="card-body">

              <FaChartBar
                size={35}
                className="mb-3"
              />

              <h5>
                Reports
              </h5>

              <p className="text-muted">
                View LMS reports.
              </p>

              <button
                className="btn btn-dark"
                disabled
              >
                Reports
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;