import mongoose from "mongoose";

const encryptedNtagSchema = mongoose.Schema(
    {
        data: {type: mongoose.Schema.Types.String},
    },
    {
        timestamps: true,
        max: 1,
    }
);

export default mongoose.model("EncryptedNtag", encryptedNtagSchema);
