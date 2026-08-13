const StudentDashboard = () => {
  return (
    <div className="container py-4">
      <h2 className="fw-bold">
        Student Dashboard
      </h2>

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <h5>Welcome Student</h5>
          <p className="text-muted">
            Browse courses, continue learning,
            attempt quizzes and track your progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;