import express from "express";
import productRoutes from "./routes/productRoutes.js";

const port = 8080;

// routes
app.use("/api/products", productRoutes);

const app = express();
app.get("/", (req, res) => res.send("Excute"));

app.listen(port, () => {
    console.log(`L'éxcution du server sur le port ${port}`);
});
