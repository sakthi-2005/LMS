import { useState } from "react";
import axios from "axios";
import { Toast } from "./toast";

export function ReviewScreen({ view, setView, data, userId }) {
  console.log(data);

  const [rejectionReason, setRejectionReason] = useState("");
  let [toastVisible, setToastVisible] = useState(false);
  let [toastColor, setToastColor] = useState("");
  let [toastMessage, setToastMessage] = useState("");
  let [isRequestLeaveVisible, setIsRequestLeaveVisible] = useState();

  const handleAccept = async () => {
    try {
      const response = await axios.patch("/leave/accept-request", {
        userId: userId,
        reqId: data.id,
      });

      if (response.data.status === "updated") {
        setToastVisible(true);
        setToastColor("green");
        setToastMessage("request Accepted");
        setIsRequestLeaveVisible(false);
        setView("closed");
      }
    } catch (error) {
      console.error("Error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setToastVisible(true);
      setToastColor("red");
      setToastMessage("request failed!");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("❌ Please provide a reason.");
      return;
    }
    try {
      const response = await axios.patch("/leave/reject-request", {
        userId: userId,
        reqId: data.id,
        reason: rejectionReason,
      });

      if (response.data.status === "updated") {
        setToastVisible(true);
        setToastColor("green");
        setToastMessage("Request rejected");
        // setIsRequestLeaveVisible(false);
        setView("closed");
      }
    } catch (error) {
      console.error("Error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setToastVisible(true);
      setToastColor("red");
      setToastMessage("request failed!");
    }
    setRejectionReason("");
    setView("closed");
  };

  const goBack = () => {
    setView("review");
  };

  return (
    <>
      <Toast
        message={toastMessage}
        color={toastColor}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
      {view === "review" && (
        <div className="leave-review-overlay">
          <div className="leave-review-box">
            <h2 className="leave-review-title">Review Leave Request</h2>

            <div className="leave-info-row">
              <span className="info-label">User:</span>
              <span className="info-value">{data.user_name}</span>
            </div>
            <div className="leave-info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{data.type}</span>
            </div>
            <div className="leave-info-row">
              <span className="info-label"> No.Of.Days:</span>
              <span className="info-value">{data.no_of_days}</span>
            </div>
            <div className="leave-info-row">
              <span className="info-label">From:</span>
              <span className="info-value">
                {new Date(data.from_date).toLocaleDateString("de-DE")}
              </span>
            </div>
            <div className="leave-info-row">
              <span className="info-label">To:</span>
              <span className="info-value">
                {new Date(data.to_date).toLocaleDateString("de-DE")}
              </span>
            </div>

            <div className="leave-info-row">
              <span className="info-label">Description:</span>
              <div className="leave-description-text">{data.description}</div>
            </div>

            <hr className="leave-divider" />

            <div className="leave-action-buttons">
              <button
                className="leave-button"
                onClick={() => setView("accept")}
              >
                Accept
              </button>
              <button
                className="leave-button leave-button-danger"
                onClick={() => setView("reject")}
              >
                Reject
              </button>
              <button
                className="leave-button leave-button-secondary"
                onClick={() => setView("Closed")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "accept" && (
        <div className="leave-review-overlay">
          <div className="leave-review-box">
            <h3 className="leave-confirm-title">Confirm Approval</h3>
            <div className="leave-description-text">
              Are you sure you want to approve this leave request?
            </div>
            <div className="leave-action-buttons">
              <button className="leave-button" onClick={handleAccept}>
                Yes, Approve
              </button>
              <button
                className="leave-button leave-button-secondary"
                onClick={goBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "reject" && (
        <div className="leave-review-overlay">
          <div className="leave-review-box">
            <h3 className="leave-confirm-title">Confirm Rejection</h3>
            <div className="leave-description-text">
              Please enter the reason for rejection:
            </div>
            <textarea
              className="leave-textarea"
              rows="4"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
            />
            <div className="leave-action-buttons">
              <button
                className="leave-button leave-button-danger"
                onClick={handleReject}
              >
                Reject
              </button>
              <button
                className="leave-button leave-button-secondary"
                onClick={goBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
