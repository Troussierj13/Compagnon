import express from "express";
import {
    addCharacterToGame,
    addEventToGame,
    createGame,
    deleteGame,
    getGame,
    removeCharacterToGame,
    resetEventsToGame
} from "../controllers/game.controller.js";

const router = express.Router();

router.put("/", createGame);
router.get("/", getGame);
router.get("/:gameId/:characterId", addCharacterToGame);

router.post("/addEvent", addEventToGame);

router.put("/resetEvents", resetEventsToGame);

router.delete("/:gameId/:characterId", removeCharacterToGame);

router.delete("/:gameId", deleteGame);

export {router as gameRouter};
