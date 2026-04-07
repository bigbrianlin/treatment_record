require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD;

const { User } = require("../models");
const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Brian",
  "Mia",
  "Ben",
  "Amy",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Lin",
  "Chen",
  "Wang",
  "Wu",
  "Liu",
  "Lee",
  "Taylor",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generatePhoneNumber = () => {
  let num = "09";
  for (let i = 0; i < 8; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const generatedUsernames = new Set();
    let usersCreated = 0;

    while (usersCreated < 20) {
      const firstname = getRandomItem(firstNames);
      const lastname = getRandomItem(lastNames);

      const username = `${firstname.toLowerCase()}${lastname.toLowerCase()}`;

      // Check if this username has already been generated in this run to avoid duplicate key errors
      if (generatedUsernames.has(username)) {
        continue;
      }

      generatedUsernames.add(username);

      const email = `${username}@gmail.com`;
      const phoneNumber = generatePhoneNumber();
      const role = "therapist";

      const newUser = new User({
        username,
        firstname,
        lastname,
        email,
        phoneNumber,
        role,
        password: DEFAULT_PASSWORD,
        isActive: true,
        mustChangePassword: true,
      });

      await newUser.save();
      console.log(`Created user ${usersCreated + 1}: ${username} (${role})`);

      usersCreated++;
    }
    console.log("Successfully seeded 20 users!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
