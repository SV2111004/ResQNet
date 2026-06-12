const Mission = require("../models/Mission");

const createMission = async (req, res) => {
  try {
    const { emergencyId, responderId } = req.body;

    const mission = await Mission.create({
      emergency: emergencyId,

      responder: responderId,
    });

    res.status(201).json(mission);
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
    }).populate("emergency", "emergencyType description priorityScore status");

    res.json(missions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptMission = async (
  req,
  res
) => {
  try {

    const mission =
      await Mission.findById(
        req.params.id
      );

    if (!mission) {
      return res.status(404).json({
        message:
          "Mission not found",
      });
    }

    mission.status =
      "accepted";

    await mission.save();

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
};
