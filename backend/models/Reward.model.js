import mongoose from "mongoose";

const rewardSchema = mongoose.Schema(
  {
    identifier: String,
    defaultChoice: {
      name: String,
      description: String,
      modifiers: [{ identifier: String, op: String, mod: Number }],
      applyTo: String,
    },
    choices: [
      {
        name: String,
        description: String,
        modifiers: [{ identifier: String, op: String, mod: Number }],
        applyTo: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
