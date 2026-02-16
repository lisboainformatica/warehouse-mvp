"use server";

import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;

        if (!name) {
            return { message: "O nome é obrigatório", error: true };
        }

        await Category.create({ name });
        revalidatePath("/categories");
        return { message: "Categoria criada com sucesso", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;

        await Category.findByIdAndUpdate(id, { name });
        revalidatePath("/categories");
        return { message: "Categoria atualizada", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function deleteCategory(id: string) {
    try {
        await dbConnect();
        await Category.findByIdAndDelete(id);
        revalidatePath("/categories");
        return { message: "Categoria removida", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}
