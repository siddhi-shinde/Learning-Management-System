import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>

        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* ========================= */}
        {/* PROTECTED ROUTES */}
        {/* ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* ========================= */}
          {/* ADMIN */}
          {/* ========================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["admin"]}
              />
            }
          >

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

          </Route>

          {/* ========================= */}
          {/* INSTRUCTOR */}
          {/* ========================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["instructor"]}
              />
            }
          >

            <Route
              path="/instructor/dashboard"
              element={
                <InstructorDashboard />
              }
            />

          </Route>

          {/* ========================= */}
          {/* STUDENT */}
          {/* ========================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={["student"]}
              />
            }
          >

            <Route
              path="/student/dashboard"
              element={
                <StudentDashboard />
              }
            />

          </Route>

        </Route>

        {/* ========================= */}
        {/* FALLBACK */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </>
  );
};

export default App;