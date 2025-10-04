import express from "express";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { Doctor } from "../models/Doctor.js"; // adjust path
import { Patient } from '../models/Patient.js';
import { PatientAppn } from "../models/patientAppn.js";
import { Appointment } from "../models/Appointment.js";

const router = express.Router();
const scryptAsync = promisify(scrypt);

// 🔹 PUT route to create 4 dummy doctors
router.put("/doctors/dummy", async (req, res) => {
  try {
    const dummyDoctors = [
      {
        mobile: 9000000001,
        name: "Dr. Arjun Mehta",
        speciality: "Cardiologist",
        chambers: [
          {
            address: "Apollo Hospital, Kolkata",
            from: "10:00",
            to: "13:00",
            weekdays: ["Mon", "Wed", "Fri"],
            index: 0,
            timing: "10:00-13:00"
          }
        ]
      },
      {
        mobile: 9000000002,
        name: "Dr. Neha Sharma",
        speciality: "Dermatologist",
        chambers: [
          {
            address: "Skin Care Clinic, Delhi",
            from: "15:00",
            to: "18:00",
            weekdays: ["Tue", "Thu", "Sat"],
            index: 0,
            timing: "15:00-18:00"
          }
        ]
      },
      {
        mobile: 9000000003,
        name: "Dr. Rakesh Singh",
        speciality: "Orthopedic",
        chambers: [
          {
            address: "City Hospital, Mumbai",
            from: "09:30",
            to: "12:00",
            weekdays: ["Mon", "Tue", "Thu"],
            index: 0,
            timing: "09:30-12:00"
          },
          {
            address: "Ortho Plus Clinic, Mumbai",
            from: "17:00",
            to: "20:00",
            weekdays: ["Wed", "Fri"],
            index: 1,
            timing: "17:00-20:00"
          }
        ]
      },
      {
        mobile: 9000000004,
        name: "Dr. Kavita Rao",
        speciality: "Pediatrician",
        chambers: [
          {
            address: "Children’s Care, Bangalore",
            from: "10:00",
            to: "13:00",
            weekdays: ["Mon", "Wed", "Fri"],
            index: 0,
            timing: "10:00-13:00"
          },
          {
            address: "Mother & Child Clinic, Bangalore",
            from: "16:00",
            to: "19:00",
            weekdays: ["Tue", "Thu"],
            index: 1,
            timing: "16:00-19:00"
          }
        ]
      }
    ];

    // Hash passwords before saving
    for (let doctor of dummyDoctors) {
      let password = "password";
      const salt = randomBytes(8).toString("hex");
      const buf = await scryptAsync(password, salt, 64);
      doctor.password = `${buf.toString("hex")}.${salt}`;
      doctor.userRole = 1;
    }

    await Doctor.insertMany(dummyDoctors);

    res.status(201).json({ message: "4 dummy doctors created successfully" });
  } catch (error) {
    console.error("Error creating dummy doctors:", error);
    res.status(500).json({ message: "Error creating dummy doctors", error });
  }
});


router.put("/patients/dummy", async (req, res) => {
  try {
    const patients = [];

    for (let i = 0; i < 50; i++) {
      let mobile = 1234567890 + i;
      let password = "password";

      // Hash password
      const salt = randomBytes(8).toString("hex");
      const buf = await scryptAsync(password, salt, 64);
      password = `${buf.toString("hex")}.${salt}`;

      patients.push({
        mobile,
        password,
        userRole: 0
      });
    }

    await Patient.insertMany(patients);
    res.status(201).json({ message: "50 dummy patients created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating dummy patients", error });
  }
});


router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find({}, { _id: 1,mobile:1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const patients = await Doctor.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

router.get("/patientAppn", async (req, res) => {
  try {
    const patients = await PatientAppn.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});


router.put("/approveAllPatientAppn", async (req, res) => {
  try {
    // Update all documents
    const result = await PatientAppn.updateMany(
      {},                   // Empty filter → updates all documents
      { $set: { status: "Approved" } }  // Set status to Approved
    );

    res.status(200).json({
      message: "All patient appointments approved",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient appointments", error });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const patients = await Appointment.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
});

router.delete("/patients", async (req, res) => {
  try {
    const result = await Patient.deleteMany({});
    res.status(200).json({ 
      message: "All patient records deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patients", error });
  }
});

router.delete("/patientAppn", async (req, res) => {
  try {
    const result = await PatientAppn.deleteMany({});
    res.status(200).json({ 
      message: "All patient records deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patients", error });
  }
});


router.delete("/appointments", async (req, res) => {
  try {
    const result = await Appointment.deleteMany({});
    res.status(200).json({ 
      message: "All patient records deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting patients", error });
  }
});


// patients with ID and mobile
const patients = [
  { _id: "68deb9bd8bce88be153b18fe", mobile: 1234567890 },
  { _id: "68deb9bd8bce88be153b18ff", mobile: 1234567891 },
  { _id: "68deb9bd8bce88be153b1900", mobile: 1234567892 },
  { _id: "68deb9bd8bce88be153b1901", mobile: 1234567893 },
  { _id: "68deb9bd8bce88be153b1902", mobile: 1234567894 },
  { _id: "68deb9bd8bce88be153b1903", mobile: 1234567895 },
  { _id: "68deb9bd8bce88be153b1904", mobile: 1234567896 },
  { _id: "68deb9bd8bce88be153b1905", mobile: 1234567897 },
  { _id: "68deb9bd8bce88be153b1906", mobile: 1234567898 },
  { _id: "68deb9bd8bce88be153b1907", mobile: 1234567899 },
  { _id: "68deb9bd8bce88be153b1908", mobile: 1234567900 },
  { _id: "68deb9bd8bce88be153b1909", mobile: 1234567901 },
  { _id: "68deb9bd8bce88be153b190a", mobile: 1234567902 },
  { _id: "68deb9bd8bce88be153b190b", mobile: 1234567903 },
  { _id: "68deb9bd8bce88be153b190c", mobile: 1234567904 },
  { _id: "68deb9bd8bce88be153b190d", mobile: 1234567905 },
  { _id: "68deb9bd8bce88be153b190e", mobile: 1234567906 },
  { _id: "68deb9bd8bce88be153b190f", mobile: 1234567907 },
  { _id: "68deb9bd8bce88be153b1910", mobile: 1234567908 },
  { _id: "68deb9bd8bce88be153b1911", mobile: 1234567909 },
  { _id: "68deb9bd8bce88be153b1912", mobile: 1234567910 },
  { _id: "68deb9bd8bce88be153b1913", mobile: 1234567911 },
  { _id: "68deb9bd8bce88be153b1914", mobile: 1234567912 },
  { _id: "68deb9bd8bce88be153b1915", mobile: 1234567913 },
  { _id: "68deb9bd8bce88be153b1916", mobile: 1234567914 },
  { _id: "68deb9bd8bce88be153b1917", mobile: 1234567915 },
  { _id: "68deb9bd8bce88be153b1918", mobile: 1234567916 },
  { _id: "68deb9bd8bce88be153b1919", mobile: 1234567917 },
  { _id: "68deb9bd8bce88be153b191a", mobile: 1234567918 },
  { _id: "68deb9bd8bce88be153b191b", mobile: 1234567919 },
  { _id: "68deb9bd8bce88be153b191c", mobile: 1234567920 },
  { _id: "68deb9bd8bce88be153b191d", mobile: 1234567921 },
  { _id: "68deb9bd8bce88be153b191e", mobile: 1234567922 },
  { _id: "68deb9bd8bce88be153b191f", mobile: 1234567923 },
  { _id: "68deb9bd8bce88be153b1920", mobile: 1234567924 },
  { _id: "68deb9bd8bce88be153b1921", mobile: 1234567925 },
  { _id: "68deb9bd8bce88be153b1922", mobile: 1234567926 },
  { _id: "68deb9bd8bce88be153b1923", mobile: 1234567927 },
  { _id: "68deb9bd8bce88be153b1924", mobile: 1234567928 },
  { _id: "68deb9bd8bce88be153b1925", mobile: 1234567929 },
  { _id: "68deb9bd8bce88be153b1926", mobile: 1234567930 },
  { _id: "68deb9bd8bce88be153b1927", mobile: 1234567931 },
  { _id: "68deb9bd8bce88be153b1928", mobile: 1234567932 },
  { _id: "68deb9bd8bce88be153b1929", mobile: 1234567933 },
  { _id: "68deb9bd8bce88be153b192a", mobile: 1234567934 },
  { _id: "68deb9bd8bce88be153b192b", mobile: 1234567935 },
  { _id: "68deb9bd8bce88be153b192c", mobile: 1234567936 },
  { _id: "68deb9bd8bce88be153b192d", mobile: 1234567937 },
  { _id: "68deb9bd8bce88be153b192e", mobile: 1234567938 },
  { _id: "68deb9bd8bce88be153b192f", mobile: 1234567939 }
];

    const selectedDates = [
      new Date("2025-10-10"),
      new Date("2025-10-11"),
      new Date("2025-10-12"),
    ];

function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

router.post("/create-dummy-appointments-patientAppn", async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    const allAppointments = [];
    const allPatientAppns = [];

    for (let i = 0; i < 200; i++) {
      const doctor = doctors[i % doctors.length];
      const chamber = doctor.chambers[0]; // pick first chamber for simplicity

    const date = selectedDates[Math.floor(Math.random() * selectedDates.length)];



      const patient = patients[i % patients.length];

      // check existing appointment
      let appointment = await Appointment.findOne({
        doctorId: doctor._id,
        date,
        time: chamber.timing
      });

      if (!appointment) {
        appointment = new Appointment({
          doctorId: doctor._id,
          date,
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          time: chamber.timing,
          currentVisiting: 0,
          completed: 0,
          pending: 1,
          total: 1,
          trackVisited: [],
          appointments: [
            {
              name: `Patient ${i + 1}`,
              mobile: patient.mobile,
              patientId: patient._id,
              status: "pending",
              address: "Dummy Address " + (i + 1),
              number : 1
            }
          ]
        });
        await appointment.save();
      } else {
        appointment.appointments.push({
          name: `Patient ${i + 1}`,
          mobile: patient.mobile,
          patientId: patient._id,
          status: "pending",
          address: "Dummy Address " + (i + 1),
          number:appointment.total +1
        });
        appointment.pending += 1;
        appointment.total += 1;
        await appointment.save();
      }

      // Create PatientAppn
      const patientAppn = new PatientAppn({
        doctorName: doctor.name,
        timing: chamber.timing,
        date,
        number: appointment.total,
        mobile: patient.mobile,
        patientId: patient._id,
        doctorId: doctor._id,
        patientName: `Patient ${i + 1}`,
        appointmentId: appointment._id,
        chamberAddress: chamber,
        status: "Approved"
      });

      await patientAppn.save();
      allAppointments.push(appointment);
      allPatientAppns.push(patientAppn);
    }

    res.json({
      message: "Dummy appointments and patientAppns created successfully",
      appointments: allAppointments.length,
      patientAppns: allPatientAppns.length
    });
  } catch (err) {
    console.error("Error creating dummy data", err);
    res.status(500).json({ error: "Failed to create dummy appointments" });
  }
});


export { router as seedRouter };
