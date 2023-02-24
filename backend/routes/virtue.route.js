import express from "express";
import {
  createVirtue,
  deleteVirtue,
  getAllVirtues,
  updateVirtue,
} from "../controllers/virtue.controller.js";

const router = express.Router();

router.post("/", createVirtue);

router.get("/", getAllVirtues);

router.put("/:virtueIdentifier", updateVirtue);

router.delete("/:virtueIdentifier", deleteVirtue);

export { router as virtueRouter };
