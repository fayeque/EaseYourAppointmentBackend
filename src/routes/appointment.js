import { BadRequestError,requireDoctorAuth,requirePatientAuth,NotFoundError,currentUser} from '@fhannan/common';
import express from 'express';
import { Appointment } from '../models/Appointment.js';
import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor.js';
import { PatientAppn } from '../models/patientAppn.js';
const router=express.Router();



router.post("/api/patient-appointment/:doctorId", requirePatientAuth, async (req, res) => {
  const { name, address, mobile, date, time } = req.body;

  try{

        const patientId = req.currentUser?.userRole === 0 ? req.currentUser?.id : null;
        var isValid=false;
        var chamber;
        var doctor=await Doctor.findOne({_id:req.params.doctorId});
        console.log("doctor got here is ",doctor);
        const day = date.split(" ")[0];
    
        doctor.chambers.forEach((c) => {
            console.log("c.timing here is " , c.timing);
            console.log("c.weekdays here is " , c.weekdays);
            if(c.timing == time && c.weekdays.includes(day)){
                
                isValid=true;
                chamber=c;
            }
        });
        console.log("doctor got here is valid  ",isValid);
        if(!isValid){
            throw new BadRequestError("Doctor not found");
        }

  // just create patient appointment request (no Appointment entry yet)
        const patientAppnm =new PatientAppn({
            doctorName:doctor.name,
            timing:time,
            date:date,
            // number:appointment.appointments.length,
            patientId:patientId,
            patientName:name,
            mobile:mobile,
            doctorId:doctor._id,
            // appointmentId:appointment._id,
            chamberAddress: chamber,
            status:'Pending'
        });

  await patientAppnm.save();
  res.status(201).send("Appointment created successfully");
 }catch (error) {
    console.error("Error creating patient appointment:", error);
    res.status(500).json({ error: "Something went wrong while creating appointment" });
  } 
});



router.post("/api/patient-appointment/:id/approve",requireDoctorAuth,async (req,res) => {
    
    try{
    const patientAppn = await PatientAppn.findById(req.params.id);
    if (!patientAppn) {
    throw new BadRequestError("Patient appointment not found");
    }

    if (patientAppn.status !== "Pending") {
    throw new BadRequestError("Appointment already processed");
    }

    const { date, timing, patientName, mobile, patientId,chamberAddress } = patientAppn;

    const day = new Date(date).toLocaleString('en-US', { weekday: 'short' });

    const doctorId = req.currentUser?.id;


    var appn = await Appointment.findOne({doctorId:doctorId,date:date,time:timing});
    console.log("appn find at time of approval ", appn);
    if(!appn){
        var appointments=[
            {
                name:patientName,
                // address:address,
                mobile:mobile,
                patientId:patientId,
                status:'pending',
                number : 1
            }
        ];
        var appointment = new Appointment({
            doctorId:doctorId,
            chamber:chamberAddress,
            date:date,
            day:day,
            time:timing,
            trackVisited:[],
            appointments:appointments
        });

        var appnSaved=await appointment.save();


        patientAppn.status = 'Approved';
        patientAppn.appointmentId = appnSaved._id;
        patientAppn.number = 1;
        const savedAppn=await patientAppn.save();
        console.log("saved appn is " ,savedAppn);

    }else{
        var a={
            name:patientName,
            mobile:mobile,
            // address:address,
            patientId:patientId,
            number: appn.total + 1,
            status:"pending"
        }
        console.log("coming here in else " ,a);
        appn.appointments.push(a);
        appn.pending += 1;
        appn.total += 1;
        
        const savedAppn=await appn.save();
        console.log("saved appn is " ,savedAppn);
       

        patientAppn.status = 'Approved';
        patientAppn.appointmentId = savedAppn._id;
        patientAppn.number = appn.total;
        const savedPatAppn=await patientAppn.save();
        console.log("saved appn is " ,savedPatAppn);
   
}




res.status(201).send("Appointment Approved and Created successfully");
    }catch (error) {
    console.error("Error creating patient appointment:", error);
    res.status(500).json({ error: "Something went wrong while creating appointment" });
  } 

});


router.post("/api/patient-appointment/:id/reject", requireDoctorAuth,async (req, res) => {
  const patientAppn = await PatientAppn.findById(req.params.id);
  if (!patientAppn) {
    throw new BadRequestError("Patient appointment not found");
  }


  if (patientAppn.status !== 'Pending') {
    throw new BadRequestError("Appointment already processed");
  }

  patientAppn.status = "Rejected";
  await patientAppn.save();

  res.send({ message: "Appointment rejected", patientAppn });
});


router.get("/api/doctor/appointments/pending", requireDoctorAuth, async (req, res) => {
  try {
    const doctorId = req.currentUser?.id;
    console.log("doctorId ", doctorId)
    const pendingAppointments = await PatientAppn.find({
      status: "Pending",
      doctorId: doctorId,   // <-- make sure doctorId exists in PatientAppn schema
    }).sort({ date: 1, timing: 1 });
    console.log("pendingAppointment here is ", pendingAppointments);
    res.status(200).send(pendingAppointments);
  } catch (err) {
    console.error("Error fetching pending appointments", err);
    res.status(500).send({ error: "Server error" });
  }
});


router.get("/api/doctor/allPendingAppn", async (req, res) => {
  try {

    const pendingAppointments = await PatientAppn.find({})
  .sort({ date: 1, timing: 1 });
    console.log("pendingAppointment here is ", pendingAppointments);
    res.status(200).send(pendingAppointments);
  } catch (err) {
    console.error("Error fetching pending appointments", err);
    res.status(500).send({ error: "Server error" });
  }
});


router.get("/api/doctor/allAppointments", async (req, res) => {
  try {

    const appointments = await Appointment.find({})
  .sort({ date: 1, timing: 1 });
    // console.log("pendingAppointment here is ", appointments);
    res.status(200).send(appointments);
  } catch (err) {
    console.error("Error fetching pending appointments", err);
    res.status(500).send({ error: "Server error" });
  }
});


router.get("/api/appointment",async (req,res) => {
    var appointments=await Appointment.find({});

    res.send(appointments);
});

router.get("/api/appointment/doctor",requireDoctorAuth,async (req,res) => {
    var isoDate = new Date().toISOString()
    console.log("current user in appointment/doctor ",req.currentUser);
    var appointments=await Appointment.find({doctorId:req.currentUser?.id,date:{$gte:isoDate}}).select({appointments:0}).sort({date:1});
    console.log("Appointments here is  ",appointments);
    res.status(201).send(appointments);

});

router.get("/api/appointment/doctor/history",requireDoctorAuth,async (req,res) => {
    console.log("current user in appointment/doctor/history ",req.currentUser);
    var appointments=await Appointment.find({doctorId:req.currentUser?.id}).select({appointments:0}).sort({"date":-1,"time":1});
    res.status(201).send(appointments);
});


router.get("/api/appointment/doctor/:appointmentId",requireDoctorAuth,async (req,res) => {
    try{
    const a=await Appointment.findById(req.params.appointmentId);
    res.status(201).send(a);
}catch(err){
    console.log(err);
}
});


router.get("/api/appointment/patient/:appointmentId",requirePatientAuth,async (req,res) => {
    try{
    const a=await Appointment.findById(req.params.appointmentId);
    res.status(201).send(a);
    }catch(err){
    console.log(err);
}
});


router.get("/api/appointment/invisit/:appointmentId/:uniqueId",requireDoctorAuth,async (req,res) => {
    try{
        var a=await Appointment.findById(req.params.appointmentId);
        for(var i=0;i<a.appointments.length;i++){
            if(a.appointments[i]._id==req.params.uniqueId){
                a.appointments[i].status = 'invisit';
                a.currentVisiting = i+1;
                break;
            }
        }

        await a.save();
        res.status(201).send(a);
    }catch(err){    
        console.log(err);
    }
})





router.get("/api/appointment/completed/:appointmentId/:uniqueId",requireDoctorAuth,async (req,res) => {
    try{
        var a=await Appointment.findById(req.params.appointmentId);
        for(var i=0;i<a.appointments.length;i++){
            if(a.appointments[i]._id==req.params.uniqueId){
                a.appointments[i].status = 'completed';
                a.currentVisiting = -1;
                a.trackVisited.push(i+1);
                a.completed = a.completed + 1;
                a.pending = a.pending - 1;
                break;
            }
        }

        await a.save();
        res.status(201).send(a);
    }catch(err){    
        console.log(err);
    }
})


router.get("/api/appointment/rejected/:appointmentId/:uniqueId",requireDoctorAuth,async (req,res) => {
    try{
        var a=await Appointment.findById(req.params.appointmentId);
        for(var i=0;i<a.appointments.length;i++){
            if(a.appointments[i]._id==req.params.uniqueId){
                a.appointments[i].status = 'rejected';
                a.completed = a.completed + 1;
                a.pending = a.pending - 1;
                break;
            }
        }

        await a.save();
        res.status(201).send(a);
    }catch(err){    
        console.log(err);
    }
})

router.get("/api/appointment/undo/:appointmentId/:uniqueId",requireDoctorAuth,async (req,res) => {
    try{
        var a=await Appointment.findById(req.params.appointmentId);
        console.log("Here in undo server route",a);
        for(var i=0;i<a.appointments.length;i++){
            if(a.appointments[i]._id==req.params.uniqueId){
                if(a.appointments[i].status == 'rejected'){
                    a.appointments[i].status = 'pending';
                    a.completed = a.completed - 1;
                    a.pending = a.pending + 1;
                }else if(a.appointments[i].status == 'invisit'){
                    a.appointments[i].status = 'pending';
                    a.currentVisiting = -1;
                }else{
                    a.appointments[i].status='pending';
                    a.trackVisited.pop();
                    a.completed -=1;
                    a.pending +=1;
                }
                break;
            }
        }
        await a.save();
        res.status(201).send(a);
    }catch(err){    
        console.log(err);
    }
})


router.post("/api/doctor-appointment/",requireDoctorAuth,async (req,res) => {

    try{
    const {name,address,mobile,date,time}=req.body;
    console.log("date here is ",new Date(date));
    console.log("data present is ", new Date());
    var presentTime=new Date();
    var bookingTime=new Date(date);
    console.log("present Time",presentTime);
    console.log("booking Time",bookingTime);
    //modification needed -----important

    // if(bookingTime < presentTime){
    //     throw new BadRequestError("Booking time is not valid")
    // }

    var day=date.split(" ")[0];

    console.log("day here is ", day);
    console.log("time here is ", time);


    // var patientAppointment = {};
    const doctorId = req.currentUser?.id;

    var appn = await Appointment.findOne({doctorId:doctorId,date:date,time:time}).populate('doctorId');
    if(!appn){
        var isValid=false;
       var chamber;
        var doctor=await Doctor.findOne({_id:doctorId});
        console.log("doctor got here is ",doctor);
    
        doctor.chambers.forEach((c) => {
            console.log("c.timing here is " , c.timing);
            console.log("c.weekdays here is " , c.weekdays);
            if(c.timing == time && c.weekdays.includes(day)){
                
                isValid=true;
                chamber=c;
            }
        });
        console.log("doctor got here is valid  ",isValid);
        if(!isValid){
            throw new BadRequestError("Doctor not found");
        }
        var appointments=[
            {
                name:name,
                address:address,
                mobile:mobile,
                patientId:req.currentUser.id,
                status:'pending'
            }
        ];
        var appointment = new Appointment({
            doctorId:doctorId,
            chamber:chamber,
            date:date,
            day:day,
            time:time,
            trackVisited:[],
            appointments:appointments
        });

        await appointment.save();

        const patientAppnm =new PatientAppn({
            doctorName:doctor.name,
            timing:time,
            date:appointment.date,
            number:appointment.appointments.length,
            // patientId:req.currentUser?.id,
            status:'Approved',
            mobile:mobile,
            doctorId:doctorId,
            patientName:name,
            appointmentId:appointment._id,
            chamberAddress: chamber
        });

        const patientAppointment=await patientAppnm.save();

    }else{
        var a={
            name:name,
            mobile:mobile,
            address:address,
            patientId:req.currentUser.id,
            status:"pending"
        }
        console.log("coming here in else " ,a);
        appn.appointments.push(a);
        appn.pending += 1;
        appn.total += 1;
        
        const savedAppn=await appn.save();
        console.log("saved appn is " ,savedAppn);
       
        const patientAppn = new PatientAppn({
            doctorName:appn.doctorId.name,
            timing:time,
            date:appn.date,
            number:appn.appointments.length,
            // patientId:req.currentUser?.id,
            mobile:mobile,
            doctorId:doctorId,
            status:'Approved',
            patientName:name,
            appointmentId:appn._id,
            chamberAddress: appn.chamber
        });
        const patientAppointment=await patientAppn.save();
        console.log("patient appointment created",patientAppointment);
   
}




res.status(201).send("Appointment created successfully");
    }  catch (err) {
    console.error("Error fetching pending appointments", err);
    res.status(500).send({ error: "Server error" });
  }

});





export {router as appointmentRouter};
