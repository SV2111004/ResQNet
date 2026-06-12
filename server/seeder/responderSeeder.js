const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

require("dotenv").config();

const createResponder = async () => {

  await mongoose.connect(
    process.env.MONGO_URI
  );

  const hashedPassword =
    await bcrypt.hash(
      "responder123",
      10
    );

  await User.create({
    name: "Responder One",

    email:
      "responder@resqnet.com",

    password:
      hashedPassword,

    role: "responder",
  });

  console.log(
    "Responder Created"
  );

  process.exit();
};

createResponder();