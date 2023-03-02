import express from "express";
import {
  createReward,
  deleteReward,
  getAllRewards,
  updateReward,
} from "../controllers/reward.controller.js";

const router = express.Router();

router.post("/", createReward);

router.get("/", getAllRewards);

router.put("/:rewardIdentifier", updateReward);

router.delete("/:rewardIdentifier", deleteReward);

export { router as rewardRouter };
