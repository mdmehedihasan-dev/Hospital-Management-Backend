import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,'First name Must Contain At least 3 Characters']
    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,'Last name Must Contain At least 3 Characters']
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,'Please provide a valid Email']
    },
    phone:{
        type:'String',
        required:true,
        minLength:[11,'Phone number must contain 11 Digits'],
        maxLength:[11,'Phone number must contain 11 Digits']
    },
    message:{
        type:String,
        required:true,
        minLength:[10,'message must contain 10 characters']
    }
})

export const Message = mongoose.model("Message",messageSchema)