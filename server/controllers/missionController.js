const Mission = require("../models/Mission");
const Emergency = require("../models/Emergency");
const User = require("../models/User");
const haversineDistance = require("../utils/haversine");

const createMission = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    const emergency = await Emergency.findById(emergencyId);

    const responders = await User.find({
      role: "responder",
      isAvailable: true,
    });

    if (responders.length === 0) {
      return res.status(404).json({
        message: "No responder available",
      });
    }

    let nearestResponder = responders[0];
    let shortestDistance = Infinity;

    for (const responder of responders) {
      const distance = haversineDistance(
        emergency.location.lat,
        emergency.location.lng,
        responder.location.lat,
        responder.location.lng,
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestResponder = responder;
      }
    }
    const mission = await Mission.create({
      emergency: emergencyId,
      responder: nearestResponder._id,
    });
    await Emergency.findByIdAndUpdate(emergencyId, {
      assignedResponder: nearestResponder._id,

      status: "assigned",
    });
    nearestResponder.isAvailable = false;

    await nearestResponder.save();
    const populatedMission = await Mission.findById(mission._id).populate(
      "emergency",
    );

    const io = req.app.get("io");

    io.emit("newMission", populatedMission);

    res.status(201).json({
      mission,
      responder: {
        name: nearestResponder.name,
        email: nearestResponder.email,
      },
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyMissions = async (req, res) => {
  try {
    const missions = await Mission.find({
      responder: req.user._id,
    }).populate(
      "emergency",
      "emergencyType description priorityScore status severity affectedPeople emergencyType location assignedShelter",
    );

    res.json(missions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    mission.status = "accepted";
    await mission.save();
    const emergency = await Emergency.findById(mission.emergency);

    emergency.status = "in_progress";

    await emergency.save();

    res.json(mission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const completeMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    mission.status = "completed";

    await mission.save();

    const emergency = await Emergency.findById(mission.emergency);

    emergency.status = "completed";

    await emergency.save();

    const responder = await User.findById(mission.responder);

    responder.isAvailable = true;

    await responder.save();

    res.json(mission);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createMission,
  getMyMissions,
  acceptMission,
  completeMission,
};
