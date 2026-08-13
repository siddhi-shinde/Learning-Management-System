import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axiosInstance.post(
        "/auth/register",
        formData
      );

      setSuccess(
        "Registration successful. Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h2 className="text-center fw-bold mb-4">
                  Create Account
                </h2>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Register As
                    </label>

                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="student">
                        Student
                      </option>

                      <option value="instructor">
                        Instructor
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Register"}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0">
                  Already have an account?{" "}
                  <Link to="/login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;