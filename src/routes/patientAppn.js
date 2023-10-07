import express from 'express';
import { PatientAppn } from '../models/patientAppn.js';
import { requirePatientAuth } from '@fhannan/common';
const router = express.Router();


router.get("/api/patientappn/appointments",requirePatientAuth,async (req,res) => {
    var patientAppn = await PatientAppn.find({patientId:req.currentUser?.id}).sort({date:-1});
    console.log(patientAppn);
    res.status(200).send(patientAppn);

});



export { router as patientAppnRouter };
