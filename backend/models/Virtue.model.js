import mongoose from "mongoose";

const virtueSchema = mongoose.Schema(
    {
        identifier: String,
        defaultInfo: {
            name: String,
            description: String,
            modifiers: [{identifier: String, op: String, mod: Number}],
        },
        chosen: Number,
        choice: [
            {
                name: String,
                description: String,
                modifiers: [{identifier: String, op: String, mod: Number}],
            },
        ],
    },
    {timestamps: true}
);

export default mongoose.model("Virtue", virtueSchema);
