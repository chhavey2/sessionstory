import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routes from "./src/routes/routes.js";
import { swaggerDocs } from "./src/swagger.js";
import { errorMiddleWare } from "./src/middleware/error.middleWare.js";
import requestIp from "request-ip";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
  }),
);

app.use(express.json({ limit: "5000mb" }));
app.use(requestIp.mw());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/", routes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is healthy" });
});


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


app.use(errorMiddleWare);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    swaggerDocs(app, PORT);
  });
});
