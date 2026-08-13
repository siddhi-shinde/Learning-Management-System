const AdminDashboard = () => {
  return (
    <div className="container py-4">
      <h2 className="fw-bold">Admin Dashboard</h2>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Students</h6>
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Instructors</h6>
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Courses</h6>
            <h2>0</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <h6>Total Enrollments</h6>
            <h2>0</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;