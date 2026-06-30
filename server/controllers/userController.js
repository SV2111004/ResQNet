const User = require("../models/User");
const Mission = require("../models/Mission");

const getResponders = async (req, res) => {
  try {
    const responders = await User.find({
      role: "responder",
    });

    const data = await Promise.all(
      responders.map(async (responder) => {
        const mission = await Mission.findOne({
          responder: responder._id,
          status: {
            $in: ["assigned", "accepted"],
          },
        }).populate("emergency", "emergencyType");

        return {
          ...responder.toObject(),

          currentMission: mission
            ? mission.emergency.emergencyType
            : null,

          missionStatus: mission
            ? mission.status
            : null,
        };
      }),
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getResponders,
};
