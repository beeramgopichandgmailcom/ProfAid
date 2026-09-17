import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AskDoubt from "./pages/AskDoubt";
import ChangePassword from "./pages/ChangePassword";
import HistoryArchive from "./pages/HistoryArchive";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ManageProfessors from "./pages/ManageProfessors";
import MyDoubts from "./pages/MyDoubts";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ViewDoubt from "./pages/ViewDoubt";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/ask-doubt" element={<AskDoubt />} />
          <Route path="/my-doubts" element={<MyDoubts />} />
          <Route path="/history-archive" element={<HistoryArchive />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Student", "Professor"]} />}>
          <Route path="/view-doubt/:doubtID" element={<ViewDoubt />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Student", "Professor", "Admin"]} />}>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Professor"]} />}>
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-professors" element={<ManageProfessors />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
