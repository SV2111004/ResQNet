const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    emergency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emergency",
    },

    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["assigned", "accepted", "completed"],
      default: "assigned",
    },
   
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Mission", missionSchema);
