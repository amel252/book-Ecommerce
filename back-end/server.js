// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import connectDB from "./config/db.js";
// import productRoutes from "./routes/productRoutes.js";

// const app = express();
// const port = process.env.PORT || 8081;
// connectDB();

// // routes
// app.use("/api/products", productRoutes);

// app.get("/", (req, res) => res.send("Excute"));

// app.listen(port, () => {
//     console.log(`L'éxcution du server sur le port ${port}`);
// });
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
const app = express();

const port = process.env.PORT || 8081;
connectDB();

// routes
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.send("Execute"));

app.listen(port, () => {
    console.log(`L'execution du server sur le port ${port}`);
});
