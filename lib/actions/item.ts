"use server";

import dbConnect from "@/lib/db";
import Item from "@/models/Item";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function getItems() {
    await dbConnect();
    // Populate category to show name in table
    const items = await Item.find().populate("category").sort({ name: 1 });
    return JSON.parse(JSON.stringify(items));
}

export async function createItem(prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const unit = formData.get("unit") as string;
        const minStock = Number(formData.get("minStock"));
        const initialQuantity = Number(formData.get("quantity"));

        if (!name) return { message: "O nome é obrigatório", error: true };
        if (!category) return { message: "A categoria é obrigatória", error: true };

        await Item.create({
            name,
            description,
            category,
            unit: unit || "un",
            minStock: minStock || 0,
            quantity: initialQuantity || 0,
        });

        revalidatePath("/items");
        return { message: "Item criado com sucesso", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function updateItem(id: string, prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const unit = formData.get("unit") as string;
        const minStock = Number(formData.get("minStock"));

        // Quantity usually updated via movements, but allow edit here for corrections if needed
        const quantity = Number(formData.get("quantity"));

        await Item.findByIdAndUpdate(id, {
            name,
            description,
            category,
            unit,
            minStock,
            quantity,
        });

        revalidatePath("/items");
        return { message: "Item atualizado", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function deleteItem(id: string) {
    try {
        await dbConnect();
        await Item.findByIdAndDelete(id);
        revalidatePath("/items");
        return { message: "Item removido", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}
