"use server";

import dbConnect from "@/lib/db";
import Supplier from "@/models/Supplier";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
    await dbConnect();
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    // Convert to plain object to avoid serialization issues
    return JSON.parse(JSON.stringify(suppliers));
}

export async function createSupplier(prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;
        const corporateName = formData.get("corporateName") as string;
        const cnpj = formData.get("cnpj") as string;
        const contactPerson = formData.get("contactPerson") as string;
        const contactInfo = formData.get("contactInfo") as string;

        if (!name || !corporateName || !cnpj) {
            return { message: "Nome Fantasia, Razão Social e CNPJ são obrigatórios", error: true };
        }

        await Supplier.create({
            name,
            corporateName,
            cnpj,
            contactPerson,
            contactInfo
        });
        revalidatePath("/suppliers");
        return { message: "Fornecedor criado com sucesso", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function updateSupplier(id: string, prevState: any, formData: FormData) {
    try {
        await dbConnect();
        const name = formData.get("name") as string;
        const corporateName = formData.get("corporateName") as string;
        const cnpj = formData.get("cnpj") as string;
        const contactPerson = formData.get("contactPerson") as string;
        const contactInfo = formData.get("contactInfo") as string;

        await Supplier.findByIdAndUpdate(id, {
            name,
            corporateName,
            cnpj,
            contactPerson,
            contactInfo
        });
        revalidatePath("/suppliers");
        return { message: "Fornecedor atualizado", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function deleteSupplier(id: string) {
    try {
        await dbConnect();
        await Supplier.findByIdAndDelete(id);
        revalidatePath("/suppliers");
        return { message: "Fornecedor removido", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}
