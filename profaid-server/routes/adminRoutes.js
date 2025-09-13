const express = require("express");
const { loginAdmin,changePassword,searchByID,searchByName } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/profile", protect, (req, res) => {
  if (req.role !== "Admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(req.user);
});
router.put("/change-password", protect, changePassword);
router.get("/search/id", searchByID);
router.get("/search/name", searchByName);
module.exports = router;
