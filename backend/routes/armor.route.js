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
router.get("/:weaponId", getOneArmor);
router.get("/", getAllArmors);

router.put("/:weaponId", updateArmor);

router.delete("/:weaponId", deleteArmor);

export { router as armorRouter };
