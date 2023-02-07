import mongoose from "mongoose";

const playerSchema = mongoose.Schema(
	{
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
