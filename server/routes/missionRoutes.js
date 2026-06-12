const express = require("express");

const router = express.Router();

const {
  createMission,
  getMyMissions,
  acceptMission,
} = require("../controllers/missionController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), createMission);

router.get("/my", protect, authorize("responder"), getMyMissions);

router.put("/:id/accept", protect, authorize("responder"), acceptMission);

module.exports = router;
