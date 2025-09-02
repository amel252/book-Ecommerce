import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connex = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connecté: ${connex.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;
