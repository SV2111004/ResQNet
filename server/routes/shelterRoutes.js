const express = require("express");

const router = express.Router();

const {
  recommendShelter,
} = require("../controllers/shelterController");

router.post(
  "/recommend",
  recommendShelter
);

module.exports = router;