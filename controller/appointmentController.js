import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

// send appointment
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nid,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nid ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("All fields are required🥴"));
  }

  const isConfilict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConfilict.length === 0) {
    return next(new ErrorHandler("Doctor not Found", 404));
  }

  if (isConfilict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone",
        400
      )
    );
  }

  const doctorId = isConfilict[0]._id;
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nid,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    message: "Appointment Send Successfully",
    appointment,
  });
});

// get all appointment 

export const getAllAppointment = catchAsyncErrors(async(req,res,next)=>{
    const appointments = await Appointment.find()
    res.status(200).json({
        success:true,
        appointments
    })
})

// appointment update 
export const appointmentUpdate = catchAsyncErrors(async(req,res,next)=>{
  const {id} = req.params

  let appointment = await Appointment.findById(id)

  if(!appointment){
    return next(new ErrorHandler("Appointment not found",400))
  }

  appointment = await Appointment.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  })
  res.status(200).json({
    success:true,
    message:"Appoinment updated successfully",
    appointment
  })
})

// appointment delete 
export const appointmentDelete = catchAsyncErrors(async(req,res,next)=>{
  const {id} = req.params
  let appointment = await Appointment.findById(id)
  if(!appointment){
    return next(new ErrorHandler("Appointment not Found",400))
  } 
  await appointment.deleteOne()
  res.status(200).json({
    success:true,
    message:"Appointment deleted👋"
  })
}) 

