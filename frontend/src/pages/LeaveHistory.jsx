import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../utils/Spinner";

export function LeaveHistory({ user }) {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios
      .get("/leave/history", { params: { userId: user.id } })
      .then((response) => {
        setLoading(false);
        setLeaveHistory(response.data.history);
        setError(null);
      })
      .catch((err) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setError("Failed to fetch leave history.");
        console.error(err);
      });
  }, [user]);

  const handleViewRequest = (leave) => {
    if (leave.status === "cancelled") {
      return;
    }
    setSelectedLeave(leave);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedLeave(null);
  };

  async function cancelRequest(id) {
    await axios
      .delete("/leave/deleteRequest", { params: { lrId: id } })
      .then((response) => {
        console.log(response.data.status);
        setIsOverlayOpen(false);
        setSelectedLeave(null);
      })
      .catch((err) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        console.log(err);
      });
  }

  return (
    <div className="leave-history">
      {error && <p className="error">{error}</p>}
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

      <div className="table-wrapper">
        {leaveHistory.length === 0 ? (
          <>NO LEAVE REQUESTED</>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Leave Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Approved/Rejected By</th>
                <th>Rejected Description</th>
                <th>No of Days</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, index) => (
                <tr key={leave.id} onClick={() => handleViewRequest(leave)}>
                  <td>{index + 1}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.description}</td>
                  <td>
                    {leave.status}{" "}
                    <label htmlFor="file">
                      ({leave.steps_completed}/{leave.steps_required})
                    </label>
                    <progress
                      id="file"
                      value={leave.steps_completed}
                      max={leave.steps_required}
                    ></progress>
                  </td>
                  <td>
                    {leave.approver || leave.rejector || "-"}
                  </td>
                  <td>{leave.rejection_reason || "-"}</td>
                  <td>{leave.no_of_days}</td>
                  <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isOverlayOpen && selectedLeave && (
        <div className="overlay fade-in">
          <div className="overlay-content slide-up">
            <h3>Leave Request Details</h3>
            <p>
              <strong>Leave Type:</strong> {selectedLeave.leaveType}
            </p>
            <p>
              <strong>Reason:</strong> {selectedLeave.description}
            </p>
            <p>
              <strong>Approved/Rejected By:</strong>{" "}
              {selectedLeave.approved_by_name ||
                selectedLeave.rejected_by_name ||
                "N/A"}
            </p>
            <p>
              <strong>Rejected Description:</strong>{" "}
              {selectedLeave.rejection_reason || "N/A"}
            </p>
            <p>
              <strong>No of Days:</strong> {selectedLeave.no_of_days}
            </p>
            <p>
              <strong>From:</strong>{" "}
              {new Date(selectedLeave.from_date).toLocaleDateString()}
            </p>
            <p>
              <strong>To:</strong>{" "}
              {new Date(selectedLeave.to_date).toLocaleDateString()}
            </p>
            <button onClick={handleCloseOverlay} className="close-btn">
              Close
            </button>{" "}
            &nbsp;
            <button
              style={{ background: "red" }}
              onClick={() => cancelRequest(selectedLeave.id)}
            >
              cancelRequest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
