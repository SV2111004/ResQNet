const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    title: String,

    message: String,

    severity: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "critical",
      ],
    },

    city: {
      type: String,
      default: "Guwahati",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Alert",
    alertSchema
  );