import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchID, setSearchID] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]); // store multiple results
  const navigate = useNavigate();
  // 🔹 Search by ID
  const handleSearchByID = async () => {
    if (!searchID.trim()) return alert("Please enter an ID");
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/search/id?ID=${searchID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSearchResults([data]); // single result
      } else {
        setSearchResults([]);
        alert(data.message);
      }
    } catch (err) {
      console.error("Search by ID Error:", err);
    }
  };

  // 🔹 Search by Name
  const handleSearchByName = async () => {
    if (!searchName.trim()) return alert("Please enter a name");
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admins/search/name?name=${searchName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSearchResults([...data.students, ...data.professors]); // multiple results
      } else {
        setSearchResults([]);
        alert(data.message);
      }
    } catch (err) {
      console.error("Search by Name Error:", err);
    }
  };

  // 🔹 Fetch unclarified doubts
  useEffect(() => {
    const fetchUnclarifiedDoubts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doubts/unclarified-all");
        const data = await res.json();
        if (res.ok) {
          setUnclarifiedDoubts(data);
        } else {
          console.error("Error fetching unclarified doubts:", data.message);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnclarifiedDoubts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <AdminNavbar />

      <div style={{ margin: "20px" }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={() => navigate("/manage-professors")}
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Manage Professors
        </button>
        {/* Search Section */}
        <div style={{ marginBottom: "30px" }}>
          {/* Search by ID */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Enter Student or Professor ID"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              style={{ padding: "10px", width: "300px", marginRight: "10px" }}
            />
            <button onClick={handleSearchByID} style={{ padding: "10px" }}>
              Search by ID
            </button>
          </div>

          {/* Search by Name */}
          <div>
            <input
              type="text"
              placeholder="Enter Name (partial, case-insensitive)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ padding: "10px", width: "300px", marginRight: "10px" }}
            />
            <button onClick={handleSearchByName} style={{ padding: "10px" }}>
              Search by Name
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Half: Search Results */}
          <div style={{ flex: 1 }}>
            <h3>Search Results</h3>
            {searchResults.length === 0 ? (
              <p>No results to display.</p>
            ) : (
              searchResults.map((person, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <p>
                    <strong>Type:</strong>{" "}
                    {person.Type || (person.StudentID ? "Student" : "Professor")}
                  </p>
                  <p>
                    <strong>ID:</strong> {person.ID || person.StudentID || person.ProfessorID}
                  </p>
                  <p>
                    <strong>Name:</strong> {person.Name}
                  </p>
                  <p>
                    <strong>Email:</strong> {person.Email}
                  </p>
                  {person.Branch && <p><strong>Branch:</strong> {person.Branch}</p>}
                  {person.Department && <p><strong>Department:</strong> {person.Department}</p>}
                  {person.PhoneNumber && <p><strong>Phone Number:</strong> {person.PhoneNumber}</p>}
                  <p>
                    <strong>Password:</strong> {person.Password}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Right Half: Unclarified Doubts */}
          <div style={{ flex: 1 }}>
            <h3>Unclarified Doubts</h3>
            {unclarifiedDoubts.length === 0 ? (
              <p>No unclarified doubts found.</p>
            ) : (
              unclarifiedDoubts.map((doubt, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <h4>{doubt.Title}</h4>
                  <p>
                    <strong>Description:</strong> {doubt.Description}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {doubt.StudentID}
                  </p>
                  <p>
                    <strong>Subject:</strong> {doubt.Subject}
                  </p>
                  <p>
                    <strong>Status:</strong> {doubt.Status}
                  </p>
                  {doubt.FilesAttached?.length > 0 && (
                    <div>
                      <h5>Files:</h5>
                      {doubt.FilesAttached.map((file, fileIdx) => (
                        <div key={fileIdx}>
                          <a
                            href={`http://localhost:5000/uploads/${file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FaFileAlt /> {file}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
