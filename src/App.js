import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import LogRegform from "./components/LoginForm/LogRegForm"
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Users from "./pages/Users";
import DashboardUser from "./components/Users/PagesUsers/DashboardUser";
import CreateUser from "./components/Users/PagesUsers/CreateUser";

// ProtectedRoute Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('authToken'); // Check if token exists
  const role = localStorage.getItem('userRole');  // Check the user's role
  // Redirect to login if no token or role mismatch
  if (!token || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/" />;
  }
  return element;
};

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogRegform/>} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['admin']} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} allowedRoles={['admin']} />} />
        <Route path="/upload" element={<ProtectedRoute element={<Upload />} allowedRoles={['admin']} />} />
        <Route path="/dashboarduser" element={<ProtectedRoute element={<DashboardUser />} allowedRoles={['user']} />} />
        <Route path="/createuser" element={<ProtectedRoute element={<CreateUser />} allowedRoles={['user']} />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
