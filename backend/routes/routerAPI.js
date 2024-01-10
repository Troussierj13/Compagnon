import express from "express";
import { armorRouter } from "./armor.route.js";
import { characterRouter } from "./character.route.js";
import { gameRouter } from "./game.route.js";
import { rewardRouter } from "./reward.route.js";
import { virtueRouter } from "./virtue.route.js";
import { weaponRouter } from "./weapon.route.js";
import {encryptedNtag} from "./encryptedNtag.route.js";

const router = express.Router();

/* GET home page. */
router.use("/character", characterRouter);
router.use("/game", gameRouter);
router.use("/weapon", weaponRouter);
router.use("/virtue", virtueRouter);
router.use("/reward", rewardRouter);
router.use("/armor", armorRouter);
router.use("/encryptedNtag", encryptedNtag);

export { router as routerAPI };
