const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    SubjectID: { type: String, required: true, unique: true },
    SubjectName: { type: String, required: true },
    Department: { type: String, required: true }
});

module.exports = mongoose.model("Subject", subjectSchema);
