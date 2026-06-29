const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emergencyType: {
      type: String,
      enum: [
        "flood",
        "earthquake",
        "landslide",
        "cyclone",
        "wildfire",
        "medical",
        "accident",
        "fire",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    locationNode: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      default: "Unknown",
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
      default: "pending",
    },
    affectedPeople: {
      type: Number,
      default: 1,
    },

    severity: {
      type: Number,
      default: 1,
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    assignedResponder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedShelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Emergency", emergencySchema);
