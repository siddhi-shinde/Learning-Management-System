import { Navigate, Route, Routes } from "react-router-dom";

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

import Courses from "./pages/student/Courses";
import MyCourses from "./pages/student/MyCourses";
import CourseDetails from "./pages/student/CourseDetails";
import Assignments from "./pages/student/Assignments";
import AssignmentDetails from "./pages/student/AssignmentDetails";
import Quizzes from "./pages/student/Quizzes";
import Progress from "./pages/student/Progress";
import Profile from "./pages/student/Profile";
import Learning from "./pages/student/Learning";
import CourseQuizzes from "./pages/student/CourseQuizzes";
import QuizAttempt from "./pages/student/QuizAttempt";
import QuizResult from "./pages/student/QuizResult";
import QuizHistory from "./pages/student/QuizHistory";

import CourseAssignments from "./pages/student/CourseAssignments";
import AssignmentSubmission from "./pages/student/AssignmentSubmission";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ========================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ========================= */}
        {/* PROTECTED ROUTES */}
        {/* ========================= */}

        <Route element={<ProtectedRoute />}>
          {/* ========================= */}
          {/* ADMIN */}
          {/* ========================= */}

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* ========================= */}
          {/* INSTRUCTOR */}
          {/* ========================= */}

          <Route element={<RoleRoute allowedRoles={["instructor"]} />}>
            <Route
              path="/instructor/dashboard"
              element={<InstructorDashboard />}
            />
          </Route>
          {/* ========================= */}
          {/* STUDENT */}
          {/* ========================= */}

          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />

            <Route path="/student/courses" element={<Courses />} />

            <Route path="/student/my-courses" element={<MyCourses />} />

            <Route path="/student/course/:id" element={<CourseDetails />} />
           
            <Route path="/student/assignments" element={<Assignments />} />

            <Route path="/student/assignments/:assignmentId" element={<AssignmentDetails />}/>

            <Route path="/student/quizzes" element={<Quizzes />} />

            <Route path="/student/progress" element={<Progress />} />

            <Route path="/student/profile" element={<Profile />} />

            <Route path="/student/learning/:courseId" element={<Learning />} />

            <Route path="/student/course/:courseId/quizzes" element={<CourseQuizzes />} />

            <Route path="/student/quiz/:quizId" element={<QuizAttempt />} />

            <Route path="/student/quiz/result/:quizId" element={<QuizResult />}/>

            <Route path="/student/quiz-history" element={<QuizHistory />}/>

            <Route path="/student/course/:courseId/assignments" element={<CourseAssignments />} />

            <Route path="/student/assignment/:assignmentId" element={<AssignmentSubmission />} />

          </Route>
        </Route>

        {/* ========================= */}
        {/* FALLBACK */}
        {/* ========================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
