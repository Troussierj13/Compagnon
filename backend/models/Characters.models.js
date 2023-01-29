import mongoose from "mongoose";

const charactersSchema = mongoose.Schema(
	{
		title: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Character", charactersSchema);
