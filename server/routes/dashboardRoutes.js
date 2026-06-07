const express = require("express");

const router = express.Router();

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/citizen",
  protect,
  authorize("citizen"),
  (req, res) => {
    res.json({
      message: "Citizen Dashboard",
    });
  }
);

router.get(
  "/responder",
  protect,
  authorize("responder"),
  (req, res) => {
    res.json({
      message: "Responder Dashboard",
    });
  }
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin Dashboard",
    });
  }
);

module.exports = router;