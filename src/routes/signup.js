import express from "express";
import { body, validationResult } from "express-validator";
import { randomBytes,scrypt } from "crypto";
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
const scryptAsync = promisify(scrypt);
import {RequestValidationError} from "@fhannan/common";
import { DatabaseConnectionError } from "@fhannan/common";
import { BadRequestError } from "@fhannan/common";
import { validateRequest } from "@fhannan/common";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { PatientAppn } from '../models/patientAppn.js';

const router = express.Router();

var pcode="abcd";

router.post(
  "/api/users/patient/signup",
  [
    body("mobile").isLength({ min: 10, max: 15 }).withMessage("Mobile number must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req,res) => {
  
    try{
    console.log("Creating a user...");
    var {mobile,password} = req.body;
    var existingUser=await Patient.findOne({mobile:mobile});
    if(existingUser){
        throw new BadRequestError('Mobile number in use');
    }
    
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64));

    password=`${buf.toString('hex')}.${salt}`;

    var patient=await new Patient({
      mobile:mobile,
      password:password,
      userRole:0
    })

    await patient.save();

    // Link offline appointments
    await PatientAppn.updateMany(
      { mobile: patient.mobile, patientId: null },
      { $set: { patientId: patient._id } }
    );

    const userJwt = jwt.sign(
      {
        id: patient.id,
        mobile: patient.mobile,
        userRole:patient.userRole
      },
      "abcdefg"
    );

    // Store it on session object
    // req.session= {
    //   jwt: userJwt
    // };
    var fUser={
      id:patient._id,
      mobile:patient.mobile,
      userRole:patient.userRole,
      jwtToken:userJwt
    }
    res.status(201).send(JSON.stringify(fUser));
  }

catch(err){
  console.log("error in creating patient ", err);
}
  }
);


router.post(
  "/api/users/doctor/signup",
  [
    body("mobile").isLength({ min: 10, max: 15 }).withMessage("Mobile number must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("passcode").isLength({min:4,max:4})
  ],
  validateRequest,
  async (req,res) => {
    console.log("Creating a user...");
    var {mobile,password,passcode,name,chambers,speciality} = req.body;

    chambers.forEach((chamber) => {
        chamber.timing = `${chamber.from}-${chamber.to}`
    })

    console.log(typeof chambers);
    if(passcode != pcode){
      throw new BadRequestError('Passcode is not valid');
    }
    var existingUser=await Doctor.findOne({mobile:mobile});
    if(existingUser){
        throw new BadRequestError('Mobile number in use');
    }
    
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64));

    password=`${buf.toString('hex')}.${salt}`;

    var user=await new Doctor({
      mobile:mobile,
      name:name,
      password:password,
      userRole:1,
      speciality:speciality,
      chambers:chambers
    })
    console.log(user.chambers);
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user._id,
        mobile: user.mobile,
        name:user.name,
        userRole:user.userRole
      },
      "abcdefg"
    );

    // Store it on session object
    // req.session= {
    //   jwt: userJwt
    // };
    
    var fUser={
      id: user._id,
      mobile: user.mobile,
      name:user.name,
      userRole:user.userRole,
      jwtToken:userJwt
    }


    res.status(201).send(JSON.stringify(fUser));
  }
);

export { router as signupRouter };
