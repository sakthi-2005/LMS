import { useState, useEffect } from "react";
import axios from "axios";
import { RequestPage } from "../components/requestPage";
import { Toast } from "../components/toast";
import { fetchPendingRequest } from "../utils/pendingRequests";
import { ReviewScreen } from "../components/reviewScreen";
import Spinner from "../utils/Spinner";

export function Dashboard({ user, setActive, setUser }) {
  const [isRequestLeaveVisible, setIsRequestLeaveVisible] = useState(false);
  let [leaveBalances, setLeaveBalances] = useState([]);
  let [present, setPresent] = useState([]);
  let [absent, setAbsent] = useState([]);
  let [pendingRequestes, setPendingRequestes] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("limeGreen");
  let [view, setView] = useState("closed");
  let [reviewData, setReviewData] = useState({});
  let [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchLeaveBalances = async () => {
      setLoading(true);
      await axios
        .get("/leave/leave-balance", { params: { userId: user.id } })
        .then((response) => {
          setLoading(false);
          setLeaveBalances(response.data.leaveBalances);
        })
        .catch((err) => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          console.log(err);
        });
    };

    const fetchReportees = async () => {
      setLoading(true);
      await axios
        .get("/user/reportees", { params: { userId: user.id } })
        .then((response) => {
          setLoading(false);
          setPresent(
            response.data.reportees.filter(
              (val) =>
                new Date(val.from_date).toLocaleDateString("de-DE") >
                  new Date().toLocaleDateString("de-DE") ||
                new Date(val.to_date).toLocaleDateString("de-DE") <
                  new Date().toLocaleDateString("de-DE"),
            ),
          );
          setAbsent(
            response.data.reportees.filter(
              (val) =>
                new Date(val.from_date).toLocaleDateString("de-DE") <=
                  new Date().toLocaleDateString("de-DE") &&
                new Date(val.to_date).toLocaleDateString("de-DE") >=
                  new Date().toLocaleDateString("de-DE"),
            ),
          );
        })
        .catch((err) => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          console.log(err);
        });
    };

    const fetchingrequests = async () => {
      setLoading(true);
      setPendingRequestes(await fetchPendingRequest(user));
      setLoading(false);
    };

    fetchLeaveBalances();
    fetchReportees();
    fetchingrequests();
  }, []);

  function reviewrequest(index) {
    setReviewData(pendingRequestes[index]);
    setView("review");
  }

  return (
    <div className="page-wrapper">

    {loading && <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
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

      <div className="leave-container">
        {/* Summary Tiles */}
        <div className="tile-row">
          <div className="tile taken">
            Leaves Taken:{" "}
            {leaveBalances.length
              ? leaveBalances
                  .map((val) => val.leavesTaken)
                  .reduce((val, pre) => pre + val)
              : 0}
          </div>
          <div className="tile remaining">
            Leaves Remaining:{" "}
            {leaveBalances.length
              ? leaveBalances
                  .map((val) => val.remainingLeaves)
                  .filter((val) => val < 30)
                  .reduce((val, pre) => pre + val)
              : 0}
          </div>
        </div>

        {/* Breakdown as Cards */}
        <div className="breakdown-section">
          <div className="breakdown-grid">
            {leaveBalances.length > 0 &&
              leaveBalances.map((val, index) => {
                return (
                  <div className="breakdown-tile" key={index}>
                    <h4>{val.leaveType}</h4>
                    <p>
                      <strong>Taken:</strong> {val.leavesTaken || 0}
                    </p>
                    <p>
                      <strong>Pending:</strong>{" "}
                      {val.remainingLeaves < 30
                        ? val.remainingLeaves
                        : Infinity}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <br />
      <div className="requestleave-wrapper">
        <button
          className="action-button request-leave"
          onClick={() => setIsRequestLeaveVisible(true)}
        >
          Request Leave
        </button>
      </div>
      <Toast
        message={toastMessage}
        color={toastColor}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
      {isRequestLeaveVisible && (
        <RequestPage
          leaveBalances={leaveBalances}
          setIsRequestLeaveVisible={setIsRequestLeaveVisible}
          user={user}
          setToastVisible={setToastVisible}
          setToastMessage={setToastMessage}
          setToastColor={setToastColor}
        />
      )}

      {/* Pending Requests Section */}
      {pendingRequestes.length > 0 && (
        <div className="requests-section">
          <h3>Waiting for You</h3>
          {pendingRequestes.length > 3 && (
            <a
              className="view-all-link"
              onClick={() => setActive("requestPending")}
            >
              View All
            </a>
          )}
          <ul className="request-list">
            {pendingRequestes.slice(0, 3).map((req, index) => (
              <li key={index} className="request-item">
                <strong>{req.user_name}</strong> - {req.type} from{" "}
                {new Date(req.from_date).toLocaleDateString("de-DE")} to{" "}
                {new Date(req.to_date).toLocaleDateString("de-DE")}
                <button
                  className="action-button"
                  onClick={() => reviewrequest(index)}
                >
                  Review
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ReviewScreen
        view={view}
        setView={setView}
        data={reviewData}
        userId={user}
      />

      {/* Reportees Section */}
      {(present.length != 0 || absent.length) != 0 && (
        <div className="reportees-section">
          <div className="reportees-list">
            <div className="reportees-group">
              <h4>Present Reportees</h4>
              <ul>
                {present.length != 0 ? (
                  present.map((name, index) => <li key={index}>{name.name}</li>)
                ) : (
                  <b> None present Today</b>
                )}
              </ul>
            </div>
            <div className="reportees-group">
              <h4>Absent Reportees</h4>
              <ul>
                {absent.length != 0 ? (
                  absent.map((name, index) => <li key={index}>{name.name}</li>)
                ) : (
                  <b>None Absent Today</b>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
