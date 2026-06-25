const Shelter = require("../models/Shelter");

const haversineDistance = require("../utils/haversine");

const recommendShelter = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const shelters = await Shelter.find({
      status: "active",
    });

    const availableShelters = shelters
      .filter(
        (shelter) =>
          shelter.capacity >
          shelter.currentOccupancy
      )
      .map((shelter) => {
        const distance =
          haversineDistance(
            lat,
            lng,
            shelter.location.lat,
            shelter.location.lng
          );

        return {
          ...shelter.toObject(),

          distance,

          availableBeds:
            shelter.capacity -
            shelter.currentOccupancy,
        };
      })
      .sort(
        (a, b) =>
          a.distance - b.distance
      );

    if (availableShelters.length === 0) {
      return res.status(404).json({
        message: "No shelters available",
      });
    }

    res.json(availableShelters[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  recommendShelter,
};