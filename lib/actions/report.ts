"use server";

import dbConnect from "@/lib/db";
import Movement from "@/models/Movement";
import Item from "@/models/Item";
import User from "@/models/User";
import "@/models/Supplier";
import "@/models/Category";
import { startOfDay, endOfDay } from "date-fns";

export async function getReportData(filters: {
    type: "movements" | "stock";
    startDate?: string;
    endDate?: string;
    userId?: string;
    categoryId?: string;
    movementType?: "IN" | "OUT" | "ALL";
    stockFilter?: "ALL" | "LOW";
}) {
    await dbConnect();

    try {
        if (filters.type === "movements") {
            if (!filters.startDate || !filters.endDate) {
                return { error: "Período é obrigatório para relatório de movimentações." };
            }

            // Parse dates as local time by appending T00:00:00, preventing UTC shift
            // e.g. "2026-02-15" -> "2026-02-15T00:00:00" (Local)
            const start = new Date(`${filters.startDate}T00:00:00`);
            const end = new Date(`${filters.endDate}T23:59:59.999`);

            const query: any = {
                date: {
                    $gte: start,
                    $lte: end,
                },
            };

            if (filters.userId && filters.userId !== "ALL") {
                query.user = filters.userId;
            }

            if (filters.movementType && filters.movementType !== "ALL") {
                query.type = filters.movementType;
            }

            // For category filtering in movements, we need to find items in that category first
            // or populate and filter in memory (efficient enough for MVP)
            // Let's do a robust query if possible, but population is easier for now.
            // We will populate 'item' and then filter results if category is present.

            let movements = await Movement.find(query)
                .populate("user", "name")
                .populate({
                    path: "item",
                    populate: { path: "category", model: "Category" } // Nested populate for category
                })
                .populate("supplier", "name") // Populate supplier name
                .sort({ date: -1 });

            // Filter by Category if set (CLIENT SIDE FILTERING on Server Data for simplicity with Populated fields)
            if (filters.categoryId && filters.categoryId !== "ALL") {
                movements = movements.filter((mov: any) =>
                    mov.item?.category?._id?.toString() === filters.categoryId
                );
            }

            return { data: JSON.parse(JSON.stringify(movements)), type: "movements" };

        } else if (filters.type === "stock") {
            const query: any = {};

            if (filters.categoryId && filters.categoryId !== "ALL") {
                query.category = filters.categoryId;
            }

            let items = await Item.find(query).populate("category", "name").sort({ name: 1 });

            if (filters.stockFilter === "LOW") {
                items = items.filter((item: any) => item.quantity <= item.minStock);
            }

            return { data: JSON.parse(JSON.stringify(items)), type: "stock" };
        }

        return { data: [], type: "unknown" };
    } catch (error) {
        console.error("Error generating report:", error);
        return { error: "Erro ao gerar relatório. Tente novamente mais tarde." };
    }
}
