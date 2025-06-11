import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

function BulkImport({ onClose }) {
  const [parsedUsers, setParsedUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a valid CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results.data);
        const validUsers = results.data
          .map((row) => ({
            name: row.name?.trim(),
            email: row.email?.trim(),
            position: row.position?.trim(),
            ManagerId: row.Manager?.trim(),
            password: row.password?.trim(),
            isAdmin: row.isAdmin,
          }))
          .filter(
            (user) =>
              user.name &&
              user.email &&
              user.position &&
              user.ManagerId &&
              user.password &&
              user.isAdmin,
          );
        setParsedUsers(validUsers);
        setError("");
        if (validUsers.length == 0) {
          setError("no User to Add");
        }
      },
      error: () => {
        setError("Failed to parse CSV. Please try again.");
      },
    });
  };

  const handleImport = async () => {
    if (parsedUsers.length > 0) {
      await axios
        .post("/admin/addUser", { params: { data: parsedUsers } })
        .then((response) => {
          console.log(response.data.status);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
      setParsedUsers([]);
    } else {
      setError("no users in this file");
    }
  };

  return (
    <div className="admin-bulk-import">
      <label className="admin-upload-label">
        📁 Upload CSV
        <input
          type="file"
          onChange={handleFileChange}
          className="admin-file-input"
        />
      </label>
      {error && <p className="admin-error">{error}</p>}

      {parsedUsers.length > 0 && (
        <div className="admin-preview">
          <h4>Preview ({parsedUsers.length} users):</h4>
          <ul>
            {parsedUsers.map((user, idx) => (
              <li key={idx}>
                {user.name} — {user.position}
              </li>
            ))}
          </ul>
          <button className="admin-button" onClick={handleImport}>
            Import Users
          </button>
        </div>
      )}
    </div>
  );
}

export default BulkImport;
