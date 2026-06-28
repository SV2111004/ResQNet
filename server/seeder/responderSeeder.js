const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

require("dotenv").config();

const createResponders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(
      "responder123",
      10
    );

    await User.deleteMany({
      role: "responder",
    });

    await User.insertMany([
      {
        name: "Responder One",
        email: "responder1@resqnet.com",
        password: hashedPassword,
        role: "responder",

        isAvailable: true,

        location: {
          lat: 28.6289,
          lng: 77.3649,
        },
      },

      {
        name: "Responder Two",
        email: "responder2@resqnet.com",
        password: hashedPassword,
        role: "responder",

        isAvailable: true,

        location: {
          lat: 28.5706,
          lng: 77.3272,
        },
      },

      {
        name: "Responder Three",
        email: "responder3@resqnet.com",
        password: hashedPassword,
        role: "responder",

        isAvailable: true,

        location: {
          lat: 28.4677,
          lng: 77.5030,
        },
      },
    ]);

    console.log("3 Responders Created");

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

createResponders();