import React, { useState , useEffect } from "react";
import "../App.css";
import { Sidebar } from "../components/sidebar";
import { Profile } from "./profile";
import { useNavigate , Outlet } from "react-router-dom";

function Main({ setlogin }) {
  let [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  let [profile, setProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if ( active === "Dashboard" ) {
      navigate("dashboard");
    } else if ( active === "Calendar" ) {
      navigate("calendar");
    }
    else if ( active === "History" ) {
      navigate("leave-history");
    } else {
      navigate("pending-requests");
    }
  }
  , [active, navigate]);


  return (
    <div className="app-container">
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setUser={setlogin}
      />

      {/* Main Content */}
      <div className="content">
        {profile && <Profile setUser={setlogin} />}
        <div className="profilebutton-wrapper">
          <button
            onClick={() => setProfile((e) => !e)}
            className="admin-header-profile"
          >
            👤
          </button>
        </div>

        < Outlet />

        {/* {active === "History" ? (
          <LeaveHistory user={user} />
        ) : active === "Dashboard" ? (
          <Dashboard user={user} setActive={setActive} />
        ) : active === "Calendar" ? (
          <CalendarPage user={user} />
        ) : (
          <RequestPending user={user} />
        )} */}
      </div>
    </div>
  );
}

export default Main;
