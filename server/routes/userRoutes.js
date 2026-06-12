const express = require("express");

const router = express.Router();

const { getResponders } = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/responders", protect, authorize("admin"), getResponders);

module.exports = router;
