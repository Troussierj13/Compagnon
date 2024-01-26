import mongoose from "mongoose";

const characterSchema = mongoose.Schema(
    {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Character",
        },
        name: {type: mongoose.Schema.Types.String, required: true},
        culture: {
            culture: {type: mongoose.Schema.Types.String, required: true},
        },
        vocation: String,
        age: Number,
        qualityLife: String,
        garant: String,
        particularitiesId: [Number],
        faults: [String],
        treasure: Number,
        attributes: {
            values: {
                strength: {
                    value: Number,
                },
                heart: {
                    value: Number,
                },
                mind: {
                    value: Number,
                },
            },
        },
        strengthSkills: {
            awe: {
                favored: Boolean,
                rank: Number,
            },
            athletics: {
                favored: Boolean,
                rank: Number,
            },
            awareness: {
                favored: Boolean,
                rank: Number,
            },
            hunting: {
                favored: Boolean,
                rank: Number,
            },
            song: {
                favored: Boolean,
                rank: Number,
            },
            craft: {
                favored: Boolean,
                rank: Number,
            },
        },
        heartSkills: {
            enhearten: {
                favored: Boolean,
                rank: Number,
            },
            travel: {
                favored: Boolean,
                rank: Number,
            },
            insight: {
                favored: Boolean,
                rank: Number,
            },
            healing: {
                favored: Boolean,
                rank: Number,
            },
            courtesy: {
                favored: Boolean,
                rank: Number,
            },
            battle: {
                favored: Boolean,
                rank: Number,
            },
        },
        mindSkills: {
            persuade: {
                favored: Boolean,
                rank: Number,
            },
            stealth: {
                favored: Boolean,
                rank: Number,
            },
            scan: {
                favored: Boolean,
                rank: Number,
            },
            explore: {
                favored: Boolean,
                rank: Number,
            },
            riddle: {
                favored: Boolean,
                rank: Number,
            },
            lore: {
                favored: Boolean,
                rank: Number,
            },
        },
        combatSkills: {
            axes: {
                rank: Number,
            },
            bows: {
                rank: Number,
            },
            spears: {
                rank: Number,
            },
            swords: {
                rank: Number,
            },
        },
        weapons: [
            {
                name: String,
                dmg: Number,
                injury: {
                    oneHand: Number,
                    twoHand: Number,
                },
                weight: Number,
                note: String,
                rewardsMod: [
                    {
                        identifier: String,
                    },
                ],
            },
        ],
        armor: {
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
        helm: {
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
        shield: {
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
        wisdom: {
            rank: Number,
            virtues: [
                {
                    identifier: String,
                    chosen: Number,
                },
            ],
        },
        valiance: {
            rank: Number,
            rewards: [
                {
                    identifier: String,
                    applyTo: String,
                },
            ],
        },
        adventurePoints: Number,
        progressPoints: Number,
        communityPoints: Number,
        fatigue: {
            value: Number,
        },
        shadows: {
            value: Number,
        },
        sequels: Number,
        currentEndurance: {
            value: Number,
        },
        currentHope: {
            value: Number,
        },
        states: {
            exhaust: Boolean,
            melancholic: Boolean,
            hurt: Boolean,
            injuries: {
                value: Number,
                unit: String,
            },
        },
        travelEquipment: [
            {
                name: String,
                skillRef: String,
            },
        ],
    },
    {timestamps: true}
);

export default mongoose.model("Character", characterSchema);
