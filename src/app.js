import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


// import bodyParser from 'body-parser'

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use(cors(
    {origin: process.env.CORS_ORIGIN,
    credentials: true
    }))



app.use(express.json({limit:"16mb"}))
app.use(express.urlencoded({extended:true ,limit:"16mb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
// import SRouter from './routes/subtoggler.routes.js'
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subtogglerRouter from './routes/subtoggler.routes.js'
import commentRouter from './routes/comment.routes.js'





//routes declaration
app.use("/api/v1/videos" , videoRouter)
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/subtoggler" , subtogglerRouter)
app.use("/api/v1/comments" , commentRouter)





export { app }