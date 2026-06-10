const express = require("express");

const router = express.Router();

const {
  createEmergency,
  getEmergencies,
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

module.exports = router;