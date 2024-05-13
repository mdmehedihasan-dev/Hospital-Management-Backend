import mongoose from "mongoose";
import validator from "validator";
import { Mongoose } from "mongoose";


const appointmentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First Name Is Required!"],
      minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name Is Required!"],
      minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required!"],
      minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
      maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },
    nid: {
      type: String,
      required: [true, "NID Is Required!"],
      minLength: [9, "NID Must Contain Only 13 Digits!😒"],
      maxLength: [9, "NID Must Contain Only 13 Digits!😒"],
    },
    dob: {
      type: Date,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["male", "female"],
    },
    appointment_date: {
      type: String,
      required: [true, "Appointment Date Is Required!"],
    },
    department: {
      type: String,
      required: [true, "Department Name Is Required!"],
    },
    doctor: {
      firstName: {
        type: String,
        required: [true, "Doctor Name Is Required!"],
      },
      lastName: {
        type: String,
        required: [true, "Doctor Name Is Required!"],
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Address Is Required!"],
    },

    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:[true,"Doctor Id is Required!"]
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:[true,"patient Id is Required!"]
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
        
    }
})

export const Appointment = mongoose.model("Appointment",appointmentSchema)