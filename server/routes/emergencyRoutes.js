const express = require("express");

const router = express.Router();

const {
  createEmergency,
  getEmergencies,
  getMyEmergencies,
  getEmergencyStats,
  assignShelter,
} = require(
  "../controllers/emergencyController"
);

const {
  protect,
  authorize,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createEmergency
);
router.get(
  "/",
  protect,
  authorize("admin"),
  getEmergencies
);

router.get(
  "/mine",
  protect,
  getMyEmergencies
);

router.get(
  "/stats",
  protect,
  authorize("admin"),
  getEmergencyStats
);

router.put(
  "/:id/assign-shelter",
  protect,
  authorize("responder"),
  assignShelter
);

module.exports = router;