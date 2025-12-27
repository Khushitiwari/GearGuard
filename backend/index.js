import express from "express";
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import teamRouter from "./routes/team.route.js";
import equipmentRouter from "./routes/equipement.route.js";
import requestRouter from "./routes/request.route.js";


connectDB()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "*", credentials: true }))

app.get('/', (req, res) => {
    res.send("Api Working")
})

app.use('/api/users', userRouter)
app.use('/api/team', teamRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/request', requestRouter)

app.listen(port, () => {
    console.log("Serving on port: " + port);
})