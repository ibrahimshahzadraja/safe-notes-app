import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
    try {
        let connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Mongo DB Connected!! Host Name: ", connectionInstance.connection.host)
    } catch (error) {
        console.error("Mongo DB Connection Failed ! ", error)
    }
}