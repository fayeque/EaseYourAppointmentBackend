import express from "express";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { PatientAppn } from "../models/patientAppn.js";

const router = express.Router();

/**
 * DELETE /api/cleanup
 * Wipes all collections (Appointment, Doctor, Patient, PatientAppn)
 */
router.delete("/api/cleanup", async (req, res) => {
  try {
    await Promise.all([
      Appointment.deleteMany({}),
    //   Doctor.deleteMany({}),
    //   Patient.deleteMany({}),
      PatientAppn.deleteMany({})
    ]);

    res.status(200).json({ message: "All collections cleaned successfully" });
  } catch (error) {
    console.error("Cleanup failed:", error);
    res.status(500).json({ error: "Failed to clean collections" });
  }
});

export { router as cleanupRouter };
