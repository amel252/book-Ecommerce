import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // on va vider la BD avant de commencer
        await Product.deleteMany();
        await User.deleteMany();
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProduct = products.map((product) => {
            return { ...product, user: adminUser };
        });
        await Product.insertMany(sampleProduct);
        console.log("Les données sont importés");
        process.exit;
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
};
// tu ne peut pas envoyé les donnée plusieurs fois , on detruit
const destroyData = async () => {
    try {
        await Product.deleteMany;
        await User.deleteMany;
        console.log("les données sont détruites");
        process.exit();
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
};
// pose la question chatgpt
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}
