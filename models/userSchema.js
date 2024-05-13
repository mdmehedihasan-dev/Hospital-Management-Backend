import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'First Name is required'],
        minLength:[3,'First name Must Contain At least 3 Characters']
    },
    lastName:{
        type:String,
        required:[true,'Last Name is required'],
        minLength:[3,'Last name Must Contain At least 3 Characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        validate:[validator.isEmail,'Please provide a valid Email']
    },
    phone:{
        type:String,
        required:[true,'phone is required'],
        minLength:[11,'Phone number must contain 11 Digits'],
        maxLength:[11,'Phone number must contain 11 Digits']
    },
    nid:{
        type:String,
        required:[true,'NID is required'],
        minLength:[9,'NID Must contain Only 9 Digits'],
        maxLength:[9,'NID Must contain Only 9 Digits'],
    },
    dob:{
        type:Date,
        required:[true,'Date is required'],
    },
    gender:{
        type:String,
        required:[true,'Gender is required'],
        enum:['male','female']
    },
    password:{
        type:String,
        minLength:[6,'Password must be at Least 6 characters'],
        required:true, 
        select:false,
    },
    role:{
        type:String,
        required:[true,'Role is required'],
        enum:['Admin','Doctor','Patient']
    },
    doctorDepartment:{
        type:String
    },
    docPhoto: {
        public_id: String,
        url: String,
      },
});

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.generateJsonWebToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_ESPIRES
    })
}

export const User = mongoose.model("User",userSchema)