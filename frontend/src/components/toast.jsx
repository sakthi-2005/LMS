import React, { useEffect } from "react";
import "../App.css";

export const Toast = ({ message, color, visible, onHide }) => {
  useEffect(() => {
    if (visible) {
      console.log("hi");
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <div
      className={`toast ${visible ? "show" : "hide"}`}
      style={{ backgroundColor: color }}
    >
      {message}
    </div>
  );
};
