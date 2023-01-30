import mongoose from "mongoose";

const characterSchema = mongoose.Schema(
	{
		name: { type: mongoose.Schema.Types.String, required: true },
		race: { type: mongoose.Schema.Types.String, required: true },
		attributes: {
			values: {
				strength: { type: mongoose.Schema.Types.Number },
				heart: { type: mongoose.Schema.Types.Number },
				mind: { type: mongoose.Schema.Types.Number },
			},
		},
		strengthSkills: {
			athletics: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			awareness: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			awe: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			craft: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			hunting: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			song: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
		},
		heartSkills: {
			battle: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			courtesy: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			enhearten: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			healing: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			insight: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			travel: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
		},
		mindSkills: {
			explore: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			lore: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			persuade: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			riddle: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			scan: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
			stealth: {
				favored: { type: mongoose.Schema.Types.Boolean },
				rank: { type: mongoose.Schema.Types.Number },
			},
		},
		combatSkills: {
			axes: {
				name: { type: mongoose.Schema.Types.String },
				rank: { type: mongoose.Schema.Types.Number },
			},
			bows: {
				name: { type: mongoose.Schema.Types.String },
				rank: { type: mongoose.Schema.Types.Number },
			},
			spears: {
				name: { type: mongoose.Schema.Types.String },
				rank: { type: mongoose.Schema.Types.Number },
			},
			swords: {
				name: { type: mongoose.Schema.Types.String },
				rank: { type: mongoose.Schema.Types.Number },
			},
		},
		armor: {
			name: { type: mongoose.Schema.Types.String },
			parade: { type: mongoose.Schema.Types.String },
			protection: { type: mongoose.Schema.Types.String },
			weight: { type: mongoose.Schema.Types.Number },
		},
		helm: {
			name: { type: mongoose.Schema.Types.String },
			parade: { type: mongoose.Schema.Types.String },
			protection: { type: mongoose.Schema.Types.String },
			weight: { type: mongoose.Schema.Types.Number },
		},
		shield: {
			name: { type: mongoose.Schema.Types.String },
			parade: { type: mongoose.Schema.Types.String },
			protection: { type: mongoose.Schema.Types.String },
			weight: { type: mongoose.Schema.Types.Number },
		},
		weapons: [
			{
				name: { type: mongoose.Schema.Types.String },
				dmg: { type: mongoose.Schema.Types.Number },
				injury: {
					oneHand: { type: mongoose.Schema.Types.Number },
					twoHand: { type: mongoose.Schema.Types.Number },
				},
				weight: { type: mongoose.Schema.Types.Number },
				note: { type: mongoose.Schema.Types.String },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Character", characterSchema);
