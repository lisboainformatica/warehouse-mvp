import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
