const express = require("express");

const router = express.Router();

const {
  createMission,
  getMyMissions,
  acceptMission,
  completeMission,
   startNavigation,
  reachSite,
} = require("../controllers/missionController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin"), createMission);

router.get("/my", protect, authorize("responder"), getMyMissions);

router.put("/:id/accept", protect, authorize("responder"), acceptMission);

router.put("/:id/complete", protect, authorize("responder"), completeMission);

router.put(
  "/:id/start-navigation",
  protect,
  authorize("responder"),
  startNavigation,
);

router.put("/:id/reach-site", protect, authorize("responder"), reachSite);

module.exports = router;
