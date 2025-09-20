import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // For toggling password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userID = localStorage.getItem("ID") || ""; // ID (StudentID or ProfessorID)
  const role = localStorage.getItem("role") || ""; // "Student" or "Professor"

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }

    const endpoint =
      role === "Professor"
        ? "http://localhost:5000/api/professors/change-password"
        : role === "Student"
        ? "http://localhost:5000/api/students/change-password"
        : "http://localhost:5000/api/admins/change-password";

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password changed successfully. Please log in again.");
        localStorage.clear();
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message || "Error changing password.");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#1976d2",
          color: "white",
        }}
      >
        <h2>ProfAid</h2>
        <span>
          <FaUserCircle size={28} color="white" /> {userID}
        </span>
      </nav>

      {/* Change Password Form */}
      <div
        style={{
          maxWidth: "500px",
          margin: "30px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#24ce5aff",
        }}
      >
        <h2>Change Password</h2>
        {message && <p style={{ color: "red" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <label>Old Password</label>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", paddingRight: "35px" }}
            />
            <span
              onClick={() => setShowOld(!showOld)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showOld ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* New Password */}
          <label>New Password</label>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", paddingRight: "35px" }}
            />
            <span
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <label>Confirm New Password</label>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", paddingRight: "35px" }}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            style={{
              background: "#1976d2",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
