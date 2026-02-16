import { getUsers } from "@/lib/actions/user";
import { getCategories } from "@/lib/actions/category";
import { ReportsClient } from "@/components/reports/reports-client";

export default async function ReportsPage() {
    const users = await getUsers();
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
            <ReportsClient users={users} categories={categories} />
        </div>
    );
}
