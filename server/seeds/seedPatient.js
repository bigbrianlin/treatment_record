require("dotenv").config();
const mongoose = require("mongoose");

const { Patient } = require("../models");

const MONGODB_URI = process.env.MONGODB_URI;

const firstNames = [
  "Lucas",
  "Lily",
  "Oliver",
  "Chloe",
  "Ethan",
  "Emma",
  "Noah",
  "Ava",
  "Liam",
  "Mia",
  "Mason",
  "Sophia",
  "Logan",
  "Isabella",
  "James",
  "Amelia",
  "Benjamin",
  "Harper",
  "Elijah",
  "Evelyn",
  "Leo",
  "Aria",
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
  "Lin",
  "Chen",
  "Wang",
  "Wu",
  "Liu",
  "Lee",
  "Huang",
  "Chang",
  "Tsai",
  "Yang",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generatePhoneNumber = () => {
  let num = "09";
  for (let i = 0; i < 8; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
};

const generateChildBirthDate = () => {
  const today = new Date();
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(today.getFullYear() - 10);

  return new Date(tenYearsAgo.getTime() + Math.random() * (today.getTime() - tenYearsAgo.getTime()));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    let patientsCreated = 0;

    while (patientsCreated < 30) {
      const firstname = getRandomItem(firstNames);
      const lastname = getRandomItem(lastNames);
      const email = `${firstname.toLowerCase()}${lastname.toLowerCase()}@gmail.com`;
      const gender = Math.random() > 0.5 ? "male" : "female";

      const newPatient = new Patient({
        firstname,
        lastname,
        birthDate: generateChildBirthDate(),
        gender,
        phone: generatePhoneNumber(),
        email,
        isActive: true,
      });

      const savedPatient = await newPatient.save();

      console.log(
        `Created Patient ${patientsCreated + 1}: ${firstname} ${lastname} (MRN: ${
          savedPatient.medicalRecordNumber
        }, Age: ${savedPatient.age})`
      );

      patientsCreated++;
    }

    console.log("Successfully seeded 30 child patients!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
