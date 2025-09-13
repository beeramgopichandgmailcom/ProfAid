const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const generateToken = require("../utils/generateToken");

const loginAdmin = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const admin = await Admin.findOne({ Email });

    if (admin && Password == admin.Password) {
      res.json({
        _id: admin._id,
        AdminID: admin.AdminID,
        AdminName: admin.AdminName,
        Email: admin.Email,
        token: generateToken(admin._id, "Admin"),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check old password
    if (admin.Password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    admin.Password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchByID = async (req, res) => {
  try {
    const { ID } = req.query;

    const student = await Student.findOne({ StudentID: ID });
    if (student) {
      return res.status(200).json({
        Type: "Student",
        ID: student.StudentID,
        Name: student.Name,
        Email: student.Email,
        Branch: student.Branch,
        Password: student.Password,
      });
    }

    const professor = await Professor.findOne({ ProfessorID: ID });
    if (professor) {
      return res.status(200).json({
        Type: "Professor",
        ID: professor.ProfessorID,
        Name: professor.Name,
        Email: professor.Email,
        Department:professor.Department,
        PhoneNumber: professor.PhoneNumber,
        Password: professor.Password,
      });
    }

    return res.status(404).json({ message: "No student or professor found with this ID" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, "i");

    const students = await Student.find({ Name: { $regex: regex } }).select("-StudentID Name Email Branch Password");
    const professors = await Professor.find({ Name: { $regex: regex } }).select("-ProfessorID Name Email Department PhoneNumber Password");

    res.status(200).json({ students, professors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginAdmin, changePassword,searchByID, searchByName };
