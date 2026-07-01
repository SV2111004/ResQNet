const Emergency = require("../models/Emergency");
const Shelter = require("../models/Shelter");
const getNearestLocation = require("../utils/nearestLocation");

const createEmergency = async (req, res) => {
  try {
    const { emergencyType, description, lat, lng, severity, affectedPeople } =
      req.body;

    const priorityScore = severity * 5 + affectedPeople * 3;
    const nearestLocation = getNearestLocation(lat, lng);

    const emergency = await Emergency.create({
      citizen: req.user._id,

      emergencyType,

      description,

      location: {
        lat,
        lng,
      },
      locationNode: nearestLocation.id,
      severity,
      affectedPeople,
      priorityScore,
    });

    const io = req.app.get("io");
    io.emit("newEmergency", emergency);

    res.status(201).json(emergency);
  } catch (error) {
    console.log("CREATE EMERGENCY ERROR:");
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
const getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find()
      .populate("assignedResponder", "name isAvailable")
      .populate("assignedShelter")
      .sort({
        priorityScore: -1,
      });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ citizen: req.user._id })
      .populate("assignedResponder", "name isAvailable")
      .populate("assignedShelter")
      .sort({
        createdAt: -1,
      });

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getEmergencyStats = async (req, res) => {
  try {
    const active = await Emergency.countDocuments({
      status: {
        $in: ["pending", "assigned", "in_progress"],
      },
    });

    const pending = await Emergency.countDocuments({
      status: "pending",
    });

    const inProgress = await Emergency.countDocuments({
      status: "in_progress",
    });

    const completed = await Emergency.countDocuments({
      status: "completed",
    });

    res.json({
      active,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const assignShelter = async (req, res) => {
  try {
    const { id } = req.params;

    const { shelterId } = req.body;

    const emergency = await Emergency.findById(id);

    if (!emergency) {
      return res.status(404).json({
        message: "Emergency not found",
      });
    }

    const shelter = await Shelter.findById(shelterId);

    if (!shelter) {
      return res.status(404).json({
        message: "Shelter not found",
      });
    }

    const availableBeds = shelter.capacity - shelter.currentOccupancy;

    if (availableBeds < emergency.affectedPeople) {
      return res.status(400).json({
        message: "Not enough shelter capacity",
      });
    }

    emergency.assignedShelter = shelter._id;

    shelter.currentOccupancy += emergency.affectedPeople;

    await emergency.save();

    await shelter.save();

    res.json({
      message: "Shelter assigned successfully",
      emergency,
      shelter,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createEmergency,
  getEmergencies,
  getMyEmergencies,
  getEmergencyStats,
  assignShelter,
};