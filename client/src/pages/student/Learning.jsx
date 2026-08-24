import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaBook,
  FaPlay,
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getCourseById,
  getCourseLectures,
  getMyEnrollments,
  updateCourseProgress,
} from "../../api/api";

const Learning = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] =
    useState(null);

  // ==========================================
  // ENROLLMENT
  // ==========================================

  const [enrollment, setEnrollment] =
    useState(null);

  // ==========================================
  // COMPLETED LECTURES
  // ==========================================

  const [completedLectures, setCompletedLectures] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [updatingProgress, setUpdatingProgress] =
    useState(false);

  // ==========================================
  // FETCH COURSE + LECTURES + ENROLLMENT
  // ==========================================

  const fetchLearningData = async () => {
    try {
      setLoading(true);

      const [
        courseResponse,
        lecturesResponse,
        enrollmentResponse,
      ] = await Promise.all([
        getCourseById(courseId),
        getCourseLectures(courseId),
        getMyEnrollments(),
      ]);

      // ==========================================
      // COURSE
      // ==========================================

      if (courseResponse.data.success) {
        setCourse(
          courseResponse.data.course
        );
      }

      // ==========================================
      // LECTURES
      // ==========================================

      if (lecturesResponse.data.success) {
        const lectureData =
          lecturesResponse.data.lectures || [];

        const sortedLectures =
          [...lectureData].sort(
            (a, b) =>
              (a.order || 0) -
              (b.order || 0)
          );

        setLectures(sortedLectures);

        if (sortedLectures.length > 0) {
          setSelectedLecture(
            sortedLectures[0]
          );
        }
      }

      // ==========================================
      // FIND CURRENT ENROLLMENT
      // ==========================================

      if (enrollmentResponse.data.success) {
        const enrollments =
          enrollmentResponse.data.enrollments ||
          [];

        const currentEnrollment =
          enrollments.find(
            (item) =>
              item.courseId?._id === courseId ||
              item.courseId === courseId
          );

        if (currentEnrollment) {
          setEnrollment(
            currentEnrollment
          );

          // ==========================================
          // GET COMPLETED LECTURE IDs
          // ==========================================

          const completedIds =
            (
              currentEnrollment.completedLectures ||
              []
            ).map((lecture) =>
              typeof lecture === "string"
                ? lecture
                : lecture._id
            );

          setCompletedLectures(
            completedIds
          );
        } else {
          toast.error(
            "You are not enrolled in this course"
          );
        }
      }
    } catch (error) {
      console.error(
        "Learning Data Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load course content"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchLearningData();
  }, [courseId]);

  // ==========================================
  // AUTOMATICALLY MARK LECTURE COMPLETED
  // ==========================================

  const handleLectureCompleted = async () => {
    if (!selectedLecture) {
      return;
    }

    if (!enrollment) {
      toast.error(
        "Enrollment information not found"
      );

      return;
    }

    // ==========================================
    // CHECK IF ALREADY COMPLETED
    // ==========================================

    if (
      completedLectures.includes(
        selectedLecture._id
      )
    ) {
      return;
    }

    try {
      setUpdatingProgress(true);

      // ==========================================
      // SEND ENROLLMENT ID + LECTURE ID
      // ==========================================

      const response =
        await updateCourseProgress(
          enrollment._id,
          selectedLecture._id
        );

      // ==========================================
      // SUCCESS
      // ==========================================

      if (response.data.success) {
        const updatedEnrollment =
          response.data.enrollment;

        // Update enrollment
        setEnrollment(
          updatedEnrollment
        );

        // ==========================================
        // UPDATE COMPLETED LECTURES
        // ==========================================

        const completedIds =
          (
            updatedEnrollment.completedLectures ||
            []
          ).map((lecture) =>
            typeof lecture === "string"
              ? lecture
              : lecture._id
          );

        setCompletedLectures(
          completedIds
        );

        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        if (
          updatedEnrollment.completed
        ) {
          toast.success(
            "🎉 Congratulations! Course completed!"
          );
        } else {
          toast.success(
            `Lecture completed! Progress: ${updatedEnrollment.progress}%`
          );
        }
      }
    } catch (error) {
      console.error(
        "Lecture Completion Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update lecture progress"
      );
    } finally {
      setUpdatingProgress(false);
    }
  };

  // ==========================================
  // NEXT LECTURE
  // ==========================================

  const handleNextLecture = () => {
    if (!selectedLecture) return;

    const currentIndex =
      lectures.findIndex(
        (lecture) =>
          lecture._id ===
          selectedLecture._id
      );

    if (
      currentIndex !== -1 &&
      currentIndex <
        lectures.length - 1
    ) {
      setSelectedLecture(
        lectures[currentIndex + 1]
      );
    }
  };

  // ==========================================
  // PREVIOUS LECTURE
  // ==========================================

  const handlePreviousLecture = () => {
    if (!selectedLecture) return;

    const currentIndex =
      lectures.findIndex(
        (lecture) =>
          lecture._id ===
          selectedLecture._id
      );

    if (currentIndex > 0) {
      setSelectedLecture(
        lectures[currentIndex - 1]
      );
    }
  };

  // ==========================================
  // CURRENT INDEX
  // ==========================================

  const currentIndex =
    selectedLecture
      ? lectures.findIndex(
          (lecture) =>
            lecture._id ===
            selectedLecture._id
        )
      : -1;

  // ==========================================
  // CURRENT PROGRESS
  // ==========================================

  const currentProgress =
    enrollment?.progress || 0;

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
          Loading course content...
        </p>

      </div>
    );
  }

  // ==========================================
  // COURSE NOT FOUND
  // ==========================================

  if (!course) {
    return (
      <div className="container py-5 text-center">

        <FaBook
          size={60}
          className="text-muted mb-3"
        />

        <h4>
          Course not found
        </h4>

        <Link
          to="/student/my-courses"
          className="btn btn-primary mt-3"
        >
          My Courses
        </Link>

      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="mb-4">

        <Link
          to="/student/my-courses"
          className="btn btn-outline-secondary mb-3"
        >
          <FaChevronLeft className="me-2" />
          Back to My Courses
        </Link>

        <h2 className="fw-bold">
          {course.title}
        </h2>

        <p className="text-muted mb-3">
          {course.description}
        </p>

        {/* ========================================== */}
        {/* COURSE PROGRESS */}
        {/* ========================================== */}

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between mb-2">

              <strong>
                Course Progress
              </strong>

              <strong className="text-primary">
                {currentProgress}%
              </strong>

            </div>

            <div
              className="progress"
              style={{
                height: "10px",
              }}
            >

              <div
                className={`progress-bar ${
                  currentProgress === 100
                    ? "bg-success"
                    : "bg-primary"
                }`}
                role="progressbar"
                style={{
                  width: `${currentProgress}%`,
                }}
              />

            </div>

            {currentProgress === 100 && (
              <div className="text-success mt-2">

                <FaCheckCircle className="me-2" />

                Course Completed

              </div>
            )}

          </div>

        </div>

      </div>

      <div className="row g-4">

        {/* ========================================== */}
        {/* LECTURE LIST */}
        {/* ========================================== */}

        <div className="col-lg-4 col-xl-3">

          <div className="card shadow-sm border-0">

            <div className="card-header bg-primary text-white">

              <h5 className="mb-0">
                Course Content
              </h5>

              <small>
                {completedLectures.length} /{" "}
                {lectures.length} completed
              </small>

            </div>

            <div
              className="list-group list-group-flush"
              style={{
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >

              {lectures.length === 0 ? (

                <div className="text-center p-4">

                  <FaBook
                    size={40}
                    className="text-muted mb-3"
                  />

                  <p className="text-muted mb-0">
                    No lectures available yet.
                  </p>

                </div>

              ) : (

                lectures.map(
                  (lecture, index) => {

                    const isSelected =
                      selectedLecture?._id ===
                      lecture._id;

                    const isCompleted =
                      completedLectures.includes(
                        lecture._id
                      );

                    return (
                      <button
                        key={lecture._id}
                        type="button"
                        className={`list-group-item list-group-item-action ${
                          isSelected
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedLecture(
                            lecture
                          )
                        }
                      >

                        <div className="d-flex align-items-start">

                          <div className="me-3">

                            {isCompleted ? (

                              <FaCheckCircle
                                className={
                                  isSelected
                                    ? "text-white"
                                    : "text-success"
                                }
                              />

                            ) : isSelected ? (

                              <FaPlay />

                            ) : (

                              <FaCircle
                                size={10}
                              />

                            )}

                          </div>

                          <div className="text-start">

                            <div className="fw-semibold">

                              {index + 1}.{" "}
                              {lecture.title}

                            </div>

                            {lecture.duration && (

                              <small
                                className={
                                  isSelected
                                    ? "text-white-50"
                                    : "text-muted"
                                }
                              >
                                {lecture.duration}
                              </small>

                            )}

                          </div>

                        </div>

                      </button>
                    );
                  }
                )

              )}

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* MAIN LEARNING AREA */}
        {/* ========================================== */}

        <div className="col-lg-8 col-xl-9">

          {!selectedLecture ? (

            <div className="card shadow-sm border-0">

              <div className="card-body text-center py-5">

                <FaPlay
                  size={55}
                  className="text-muted mb-3"
                />

                <h5>
                  Select a lecture
                </h5>

                <p className="text-muted">
                  Select a lecture from the course content.
                </p>

              </div>

            </div>

          ) : (

            <>

              {/* ========================================== */}
              {/* VIDEO */}
              {/* ========================================== */}

              <div className="card shadow-sm border-0 mb-4">

                <div className="card-body p-0">

                  {selectedLecture.videoUrl ? (

                    <video
                      key={
                        selectedLecture._id
                      }
                      controls
                      className="w-100"
                      onEnded={
                        handleLectureCompleted
                      }
                      style={{
                        maxHeight: "600px",
                        backgroundColor: "#000",
                      }}
                    >

                      <source
                        src={
                          selectedLecture.videoUrl
                        }
                        type="video/mp4"
                      />

                      Your browser does not support
                      the video player.

                    </video>

                  ) : (

                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "400px",
                        backgroundColor:
                          "#f5f5f5",
                      }}
                    >

                      <div className="text-center">

                        <FaPlay
                          size={60}
                          className="text-muted mb-3"
                        />

                        <h5>
                          Video not available
                        </h5>

                        <p className="text-muted">
                          This lecture does not have a video yet.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </div>

              {/* ========================================== */}
              {/* LECTURE INFORMATION */}
              {/* ========================================== */}

              <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-start">

                    <div>

                      <h3 className="fw-bold">
                        {selectedLecture.title}
                      </h3>

                      <p className="text-muted">
                        Lecture{" "}
                        {currentIndex + 1} of{" "}
                        {lectures.length}
                      </p>

                    </div>

                    {/* COMPLETED BADGE */}

                    {completedLectures.includes(
                      selectedLecture._id
                    ) && (

                      <span className="badge bg-success fs-6">

                        <FaCheckCircle className="me-1" />

                        Completed

                      </span>

                    )}

                  </div>

                  {/* ========================================== */}
                  {/* PDF */}
                  {/* ========================================== */}

                  {selectedLecture.pdfUrl && (

                    <a
                      href={
                        selectedLecture.pdfUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-danger"
                    >

                      <FaFilePdf className="me-2" />

                      View / Download Notes

                    </a>

                  )}

                  {/* ========================================== */}
                  {/* AUTOMATIC COMPLETION INFO */}
                  {/* ========================================== */}

                  {!completedLectures.includes(
                    selectedLecture._id
                  ) &&
                    selectedLecture.videoUrl && (

                      <div className="mt-3 text-muted small">

                        <FaPlay className="me-2" />

                        Complete the video to
                        automatically mark this
                        lecture as completed.

                      </div>

                    )}

                  {updatingProgress && (

                    <div className="mt-3 text-primary small">

                      <span
                        className="spinner-border spinner-border-sm me-2"
                      />

                      Updating your progress...

                    </div>

                  )}

                </div>

              </div>

              {/* ========================================== */}
              {/* PREVIOUS / NEXT */}
              {/* ========================================== */}

              <div className="d-flex justify-content-between">

                <button
                  className="btn btn-outline-primary"
                  onClick={
                    handlePreviousLecture
                  }
                  disabled={
                    currentIndex <= 0
                  }
                >

                  <FaChevronLeft className="me-2" />

                  Previous

                </button>

                <button
                  className="btn btn-primary"
                  onClick={
                    handleNextLecture
                  }
                  disabled={
                    currentIndex ===
                    lectures.length - 1
                  }
                >

                  Next

                  <FaChevronRight className="ms-2" />

                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default Learning;