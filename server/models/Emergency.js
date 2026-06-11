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
      enum: ["flood", "fire", "medical", "accident", "general"],
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Emergency", emergencySchema);
