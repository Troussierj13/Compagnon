import express from "express";
import { characterRouter } from "./character.route.js";
import { gameRouter } from "./game.route.js";

const router = express.Router();

/* GET home page. */
router.use("/character", characterRouter);
router.use("/game", gameRouter);

export { router as routerAPI };
