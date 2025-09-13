import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    ID: "",
    Name: "",
    Email: "",
    Branch: "",
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const ID = localStorage.getItem("ID") || "";
    const Name = localStorage.getItem("Name") || "";
    const Email = localStorage.getItem("Email") || "";
    const Branch = localStorage.getItem("Branch") || "";

    setStudent({ ID, Name, Email, Branch });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
      <h2>ProfAid</h2>

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
              background: "red",
              color: "black",
              border: "1px solid #ccc",
              padding: "10px",
              minWidth: "220px",
              zIndex: 1000,
              borderRadius: "6px",
            }}
          >
            <p><strong>ID:</strong> {student.ID}</p>
            <p><strong>Name:</strong> {student.Name}</p>
            <p><strong>Email:</strong> {student.Email}</p>
            <p><strong>Branch:</strong> {student.Branch}</p>
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

export default StudentNavbar;
