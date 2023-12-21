import express from "express";
import { createGame, getAllGames, addCharacterToGame, removeCharacterToGame, emitEnnemyAppears, deleteGame } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/ennemyAppear/:id", emitEnnemyAppears);

router.get("/:id", createGame);
router.get("/", getAllGames);

router.get("/:gameId/:characterId", addCharacterToGame);
router.delete("/:gameId/:characterId", removeCharacterToGame);

router.delete("/:gameId", deleteGame);

export { router as gameRouter };
