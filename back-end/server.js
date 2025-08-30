import express from "express";
const port = 8080;

const app = express();
app.get("/", (req, res) => res.send("Excute"));

app.listen(port, () => {
    console.log(`L'éxcution du server sur le port ${port}`);
});
