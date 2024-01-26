import mongoose from "mongoose";

const weaponSchema = mongoose.Schema(
    {
        name: {type: mongoose.Schema.Types.String},
        dmg: {type: mongoose.Schema.Types.Number},
        injury: {
            oneHand: {type: mongoose.Schema.Types.Number},
            twoHand: {type: mongoose.Schema.Types.Number},
        },
        weight: {type: mongoose.Schema.Types.Number},
        note: {type: mongoose.Schema.Types.String},
    },
    {timestamps: true}
);

export default mongoose.model("Weapon", weaponSchema);
