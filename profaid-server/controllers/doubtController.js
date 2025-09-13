const Doubt = require("../models/Doubt");
const Student = require("../models/Student");
const Subject = require("../models/Subject")
const createDoubt = async (req, res) => {
  try {
    const { DoubtID, StudentID, Subject, Title, Description } = req.body;

    const filesAttached = req.files.map((file) => file.filename);

    const newDoubt = new Doubt({
      DoubtID,
      StudentID,
      Subject,
      Title,
      Description,
      FilesAttached: filesAttached,
      Replies: [],
      CreatedAt: Date.now(),  // Explicitly set CreatedAt
    });

    await newDoubt.save();

    res.status(201).json({ message: "Doubt saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentDoubts = async (req, res) => {
  try {
    const { studentID } = req.params;
    const doubts = await Doubt.find({ StudentID: studentID }).sort({ CreatedAt: -1 });
    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getBranchDoubts = async (req, res) => {
  try {
    const { branch, studentID } = req.params;

    const studentsInBranch = await Student.find({
      Branch: branch,
      StudentID: { $ne: studentID },
    }).select("StudentID");

    const studentIDs = studentsInBranch.map((student) => student.StudentID);

    const doubts = await Doubt.find({
      StudentID: { $in: studentIDs },
    }).sort({ CreatedAt: -1 });


    res.json(doubts);
  } catch (err) {
    console.error("Error in getBranchDoubts:", err);
    res.status(500).json({ message: err.message });
  }
};
const getDoubtByID = async (req, res) => {
  try {
    const { doubtID } = req.params;

    const doubt = await Doubt.findOne({ DoubtID: doubtID });

    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    res.json(doubt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const clarifyDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const doubt = await Doubt.findOne({ DoubtID: doubtID });

    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.Status = "Clarified";
    await doubt.save();

    res.json({ message: "Doubt marked as Clarified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const extendDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const { Message, SenderID } = req.body;
    const filesAttached = (req.files || []).map((file) => file.filename);

    if (!Message || !SenderID) {
      return res.status(400).json({ message: "Message and SenderID are required" });
    }

    const doubt = await Doubt.findOne({ DoubtID: doubtID });
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.Status === "Clarified") return res.status(400).json({ message: "Cannot reply to a clarified doubt" });

    const newReply = {
      SenderID,
      Message,
      FilesAttached : filesAttached,
    };

    doubt.Replies.push(newReply);

    doubt.Status = SenderID.startsWith("P") ? "Replied" : "Open";

    await doubt.save();

    res.json(doubt);
  } catch (err) {
    console.error("ExtendDoubt Error:", err);
    res.status(500).json({ message: err.message });
  }
};


const getUnclarifiedDoubts = async (req, res) => {
  try {
    const subjects = req.query.subjects?.split(",") || [];

    if (subjects.length === 0) {
      return res.status(400).json({ message: "Subjects query param is required" });
    }
    const subjectDocs = await Subject.find({ SubjectID: { $in: subjects } }).select("SubjectName");
    const subjectNames = subjectDocs.map((sub) => sub.SubjectName);
    const doubts = await Doubt.find({
      Subject: { $in: subjectNames },
      Status: { $ne: "Clarified" }, // Get only unclarified doubts
    });

    return res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllUnclarifiedDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({
      Status: { $ne: "Clarified" }, // Only unclarified doubts
    });

    return res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const replyToDoubt = async (req, res) => {
  try {
    const { doubtID } = req.params;
    const { Message, SenderID } = req.body;
    const filesAttached = (req.files || []).map((file) => file.filename);

    if (!Message || !SenderID) {
      return res.status(400).json({ message: "Message and SenderID are required" });
    }

    const doubt = await Doubt.findOne({ DoubtID: doubtID });
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.Status === "Clarified") return res.status(400).json({ message: "Cannot reply to a clarified doubt" });

    const newReply = {
      SenderID,
      Message,
      FilesAttached : filesAttached,
    };

    doubt.Replies.push(newReply);

    // Set status to "Replied"
    doubt.Status = "Replied";

    await doubt.save();

    res.json(doubt);
  } catch (err) {
    console.error("ReplyToDoubt Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createDoubt, getStudentDoubts, getBranchDoubts, getDoubtByID,clarifyDoubt,extendDoubt,replyToDoubt,getUnclarifiedDoubts,getAllUnclarifiedDoubts };
