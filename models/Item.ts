import mongoose, { Schema } from "mongoose";
import "@/models/Category";

const ItemSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        quantity: { type: Number, default: 0 },
        minStock: { type: Number, default: 0 },
        unit: { type: String, default: "un" },
    },
    { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
