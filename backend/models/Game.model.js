import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
	{
		gameMaster: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
		players: [
			{
				player: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Character",
				},
				character: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Character",
				},
			},
		],
		isRunning: { type: mongoose.Schema.Types.Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model("Game", gameSchema);
