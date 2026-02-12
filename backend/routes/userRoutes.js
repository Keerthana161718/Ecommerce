const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id", protect, admin, updateUserRole);

module.exports = router;