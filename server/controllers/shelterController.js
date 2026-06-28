const Shelter = require("../models/Shelter");

const haversineDistance = require("../utils/haversine");

const recommendShelter = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const shelters = await Shelter.find({
      status: "active",
    });

    const availableShelters = shelters
      .filter((shelter) => shelter.capacity > shelter.currentOccupancy)
      .map((shelter) => {
        const distance = haversineDistance(
          lat,
          lng,
          shelter.location.lat,
          shelter.location.lng,
        );

        return {
          ...shelter.toObject(),

          distance,

          availableBeds: shelter.capacity - shelter.currentOccupancy,
        };
      })
      .sort((a, b) => a.distance - b.distance);

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

const getShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find().sort({
      name: 1,
    });

    res.json(shelters);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateOccupancy = async (req, res) => {
  try {
    const { id } = req.params;

    const { people } = req.body;

    const shelter = await Shelter.findById(id);

    if (!shelter) {
      return res.status(404).json({
        message: "Shelter not found",
      });
    }

    if (shelter.currentOccupancy + people > shelter.capacity) {
      return res.status(400).json({
        message: "Shelter capacity exceeded",
      });
    }
    
    shelter.currentOccupancy += people;

    await shelter.save();

    res.json(shelter);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  recommendShelter,
  getShelters,
  updateOccupancy,
};
