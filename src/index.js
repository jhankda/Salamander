import dotenv from 'dotenv'
import connectDB from './db/index.js';

import {app} from './app.js'

dotenv.config({
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`serevr is running at ${process.env.PORT || 8000}`)
    })
    
})
.catch((err) => {
    console.log("MongoDB connection failed :",err)
})
























/*
(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch(error){
        console.error('Error:', error)
        throw error
    }
})()
*/