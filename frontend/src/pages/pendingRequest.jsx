import { useState, useEffect } from "react";
import { fetchPendingRequest } from "../utils/pendingRequests";
import { ReviewScreen } from "../components/reviewScreen";
import Spinner from "../example/loaders/Spinner";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("de-DE");
}

export function RequestPending({ user }) {
  let [view, setView] = useState("closed");
  let [data, setData] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchpendingrequest() {
      setLoading(true);
      setPendingRequests(await fetchPendingRequest(user));
      setLoading(false);
    }
    fetchpendingrequest();
  }, []);

  const handleReview = (request) => {
    setData(request);
    setView("review");
  };

  return (
    <div className="request-page">
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
      <div className="request-container">
        <ReviewScreen
          view={view}
          setView={setView}
          data={data}
          userId={user.id}
        />
        {pendingRequests.length === 0 ? (
          <div className="request-empty-message">
            🎉 No pending leave requests!
          </div>
        ) : (
          <div className="request-grid">
            {pendingRequests.map((req, index) => (
              <div className="request-card" key={req.id}>
                <div className="request-details-header">
                  <div className="request-user">{req.user_name}</div>
                  <div className="request-type-badge">{req.type}</div>
                </div>
                <div className="request-dates">
                  🗓 {formatDate(req.from_date)} → {formatDate(req.to_date)}
                </div>
                <div className="request-description">📋 {req.description}</div>
                <button
                  className="request-review-btn"
                  onClick={() => handleReview(req)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
