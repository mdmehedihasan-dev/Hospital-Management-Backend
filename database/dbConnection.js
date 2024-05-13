import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:'HOSPITAL_MANAGEMENT'
    }).then(()=>{
        console.log('Connected to MongoDB database👍')
    }).catch(err=>{
        console.log(`Something went wrong ${err}`)
    })
}