const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/develop/db");
const { swaggerDocument, swaggerHtml } = require("./docs/develop/swagger");
const authRoutes = require("./routes/develop/authRoutes");
const todoRoutes = require("./routes/develop/todoRoute");

dotenv.config();
connectDB();// connect database

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api-docs.json", (req, res) => {
    res.json(swaggerDocument);
});

app.get("/api-docs", (req, res) => {
    res.type("html").send(swaggerHtml);
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
