import express from "express";
import { characterRouter } from "./character.route.js";

const router = express.Router();

/* GET home page. */
router.use("/character", characterRouter);

export { router as routerAPI };
