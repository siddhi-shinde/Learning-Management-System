import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaSearch,
  FaUser,
  FaTag,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getAllCourses } from "../../api/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ==============================
  // GET COURSES
  // ==============================

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await getAllCourses();

      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error("Get Courses Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD COURSES
  // ==============================

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    return (
      course.title
        ?.toLowerCase()
        .includes(searchText) ||
      course.description
        ?.toLowerCase()
        .includes(searchText) ||
      course.category?.name
        ?.toLowerCase()
        .includes(searchText) ||
      course.instructorId?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="container-fluid py-4">

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

        <div>
          <h2 className="fw-bold">
            Browse Courses
          </h2>

          <p className="text-muted mb-0">
            Explore our available courses and start learning.
          </p>
        </div>

        <div className="mt-3 mt-md-0">

          <span className="badge bg-primary fs-6">
            {courses.length} Courses
          </span>

        </div>

      </div>

      {/* ============================== */}
      {/* SEARCH */}
      {/* ============================== */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="input-group">

            <span className="input-group-text bg-white">

              <FaSearch />

            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Search courses by title, category or instructor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

      </div>

      {/* ============================== */}
      {/* LOADING */}
      {/* ============================== */}

      {loading && (
        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          />

          <p className="mt-3 text-muted">
            Loading courses...
          </p>

        </div>
      )}

      {/* ============================== */}
      {/* NO COURSES */}
      {/* ============================== */}

      {!loading && courses.length === 0 && (
        <div className="text-center py-5">

          <FaBook
            size={50}
            className="text-muted mb-3"
          />

          <h5>
            No courses available
          </h5>

          <p className="text-muted">
            There are currently no published courses.
          </p>

        </div>
      )}

      {/* ============================== */}
      {/* NO SEARCH RESULT */}
      {/* ============================== */}

      {!loading &&
        courses.length > 0 &&
        filteredCourses.length === 0 && (
          <div className="text-center py-5">

            <FaSearch
              size={45}
              className="text-muted mb-3"
            />

            <h5>
              No courses found
            </h5>

            <p className="text-muted">
              Try searching with a different keyword.
            </p>

          </div>
        )}

      {/* ============================== */}
      {/* COURSE CARDS */}
      {/* ============================== */}

      {!loading && filteredCourses.length > 0 && (

        <div className="row g-4">

          {filteredCourses.map((course) => (

            <div
              className="col-md-6 col-lg-4 col-xl-3"
              key={course._id}
            >

              <div className="card h-100 shadow-sm border-0">

                {/* ============================== */}
                {/* THUMBNAIL */}
                {/* ============================== */}

                <div
                  style={{
                    height: "180px",
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                  }}
                >

                  {course.thumbnail ? (

                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                      }}
                    />

                  ) : (

                    <div
                      className="d-flex justify-content-center align-items-center h-100"
                    >

                      <FaBook
                        size={55}
                        className="text-muted"
                      />

                    </div>

                  )}

                </div>

                {/* ============================== */}
                {/* CARD BODY */}
                {/* ============================== */}

                <div className="card-body d-flex flex-column">

                  <h5 className="card-title fw-bold">

                    {course.title}

                  </h5>

                  <p
                    className="text-muted small"
                    style={{
                      minHeight: "48px",
                    }}
                  >

                    {course.description?.length > 100
                      ? `${course.description.substring(
                          0,
                          100
                        )}...`
                      : course.description}

                  </p>

                  {/* CATEGORY */}

                  {course.category && (

                    <div className="mb-2">

                      <FaTag
                        className="me-2 text-primary"
                        size={13}
                      />

                      <span className="small text-muted">

                        {course.category.name}

                      </span>

                    </div>

                  )}

                  {/* INSTRUCTOR */}

                  {course.instructorId && (

                    <div className="mb-3">

                      <FaUser
                        className="me-2 text-secondary"
                        size={13}
                      />

                      <span className="small text-muted">

                        {course.instructorId.name}

                      </span>

                    </div>

                  )}

                  {/* PRICE */}

                  <div className="mb-3">

                    {course.price === 0 ? (

                      <span className="badge bg-success fs-6">
                        Free
                      </span>

                    ) : (

                      <span className="fw-bold text-primary fs-5">

                        ₹{course.price}

                      </span>

                    )}

                  </div>

                  {/* BUTTON */}

                  <div className="mt-auto">

                    <Link
                      to={`/student/course/${course._id}`}
                      className="btn btn-primary w-100"
                    >
                      View Course
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Courses;