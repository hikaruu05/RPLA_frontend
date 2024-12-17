import {BrowserRouter, Routes, Route} from "react-router-dom"
import LogRegform from "./components/LoginForm/LogRegForm"
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Users from "./pages/Users";
import DashboardUser from "./components/Users/PagesUsers/DashboardUser";
import CreateUser from "./components/Users/PagesUsers/CreateUser"

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogRegform/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboarduser" element={<DashboardUser />} />
        <Route path="/createuser" element={<CreateUser />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
