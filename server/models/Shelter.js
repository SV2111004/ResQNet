const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
  {
    name: String,

    location: {
      lat: Number,
      lng: Number,
    },

    capacity: Number,

    currentOccupancy: {
      type: Number,
      default: 0,
    },

    foodAvailable: {
      type: Boolean,
      default: true,
    },

    waterAvailable: {
      type: Boolean,
      default: true,
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
    "Shelter",
    shelterSchema
  );