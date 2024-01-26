import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
    {
        name: mongoose.Schema.Types.String,
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Character",
            },
        ],
        events: [
            {
                emit: mongoose.Schema.Types.String
            }
        ]
    },
    {timestamps: true}
);

export default mongoose.model("Game", gameSchema);
