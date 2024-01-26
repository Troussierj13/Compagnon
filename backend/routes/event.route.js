import express from "express";
import {emitEnnemyAppears, emitShowState, emitVisibilityChange} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/ennemyAppear/", emitEnnemyAppears);
router.post("/visibilityChange/", emitVisibilityChange);
router.post("/showState/", emitShowState);

export {router as eventRouter};
