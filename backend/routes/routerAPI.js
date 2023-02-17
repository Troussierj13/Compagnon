import express from "express";
import { characterRouter } from "./character.route.js";
import { gameRouter } from "./game.route.js";
import { weaponRouter } from "./weapon.route.js";

const router = express.Router();

/* GET home page. */
router.use("/character", characterRouter);
router.use("/game", gameRouter);
router.use("/weapon", weaponRouter);

export { router as routerAPI };
