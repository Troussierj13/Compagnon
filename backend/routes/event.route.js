import express from "express";
import {emitVisibilityChange, emitEnnemyAppears} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/ennemyAppear/:id", emitEnnemyAppears);
router.post("/visibilityChange/", emitVisibilityChange);

export { router as eventRouter };
