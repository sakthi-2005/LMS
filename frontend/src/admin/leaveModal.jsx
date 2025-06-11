import React, { useState, useEffect } from "react";

function LeaveModal({ leave, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    days_allowed: 1,
    position: "Intern",
    conformation_steps: 1,
  });

  useEffect(() => {
    if (leave) {
      setFormData({
        name: leave.name || "",
        days_allowed: leave.monthly_allocation || null,
        position: leave.position || "Intern",
        conformation_steps: leave.conformation_steps || null,
      });
    }
  }, [leave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (leave) {
      onSave({ ...formData, id: leave.id }, "update");
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
        <h2>{leave ? "Edit Leave Type" : "Add Leave Type"}</h2>
        <input
          name="name"
          placeholder="Leave Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="days_allowed"
          type="number"
          placeholder="Days Allowed"
          value={formData.days_allowed}
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
          name="conformation_steps"
          type="number"
          placeholder="Conformation Steps"
          value={formData.conformation_steps}
          onChange={handleChange}
        />
        <button className="admin-submit" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default LeaveModal;
