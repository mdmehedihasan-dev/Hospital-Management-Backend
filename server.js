import app from "./app.js";
import cloudniary from 'cloudinary'


cloudniary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,

})


app.get('/',(req,res)=>{
    res.send("welcome to the Hospatal management server")
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.PORT}`)
})