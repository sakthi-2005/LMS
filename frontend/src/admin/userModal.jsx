import React, { useState, useEffect } from "react";
import BulkImport from "./bulkimport";

function UserModal({ user, onClose, onSave, onDelete, users }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "Intern",
    ManagerId: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        position: user.position || "",
        ManagerId: user.reporting_manager_id || "",
        isAdmin: user.isAdmin || false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (user) {
      onSave({ ...formData, id: user.id }, "update");
    } else {
      onSave(formData, "insert");
    }
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <span className="admin-close" onClick={onClose}>
          ✖
        </span>
        <h2>{user ? "Edit User" : "Add User"}</h2>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        <select
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
        >
          <option value="Intern">Intern</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
        </select>
        <input
          name="ManagerId"
          placeholder="ManagerId"
          value={formData.ManagerId}
          onChange={handleChange}
        />
        IsAdmin:
        <input
          type="checkbox"
          name="isAdmin"
          checked={formData.isAdmin}
          style={{ width: 20 }}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isAdmin: e.target.checked }))
          }
        />
        <button className="admin-submit" onClick={handleSubmit}>
          Save
        </button>
        {user ? (
          <button className="admin-delete" onClick={() => onDelete(user.id)}>
            Delete
          </button>
        ) : (
          <BulkImport onClose={onClose} />
        )}
      </div>
    </div>
  );
}

export default UserModal;
