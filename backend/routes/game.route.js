import express from "express";
import {
    addCharacterToGame,
    createGame,
    deleteGame,
    getGame,
    removeCharacterToGame
} from "../controllers/game.controller.js";

const router = express.Router();

router.put("/", createGame);
router.get("/", getGame);

router.get("/:gameId/:characterId", addCharacterToGame);
router.delete("/:gameId/:characterId", removeCharacterToGame);

router.delete("/:gameId", deleteGame);

export {router as gameRouter};
