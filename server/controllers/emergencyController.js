const Emergency = require("../models/Emergency");

const createEmergency = async (req, res) => {
  try {
    const { emergencyType, description, lat, lng, severity, affectedPeople } =
      req.body;

    const priorityScore = severity * 5 + affectedPeople * 3;

    const emergency = await Emergency.create({
      citizen: req.user._id,

      emergencyType,

      description,

      location: {
        lat,
        lng,
      },
      severity,
      affectedPeople,
      priorityScore,
    });

 

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
   const getEmergencies = async (req, res) => {
      try {
        const emergencies = await Emergency.find().sort({
          priorityScore: -1,
        });

        res.json(emergencies);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    };

module.exports = {
  createEmergency,
  getEmergencies,
};
