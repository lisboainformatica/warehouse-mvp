"use server";

import dbConnect from "@/lib/db";
import Item from "@/models/Item";
import Movement from "@/models/Movement";
import { startOfDay, endOfDay } from "date-fns";

export async function getDashboardStats() {
    await dbConnect();

    const totalItems = await Item.countDocuments();

    // MongoDB doesn't support field comparison in simpler queries easily without $expr, 
    // but for MVP we can filter in memory or use $expr.
    // $expr: { $lte: ["$quantity", "$minStock"] }
    const lowStockItems = await Item.find({
        $expr: { $lte: ["$quantity", "$minStock"] }
    }).countDocuments();

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const todayMovements = await Movement.find({
        date: { $gte: todayStart, $lte: todayEnd }
    });

    const entriesToday = todayMovements
        .filter((m) => m.type === "IN")
        .reduce((acc, curr) => acc + curr.quantity, 0);

    const exitsToday = todayMovements
        .filter((m) => m.type === "OUT")
        .reduce((acc, curr) => acc + curr.quantity, 0);

    return {
        totalItems,
        lowStockItems,
        entriesToday,
        exitsToday
    };
}
