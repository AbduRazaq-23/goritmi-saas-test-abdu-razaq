import "./src/config/env.js";
import express from "express";
import connectDB from "./src/config/db.js";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin:
      "http://localhost:5173" ||
      "https://goritmi-saas-test-abdu-razaq-v21c.vercel.app/", //  frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// import route
import authRoute from "./src/routes/auth.route.js";

// use that route
app.use("/api/auth", authRoute);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App is running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
