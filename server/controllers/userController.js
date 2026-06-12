const User = require("../models/User");

const getResponders = async (req, res) => {
  try {
    const responders = await User.find({
      role: "responder",
    });

    res.json(responders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getResponders,
};
