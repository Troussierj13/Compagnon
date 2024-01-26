import express from "express";
import {
    createCharacter,
    deleteCharacter,
    getAllCharacters,
    getOneCharacter,
    updateCharacter
} from "../controllers/character.controller.js";

const router = express.Router();

router.post("/", createCharacter);

router.get("/:characterId", getOneCharacter);
router.get("/", getAllCharacters);

router.put("/:characterId", updateCharacter);

router.delete("/:characterId", deleteCharacter);

export {router as characterRouter};
