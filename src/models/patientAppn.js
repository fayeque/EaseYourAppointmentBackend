import mongoose from 'mongoose';

const patientAppnSchema=new mongoose.Schema({
    doctorName:String,
    timing:String,
    date:Date,
    number:Number,
    mobile:Number,
    patientId:mongoose.Types.ObjectId,
    doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",   // <-- Reference to Doctor model
    required: true,
    },
    patientName:String,
    appointmentId:mongoose.Types.ObjectId,
    chamberAddress:{},
    status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
},{
    timestamps:true
});


const PatientAppn = mongoose.model('PatientAppn', patientAppnSchema);
export {PatientAppn};