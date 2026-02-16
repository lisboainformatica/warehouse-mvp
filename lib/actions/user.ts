"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUsers() {
    await dbConnect();
    const users = await User.find().select("-passwordHash").sort({ name: 1 });
    return JSON.parse(JSON.stringify(users));
}

export async function createUser(prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        // Basic role check (ideally should be robust middleware/check)
        if (session?.user?.role !== "ADMIN") {
            return { message: "Apenas administradores podem criar usuários.", error: true };
        }

        await dbConnect();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;

        if (!name || !email || !password) {
            return { message: "Todos os campos são obrigatórios", error: true };
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { message: "Email já cadastrado", error: true };
        }

        const passwordHash = await hash(password, 12);

        await User.create({
            name,
            email,
            passwordHash,
            role: role || "USER",
        });

        revalidatePath("/users");
        return { message: "Usuário criado com sucesso", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function deleteUser(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return { message: "Não autorizado", error: true };
        }

        // Prevent deleting yourself
        if (session.user.id === id) {
            return { message: "Você não pode excluir sua própria conta.", error: true };
        }

        await dbConnect();
        await User.findByIdAndDelete(id);
        revalidatePath("/users");
        return { message: "Usuário removido", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}
