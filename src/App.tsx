import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Students from "./pages/Students";
import AdmissionsPage from "./pages/AdmissionsPage";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import QueriesPage from "./pages/QueriesPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Performance from "./pages/Performance";
import Attendance from "./pages/Attendance";
import FacultyInfo from "./pages/FacultyInfo";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="students" replace />} />
            <Route path="students" element={<Students />} />
            <Route
              path="admissions"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route path="courses" element={<Courses />} />
            <Route
              path="faculty"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Faculty />
                </ProtectedRoute>
              }
            />
            <Route path="queries" element={<QueriesPage />} />
            <Route path="performance" element={<Performance />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="faculty-info" element={<FacultyInfo />} />
            <Route path="notifications" element={<Notifications />} />
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "faculty"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
