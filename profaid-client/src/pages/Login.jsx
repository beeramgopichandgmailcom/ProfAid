import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // external CSS

const Login = () => {
  const [role, setRole] = useState(""); // Student / Professor / Admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/${role.toLowerCase()}s/login`,
        { Email: email, Password: password }
      );

      // Save auth data in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("role", role);

      // Save common info
      localStorage.setItem("ID", data.StudentID || data.ProfessorID || data.AdminID);
      localStorage.setItem("Name", data.Name || data.AdminName);
      localStorage.setItem("Email", data.Email);
      localStorage.setItem("Password", password); // ⚠️ Storing password is not secure in practice

      // Save branch if available (only for Student / Professor)
      if (data.Branch) localStorage.setItem("Branch", data.Branch);
      if (data.Department) localStorage.setItem("Department",data.Department);
      // Redirect based on role
      if (role === "Student") navigate("/student-dashboard");
      else if (role === "Professor") navigate("/professor-dashboard");
      else if (role === "Admin") navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to ProfAid</h2>

      {/* Role Selection */}
      <div className="role-buttons">
        <button
          className={role === "Student" ? "active" : ""}
          onClick={() => setRole("Student")}
        >
          Student
        </button>
        <button
          className={role === "Professor" ? "active" : ""}
          onClick={() => setRole("Professor")}
        >
          Professor
        </button>
        <button
          className={role === "Admin" ? "active" : ""}
          onClick={() => setRole("Admin")}
        >
          Admin
        </button>
      </div>

      {/* Login Form */}
      {role && (
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login as {role}</button>
        </form>
      )}
    </div>
  );
};

export default Login;
