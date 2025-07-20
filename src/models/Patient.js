import mongoose from 'mongoose';

const patientSchema=new mongoose.Schema({
    mobile : {
        type: Number,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      userRole:{
        type:Number
      }
});


const Patient = mongoose.model('Patient', patientSchema);
export {Patient};