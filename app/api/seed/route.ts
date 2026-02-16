import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await dbConnect();

        const existingAdmin = await User.findOne({ email: "admin@warehouse.com" });

        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin user already exists" },
                { status: 200 }
            );
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await User.create({
            name: "Admin User",
            email: "admin@warehouse.com",
            passwordHash: hashedPassword,
            role: "ADMIN",
        });

        return NextResponse.json(
            { message: "Admin user created successfully", user: admin },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error seeding database", error: error.message },
            { status: 500 }
        );
    }
}
