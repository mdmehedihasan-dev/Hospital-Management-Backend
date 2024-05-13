import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";

// send message 
export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    return next (new ErrorHandler('Please Fill All Fields',400))
    
  }
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({ success: true, message: "message send successfully" });
});

// get all message 
export const getAllMessage = catchAsyncErrors(async(req,res,next)=>{
  const messages = await Message.find()
  res.status(200).json({
    success:true,
    messages
  })
})
