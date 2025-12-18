const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getUsers, // <--- Import mới
  deleteUser, // <--- Import mới
  updateUserProfile,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, admin, getUsers); // Admin xem danh sách

router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// Route xóa user theo ID
router.route("/:id").delete(protect, admin, deleteUser);

module.exports = router;
