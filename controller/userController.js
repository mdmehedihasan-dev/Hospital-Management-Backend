import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from 'cloudinary'

// patient register functionality
export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nid, dob, gender, password } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nid ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("All filed are required🥴", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered😒", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nid,
    dob,
    gender,
    password,
    role: "Patient",
  });
  generateToken(user, "User Successfully registered ✌️", 200, res);

  // res.status(200).json({
  //     sucess:true,
  //     message:"User Successfully registered"
  // })
});

// user login functionality

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please fill all required fields🥴", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("password and confirmPassword not match", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler("User not found this role", 400));
  }
  //   res.status(200).json({
  //     sucess: true,
  //     message: "User successfully login",
  //   });
  generateToken(user, "User Successfully login✌️", 200, res);
});

//add new  admin functionality

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nid, dob, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nid ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler("All fields are required🥴", 400));
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} email is already registered`, 400)
    );
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    nid,
    dob,
    gender,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "New Admin successfully registered.✌️",
  });
});

// get allDoctors functionality

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

// get user Details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// admin log out functionality
export const adminLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None"
    })
    .json({
      success: true,
      message: "Admin Log Out Successfully👋",
    });
});

//patient  log out functionality
export const patientLogout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite:"None",
      secure:true
    })
    .json({
      success: true,
      message: "Patient Log Out Successfully👋",
    });
});

// add newDoctor functionality
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Photo is required📸", 400));
  }

  const { docPhoto } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(docPhoto.mimetype)) {
    return next(new ErrorHandler("Image format is not allowed", 400));
  }

  const {firstName,lastName,email,phone,nid,dob,gender,password,doctorDepartment} = req.body;

  if (!firstName ||!lastName ||!email ||!phone ||!nid ||!dob ||!gender ||!password ||!doctorDepartment ||!docPhoto
  ){
    return next(new ErrorHandler("all fields are required😒", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} is already registered`, 400)
    );
  }

  const cloudinaryResponse  = await cloudinary.uploader.upload(
    docPhoto.tempFilePath
  );

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error(
      'Cloudinary Error:',
      cloudinaryResponse.error || 'Unknown cloudinary error'
    )
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nid,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docPhoto: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success:true,
    message:"New Doctor successfully added🧑‍⚕️",
    doctor
  })
  
});
