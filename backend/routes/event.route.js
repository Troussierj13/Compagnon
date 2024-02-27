import express from "express";
import {emitEnnemyAppears, emitShowState, emitVisibilityChange, emitCharacterSheet} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/ennemyAppear/", emitEnnemyAppears);
router.post("/visibilityChange/", emitVisibilityChange);
router.post("/showState/", emitShowState);
router.post("/characterSheet/", emitCharacterSheet);

export {router as eventRouter};
