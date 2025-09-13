import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const [unclarifiedDoubts, setUnclarifiedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchID, setSearchID] = useState("");
  const [searchName, setSearchName] = useState("");

  const handleSearchByID = async () => {
  if (!searchID.trim()) return alert("Please enter an ID");
  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch(`http://localhost:5000/api/admins/search/id?ID=${searchID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      let message = `Type: ${data.Type}\nID: ${data.ID}\nName: ${data.Name}\nEmail: ${data.Email}\nPassword: ${data.Password}\n`;

      if (data.Type === "Student") {
        message += `Branch: ${data.Branch}\n`;
      } else if (data.Type === "Professor") {
        message += `Department: ${data.Department}\nPhone Number: ${data.PhoneNumber}\n`;
      }

      alert(message);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Search by ID Error:", err);
  }
};


  const handleSearchByName = async () => {
    if (!searchName.trim()) return alert("Please enter a name");
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`http://localhost:5000/api/admins/search/name?name=${searchName}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      const data = await res.json();

      if (res.ok) {
        let message = "";

        data.students.forEach((student) => {
          message += `Student:\nID: ${student.StudentID}\nName: ${student.Name}\nEmail: ${student.Email}\nBranch: ${student.Branch}\nPassword: ${student.Password}\n\n`;
        });

        data.professors.forEach((professor) => {
          message += `Professor:\nID: ${professor.ProfessorID}\nName: ${professor.Name}\nEmail: ${professor.Email}\nPhone: ${professor.PhoneNumber}\nPassword: ${professor.Password}\n\n`;
        });

        if (!message) message = "No matches found.";

        alert(message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Search by Name Error:", err);
    }
  };

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

        {/* Search by ID */}
        <div style={{ marginBottom: "20px" }}>
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
        <div style={{ marginBottom: "40px" }}>
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

        {/* Unclarified Doubts */}
        <h1>Unclarified Doubts</h1>

        {unclarifiedDoubts.length === 0 ? (
          <p>No unclarified doubts found.</p>
        ) : (
          unclarifiedDoubts.map((doubt, idx) => (
            <div key={idx} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}>
              <h3>{doubt.Title}</h3>
              <p><strong>Description:</strong> {doubt.Description}</p>
              <p><strong>Student ID:</strong> {doubt.StudentID}</p>
              <p><strong>Subject:</strong> {doubt.Subject}</p>
              <p><strong>Status:</strong> {doubt.Status}</p>
              {doubt.FilesAttached?.length > 0 && (
                <div>
                  <h4>Files:</h4>
                  {doubt.FilesAttached.map((file, fileIdx) => (
                    <div key={fileIdx}>
                      <a href={`http://localhost:5000/uploads/${file}`} target="_blank" rel="noreferrer">
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
  );
};

export default AdminDashboard;
