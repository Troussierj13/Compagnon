import mongoose from "mongoose";

const armorSchema = mongoose.Schema(
  {
    identifier: String,
    name: String,
    protection: {
      value: Number,
    },
    parade: {
      value: Number,
    },
    weight: {
      value: Number,
    },
    rewardsMod: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Armor", armorSchema);
