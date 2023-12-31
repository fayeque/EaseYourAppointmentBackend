import { BadRequestError,requireDoctorAuth,requirePatientAuth,NotFoundError,currentUser} from '@fhannan/common';
import express from 'express';
import { Appointment } from '../models/Appointment.js';
import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor.js';
import { PatientAppn } from '../models/patientAppn.js';
const router=express.Router();




router.post("/api/appointment/:doctorId",requirePatientAuth,async (req,res) => {

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

    var appn = await Appointment.findOne({doctorId:req.params.doctorId,date:date,time:time}).populate('doctorId');
    if(!appn){
        var isValid=false;
       var chamber;
        var doctor=await Doctor.findOne({_id:req.params.doctorId});
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
            doctorId:req.params.doctorId,
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
            patientId:req.currentUser?.id,
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
            patientId:req.currentUser?.id,
            patientName:name,
            appointmentId:appn._id,
            chamberAddress: appn.chamber
        });
        const patientAppointment=await patientAppn.save();
        console.log("patient appointment created",patientAppointment);
   
}




res.status(201).send("Appointment created successfully");

});

router.get("/api/appointment",async (req,res) => {
    var appointments=await Appointment.find({});

    res.send(appointments);
});

router.get("/api/appointment/doctor",requireDoctorAuth,async (req,res) => {
    var isoDate = new Date().toISOString()
    console.log("current user in appointment/doctor ",req.currentUser);
    var appointments=await Appointment.find({doctorId:req.currentUser?.id,date:{$gte:isoDate}}).select({appointments:0}).sort({date:1}).limit(2);
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



export {router as appointmentRouter};
