import mongoose from "mongoose";

const armorSchema = mongoose.Schema(
  {
    name: String,
    protection: String,
    parade: String,
    weight: {
      identifier: String,
      value: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Armor", armorSchema);
