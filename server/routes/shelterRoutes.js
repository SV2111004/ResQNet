const express = require("express");

const router = express.Router();

const {
  recommendShelter,
  getShelters,
  updateOccupancy,
} = require("../controllers/shelterController");

router.get(
  "/",
  getShelters
);

router.post(
  "/recommend",
  recommendShelter
);

router.put(
  "/:id/occupancy",
  updateOccupancy
);

module.exports = router;