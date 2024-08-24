import { connectDb } from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDb()
.then(() => {
    app.on("error", (error) => {
        console.log("Express app failed! ", error);
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is listening on port: ", process.env.PORT || 8000);
    })
})
.catch(error => console.log("Mongo DB Connection Failed! ", error))