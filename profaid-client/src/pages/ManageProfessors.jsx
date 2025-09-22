// ✅ Added comments where changes are made
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";
const ManageProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(null); // "add" or "edit"
  const [formData, setFormData] = useState({
    id: "",
    ProfessorID: "",
    Name: "",
    Email: "",
    Password: "",
    Department: "",
    Subjects: [], // ✅ always store SubjectIDs here
  });
  const [subjects, setSubjects] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  // Fetch departments
  useEffect(() => {
    fetch("http://localhost:5000/api/admins/departments")
      .then((res) => res.json())
      .then(setDepartments)
      .catch(console.error);
  }, []);

  // Fetch professors (sorted by numeric part of ProfessorID)
  useEffect(() => {
    let url = "http://localhost:5000/api/admins/professors";
    if (department) url += `?department=${department}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const numA = parseInt(a.ProfessorID.replace(/\D/g, ""), 10);
          const numB = parseInt(b.ProfessorID.replace(/\D/g, ""), 10);
          return numA - numB;
        });
        setProfessors(sorted);
      })
      .catch(console.error);
  }, [department]);

  // ✅ Fetch subjects whenever Department changes
  useEffect(() => {
    if (formData.Department) {
      fetch(`http://localhost:5000/api/admins/subjects/belongsto/${formData.Department}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch subjects");
          return res.json();
        })
        .then((data) => setSubjects(data)) // returns full subject docs { SubjectID, Name }
        .catch((err) => {
          console.error(err);
          setSubjects([]);
        });
    }
  }, [formData.Department]);

  // Delete professor
  const handleDelete = async (prof) => {
    if (
      window.confirm(
        `Do you want to remove ${prof.Name} (${prof.ProfessorID}) ?`
      )
    ) {
      await fetch(`http://localhost:5000/api/admins/professors/${prof._id}`, {
        method: "DELETE",
      });
      setProfessors((prev) => prev.filter((p) => p._id !== prof._id));
    }
  };

  // Handle Add/Edit form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = showForm === "edit" ? "PUT" : "POST";
    const url =
      showForm === "edit"
        ? `http://localhost:5000/api/admins/professors/${formData.id}`
        : "http://localhost:5000/api/admins/professors";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), // ✅ sends SubjectIDs only
    });

    if (res.ok) {
      const updated = await res.json();
      if (showForm === "add") setProfessors((prev) => [...prev, updated]);
      else
        setProfessors((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
      setShowForm(null);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div style={{ margin: "20px" }}>
        <h2>Manage Professors</h2>

        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">-- All Departments --</option>
          {departments.map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setShowForm("add");
            // ✅ reset form data
            setFormData({
              id: "",
              ProfessorID: "",
              Name: "",
              Email: "",
              Password: "",
              Department: "",
              Subjects: [],
            });
          }}
        >
          Add Professor
        </button>

        {/* Professors Table */}
        <table border="1" width="100%" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {professors.map((prof) => (
              <tr key={prof._id}>
                <td>{prof.ProfessorID}</td>
                <td>{prof.Name}</td>
                <td>{prof.Department}</td>
                <td>
                  {/* ✅ display subject names from backend */}
                  {prof.SubjectNames && prof.SubjectNames.length > 0
                    ? prof.SubjectNames.join(", ")
                    : "No subjects"}
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowForm("edit");
                      // ✅ keep SubjectIDs when editing
                      setFormData({
                        id: prof._id,
                        ProfessorID: prof.ProfessorID || "",
                        Name: prof.Name || "",
                        Email: prof.Email || "",
                        Password: "",
                        Department: prof.Department || "",
                        Subjects: prof.Subjects || [],
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(prof)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form Section */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: "20px",
              border: "1px solid #ddd",
              padding: "20px",
            }}
          >
            <h3>{showForm === "edit" ? "Edit Professor" : "Add Professor"}</h3>
            <input
              type="text"
              placeholder="Professor ID"
              value={formData.ProfessorID}
              disabled={showForm === "edit"}
              onChange={(e) =>
                setFormData({ ...formData, ProfessorID: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.Name}
              disabled={showForm === "edit"}
              onChange={(e) =>
                setFormData({ ...formData, Name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.Email}
              disabled={showForm === "edit"}
              onChange={(e) =>
                setFormData({ ...formData, Email: e.target.value })
              }
            />
            {showForm === "add" && (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.Password}
                  onChange={(e) =>
                    setFormData({ ...formData, Password: e.target.value })
                  }
                  style={{ display: "block", width: "100%", paddingRight: "35px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}

            {/* Department selection */}
            <select
              value={formData.Department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Department: e.target.value,
                  Subjects: [],
                })
              }
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* ✅ Subject checkboxes */}
            <div>
              {subjects && subjects.length > 0 ? (
                subjects.map((sub) => (
                  <label key={sub.SubjectID} style={{ marginRight: "10px" }}>
                    <input
                      type="checkbox"
                      checked={formData.Subjects.includes(sub.SubjectID)}
                      onChange={(e) => {
                        let updatedSubjects = [...formData.Subjects];
                        if (e.target.checked)
                          updatedSubjects.push(sub.SubjectID);
                        else
                          updatedSubjects = updatedSubjects.filter(
                            (s) => s !== sub.SubjectID
                          );
                        setFormData({
                          ...formData,
                          Subjects: updatedSubjects,
                        });
                      }}
                    />
                    {sub.SubjectName}
                  </label>
                ))
              ) : (
                <p>No subjects available</p>
              )}
            </div>

            <button type="submit">Save</button>
            <button type="button" onClick={() => setShowForm(null)}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageProfessors;
