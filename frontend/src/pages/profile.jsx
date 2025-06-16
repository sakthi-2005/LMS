import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../utils/Spinner";

export function Profile({ setUser }) {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2,setPassword2] = useState('')
  const [showProfile, setShowProfile] = useState(true);
  const [userId, setUserId] = useState(
    JSON.parse(localStorage.getItem("user")),
  );
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(password1 != '' && password2 != '' && password1 === password2){
      setIsEditingPassword(false);
    }
    else{
      setIsEditingPassword(true);
    }
  },[password1,password2])


  const handleSavePassword = async () => {
    if(password1 != password2 || password1 == ''){
      return;
    }
    setIsEditingPassword(false);

    await axios
      .patch("/admin/updateUser", {
        userId: { password: password1, id: userId.id },
      })
      .then((response) => {
        setShowProfile(false);
        console.log(response.data.status);
      })
      .catch((err) => {
        localStorage.removeItem("user");
        setUser(null);
        localStorage.removeItem("token");
        setShowProfile(false);
        console.log(err);
      });
  };

  useEffect(() => {
    async function fetchUserDetails(userId) {
      setLoading(true);
      await axios
        .get("/user/userDetails", {
          params: { userId: userId.id },
        })
        .then((response) => {
          setLoading(false);
          setUserDetails(response.data.userDetails);
        })
        .catch((err) => {
          localStorage.removeItem("user");
          setUser(null);
          localStorage.removeItem("token");
          setShowProfile(false);
          console.log(err);
        });
    }

    fetchUserDetails(userId);
  }, [userId]);

  if (!showProfile) return null;

  return (
    <div className="profilePage">
      <button className="profileCloseBtn" onClick={() => setShowProfile(false)}>
        &times;
      </button>

      <div className="profileContent">
        {loading && <div style={{
          display: 'flex',
          position: 'absolute',
          top: 0, left: 0,
          height: "100%",
          width: '100%',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(4px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: '#fff',
        }}>
          <Spinner size={60} borderColor="rgba(255,255,255,0.2)" borderTopColor="#00c6ff" />
          <div style={{ marginTop: 16, fontSize: '1.2rem', opacity: 0.9, fontFamily: 'Arial, sans-serif' }}>
            Please wait...
          </div>
        </div>}
        <div className="profileSectionTitle">Personal Information</div>
        <div className="profileInfoRow">
          <div className="profileLabel">Name:</div>
          <div className="profileValue">
            {userDetails.name}
            {userDetails.isAdmin ? "(Administrator)" : null}
          </div>
        </div>
        <div className="profileInfoRow">
          <div className="profileLabel">Employee ID:</div>
          <div className="profileValue">{userDetails.id}</div>
        </div>
        <div className="profileInfoRow">
          <div className="profileLabel">Email:</div>
          <div className="profileValue">{userDetails.email}</div>
        </div>

        <div className="profileSectionTitle">Professional Information</div>
        <div className="profileInfoRow">
          <div className="profileLabel">Position:</div>
          <div className="profileValue">{userDetails.position}</div>
        </div>
        <div className="profileInfoRow">
          <div className="profileLabel">Reporting Manager:</div>
          <div className="profileValue">{userDetails.Manager || "N/A"}</div>
        </div>
        <div className="profileInfoRow">
          <div className="profileLabel">Manager ID:</div>
          <div className="profileValue">
            {userDetails.reporting_manager_id || "N/A"}
          </div>
        </div>

        <div className="profileSectionTitle">Security</div>
        <div className="profileInfoRow profilePasswordRow">
          <div className="profileLabel">Change Password:</div>
          <div
            className="profileValue"
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              flexDirection: "column"
            }}
          >
            <input
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="profilePasswordInput"
              placeholder="Enter Password"
            />
            <input
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="profilePasswordInput"
              placeholder="Re-Enter password"
            />
          </div>
        </div>

        <div className="profileButtonGroup">
          {!isEditingPassword && (
            <>
              <button className="profileBtn save" onClick={handleSavePassword}>
                Save
              </button>
            </>
          )}
        </div>
        <button
          className="logoutbtn"
          onClick={() => {
            localStorage.removeItem("user");
            axios.defaults.headers.common["Authorization"] = "";
            localStorage.removeItem("token");
            setUser(null);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
