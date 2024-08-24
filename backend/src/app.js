import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.route.js";
import noteRouter from "./routes/note.route.js"
import favoriteRouter from "./routes/favorite.route.js"


//routes declaration
app.get('/', (req, res) => {
    res.send("Hello")
})
app.use('/api/v1/users', userRouter)
app.use('/api/v1/notes', noteRouter)
app.use('/api/v1/favorites', favoriteRouter)

export {app}