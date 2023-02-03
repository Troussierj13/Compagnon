import express from "express";
import { createGame } from "../controllers/game.controller.js";

const router = express.Router();

router.get("/:id", createGame);

export { router as gameRouter };
