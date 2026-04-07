require("dotenv").config();
const mongoose = require("mongoose");

const { Patient } = require("../models");
const { User } = require("../models");
const { SoapNote } = require("../models");

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const therapist = await User.findOne({ username: "brianlin" });
    if (!therapist) {
      throw new Error("No therapists found! Please run seedUsers.js first.");
    }
    const patients = await Patient.find().limit(3);
    if (patients.length < 3) {
      throw new Error("Not enough patients found (need at least 3)! Please run seedPatients.js first.");
    }

    const disabilityCategories = [
      "Developmental Delay",
      "Autism Spectrum Disorder",
      "Attention Deficit Hyperactivity Disorder",
    ];

    const dummySOAP = {
      subjective:
        "Parent reported that the child's emotions were relatively stable at home this week, but there was still some resistance during activity transitions. Sleep and appetite are normal.",
      objective:
        "Conducted fine motor training in the therapy room today. During the activity of using tweezers to pick up beans, attention was maintained for about 10 minutes. Able to follow two-step instructions, but requires visual prompts.",
      assessment:
        "The child showed slight improvement in hand-eye coordination and fine motor control, but tolerance for frustration remains low. Overall cooperation is good, responds well to structured activities.",
      plan: "Next week, we will continue to strengthen fine motor skills (using scissors) and incorporate more social interaction games that involve taking turns and waiting. It is recommended that parents provide simple household chores at home to continue the training.",
    };

    let totalNotesCreated = 0;

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const category = disabilityCategories[i];

      let treatmentDate = new Date();
      treatmentDate.setDate(treatmentDate.getDate() - 7 * 10);

      console.log(
        `\nStarting to create records for patient ${patient.firstname} (MRN: ${patient.medicalRecordNumber})...`
      );

      for (let sessionCount = 1; sessionCount <= 10; sessionCount++) {
        const newNote = new SoapNote({
          patient: patient._id,
          therapist: therapist._id,
          disabilityCategory: category,
          treatmentDate: new Date(treatmentDate),
          sessionCount: sessionCount,
          subjective: dummySOAP.subjective,
          objective: dummySOAP.objective,
          assessment: dummySOAP.assessment,
          plan: dummySOAP.plan,
        });

        await newNote.save();
        totalNotesCreated++;

        // Advance the date by 7 days for the next session
        treatmentDate.setDate(treatmentDate.getDate() + 7);
      }
      console.log(`Finished 10 SOAP Notes for ${patient.firstname}!`);
    }

    console.log(`\nAll done! Created a total of ${totalNotesCreated} SOAP Notes!`);
    console.log(`Assigned Therapist: ${therapist.firstname} ${therapist.lastname}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
