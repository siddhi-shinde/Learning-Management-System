import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/instructor/dashboard"
        element={<InstructorDashboard />}
      />

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />
    </Routes>
  );
};

export default App;