import "./src/config/env.js";
import express from "express";
import connectDB from "./src/config/db.js";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
// import route
import authRoute from "./src/routes/auth.route.js";
import userRoute from "./src/routes/user.route.js";
import invoiceRoute from "./src/routes/invoice.route.js";
import userInvoiceRoute from "./src/routes/userInvoice.route.js";
import businessRoute from "./src/routes/business.route.js";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://goritmi-saas-test-abdu-razaq.vercel.app",
    ], //  frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use that route
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", invoiceRoute);
app.use("/api/user/invoices", userInvoiceRoute);
app.use("/api/business/profile", businessRoute);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`App is running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
