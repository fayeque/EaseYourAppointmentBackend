import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { randomBytes,scrypt } from "crypto";
import { promisify } from 'util';
const scryptAsync = promisify(scrypt);

import { validateRequest } from '@fhannan/common';
import { BadRequestError } from '@fhannan/common';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';

const router = express.Router();

router.get("/",(req,res) => {
  console.log("User found")
  res.send("Hii user");
})

router.post(
  '/api/users/patient/signin',
  [
    body('mobile')
      .isLength({ min: 10, max: 15 })
      .withMessage('Mobile number must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req, res) => {
    const { mobile, password } = req.body;
    console.log("coming in patient signin routes");
    const existingUser = await Patient.findOne({ mobile });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const [hashedPassword, salt] = existingUser.password.split('.');
    const buf = (await scryptAsync(password, salt, 64));
    var passwordsMatch;
    if(buf.toString('hex') === hashedPassword){
        passwordsMatch=true;
    }else{
        passwordsMatch=false;
    }

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        mobile: existingUser.mobile,
        userRole:existingUser.userRole
      },
      'abcdefg'
    );

    // req.session = {
    //   jwt: userJwt
    // };
    // Store it on session object
    var fUser={
        id:existingUser._id,
        mobile:existingUser.mobile,
        userRole:existingUser.userRole,
        jwtToken:userJwt
    }

    console.log("fuser in signin " , fUser);
    return res.status(200).send(JSON.stringify(fUser));
  }
);


router.post(
  '/api/users/doctor/signin',
  [
    body('mobile')
      .isLength({ min: 10, max: 15 })
      .withMessage('Mobile number must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req, res) => {
    const { mobile, password } = req.body;

    const existingUser = await Doctor.findOne({ mobile });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const [hashedPassword, salt] = existingUser.password.split('.');
    const buf = (await scryptAsync(password, salt, 64));
    var passwordsMatch;
    if(buf.toString('hex') === hashedPassword){
        passwordsMatch=true;
    }else{
        passwordsMatch=false;
    }

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        mobile: existingUser.mobile,
        userRole:existingUser.userRole
      },
      'abcdefg'
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    var fUser={
        id:existingUser._id,
        mobile:existingUser.mobile,
        userRole:existingUser.userRole,
        jwtToken:userJwt
    }
    res.status(200).send(JSON.stringify(fUser));
  }
);






export { router as signinRouter };
