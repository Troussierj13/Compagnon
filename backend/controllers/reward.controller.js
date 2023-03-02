import Reward from "../models/Reward.model.js";

export const createReward = async (req, res) => {
  try {
    const newReward = new Reward(req.body);
    await newReward.save();
    res.status(201).json(newReward);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findOneAndUpdate(
      { identifier: req.params.rewardIdentifier },
      req.body,
      { new: true }
    );
    res.status(200).json(reward);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteReward = async (req, res) => {
  try {
    await Reward.findOneAndDelete({ identifier: req.params.rewardIdentifier });
    res.status(200).json({ message: "Reward deleted successfully." });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
