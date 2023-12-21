import mongoose from "mongoose";

const playerSchema = mongoose.Schema(
	{
		name: { type: mongoose.Schema.Types.String, required: true },
		password: { type: mongoose.Schema.Types.String, required: true },
		characters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Character",
			},
		],
		game: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Game",
			},
		],
		gameMaster: { type: mongoose.Schema.Types.Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model("Game", playerSchema);
