import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { indexRouter } from "./routes/index.js";
import { usersRouter } from "./routes/users.js";

dotenv.config();

const app = express();

mongoose
	.connect(`mongodb+srv://${process.env.MODE == "production" ? process.env.MONGO_USERNAME_PROD : process.env.MONGO_USERNAME}:${process.env.MODE == "production" ? process.env.MONGO_PASSWORD_PROD : process.env.MONGO_PASSWORD}@${process.env.MODE == "production" ? process.env.MONGO_CLUSTER_PROD : process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MODE == "production" ? process.env.MONGO_DATABASE_PROD : process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

console.log(process.env.MODE);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.dirname("public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

export default app;