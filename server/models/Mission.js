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
    navigationStarted: {
      type: Boolean,
      default: false,
    },

    reachedSite: {
      type: Boolean,
      default: false,
    },
    routeDistance: {
  type: Number,
  default: 0,
},

routeETA: {
  type: Number,
  default: 0,
},

routePath: {
  type: [String],
  default: [],
},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Mission", missionSchema);
