import mongoose, { Schema } from "mongoose";

const MovementSchema = new Schema(
    {
        type: { type: String, enum: ["IN", "OUT"], required: true },
        item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        quantity: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        supplier: { type: Schema.Types.ObjectId, ref: "Supplier" }, // Required if IN
        destination: { type: String }, // Required if OUT
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Movement ||
    mongoose.model("Movement", MovementSchema);
