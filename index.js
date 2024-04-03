import dotenv from "dotenv";

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Router/router.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import config from "./config.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api', router);

app.use(errorMiddleware);

const startApp = async () => {
  try {
    await mongoose.connect(config.mongoConfig.dbUrl);
    app.listen(config.port, () => console.log(`Server live @ ${config.port}`));
  } catch (e) {
    console.log(e);
  }
};

startApp();