import express from "express";
import {
  createWeapon,
  deleteWeapon,
  getAllWeapons,
  getOneWeapon,
  updateWeapon,
} from "../controllers/weapon.controller.js";

const router = express.Router();

router.post("/", createWeapon);

router.get("/:weaponId", getOneWeapon);
router.get("/", getAllWeapons);

router.put("/:weaponId", updateWeapon);

router.delete("/:weaponId", deleteWeapon);

export { router as weaponRouter };
