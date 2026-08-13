import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            LMS
          </Link>

          <div className="d-flex gap-2">
            <Link
              to="/login"
              className="btn btn-outline-primary"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="container py-5">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">
              Learn. Grow. Succeed.
            </h1>

            <p className="lead text-muted mt-3">
              Welcome to our Learning Management System.
              Learn from expert instructors, complete
              assignments and quizzes, and track your
              learning progress.
            </p>

            <div className="mt-4">
              <Link
                to="/register"
                className="btn btn-primary btn-lg me-3"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="btn btn-outline-dark btn-lg"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="bg-primary text-white rounded-4 p-5 shadow">
              <h2>Learning Management System</h2>

              <p className="mt-3 mb-0">
                Courses • Lectures • Assignments • Quizzes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;