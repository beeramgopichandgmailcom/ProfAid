import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    ID: "",
    Name: "",
    Email: "",
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";

    setAdmin({ ID, Name, Email });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

  return (
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
      <h2>ProfAid Admin</h2>

      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => setShowProfileDropdown((prev) => !prev)}
      >
        <FaUserCircle size={28} color="white" />

        {showProfileDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "white",
              color: "black",
              border: "1px solid #ccc",
              padding: "10px",
              minWidth: "220px",
              zIndex: 1000,
              borderRadius: "6px",
            }}
          >
            <p><strong>ID:</strong> {admin.ID}</p>
            <p><strong>Name:</strong> {admin.Name}</p>
            <p><strong>Email:</strong> {admin.Email}</p>
            <hr />
            <button
              onClick={() => navigate("/change-password")}
              style={{
                display: "block",
                width: "100%",
                margin: "5px 0",
                padding: "6px",
              }}
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                margin: "5px 0",
                padding: "6px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
