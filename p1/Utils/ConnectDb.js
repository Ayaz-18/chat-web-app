import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("p1/.env") });
const connect = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Database Connected Successfully 🚀");
    } catch (error) {
        console.log("Database connection failed", error);
    }
};

export { connect };