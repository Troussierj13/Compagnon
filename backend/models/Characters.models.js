import mongoose from "mongoose";

const charactersSchema = mongoose.Schema(
	{
		name: { type: mongoose.Schema.Types.String, required: true, default: "Nom du personnage" },
	},
	{ timestamps: true }
);

export default mongoose.model("Character", charactersSchema);
