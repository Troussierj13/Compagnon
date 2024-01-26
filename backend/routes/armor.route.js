import express from "express";
import {
    createArmor,
    deleteArmor,
    getAllArmors,
    getOneArmor,
    populateDb,
    updateArmor,
} from "../controllers/armor.controller.js";

const router = express.Router();

router.post("/", createArmor);

router.get("/populateDb", populateDb);
router.get("/:armorId", getOneArmor);
router.get("/", getAllArmors);

router.put("/:armorId", updateArmor);

router.delete("/:armorId", deleteArmor);

export {router as armorRouter};
