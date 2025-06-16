import { useState , useEffect } from "react";
import Login from "./pages/login";
import Main from "./pages/mainPage";
import { Admin } from "./admin/adminPage";
import { Dashboard } from "./pages/dashboard";
import { CalendarPage } from "./pages/calendar";
import { LeaveHistory } from "./pages/LeaveHistory";
import { RequestPending } from "./pages/pendingRequest";
import "./App.css";
import axios from "axios";
import { Routes , Route , useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_DEFAULT_URL;
if (localStorage.getItem("token")) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${localStorage.getItem("token")}`;
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate("/admin");
    } else if (user && !user.isAdmin) {
      navigate("/main/dashboard");
    }
    else {
      navigate("/");
    }
  }
  , [user]);

  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<Admin user={user} setUser={setUser} />} />
          <Route path="/main" element={<Main setlogin={setUser} />} >
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="calendar" element={<CalendarPage user={user} />} />
          <Route path="leave-history" element={<LeaveHistory user={user} />} />
          <Route path="pending-requests" element={<RequestPending user={user} />} />
          {/* <Route path="/profile" element={<Profile user={user} setUser={setUser} />} /> */}
          </Route>
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </div>
  );
}

export default App;
