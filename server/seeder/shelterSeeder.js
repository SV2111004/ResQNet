const dotenv = require("dotenv");

const connectDB = require("../config/db");

const Shelter = require("../models/Shelter");

const demoShelters = require("../data/demoShelters");

dotenv.config();

connectDB();

const seedShelters = async () => {
  try {
    await Shelter.deleteMany();

    await Shelter.insertMany(demoShelters);

    console.log("Shelters Seeded");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

seedShelters();