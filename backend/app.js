import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { routerAPI } from "./routes/routerAPI.js";

dotenv.config();

const app = express();

mongoose
	.connect(`mongodb+srv://${process.env.MODE == "production" ? process.env.MONGO_USERNAME_PROD : process.env.MONGO_USERNAME}:${process.env.MODE == "production" ? process.env.MONGO_PASSWORD_PROD : process.env.MONGO_PASSWORD}@${process.env.MODE == "production" ? process.env.MONGO_CLUSTER_PROD : process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MODE == "production" ? process.env.MONGO_DATABASE_PROD : process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.dirname("public")));
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD, POST, PUT, DELETE, PATCH, OPTIONS");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

app.use("/api", routerAPI);
app.use("*", (req, res) => {
	// TODO : Send front end page
	res.send("Page not found");
});

export default app;
