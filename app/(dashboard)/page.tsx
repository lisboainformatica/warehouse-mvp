import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalItems}</div>
                        <p className="text-xs text-muted-foreground">SKUs Cadastrados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Baixo Estoque</CardTitle>
                        <AlertCircle className={`h-4 w-4 ${stats.lowStockItems > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.lowStockItems > 0 ? "text-red-500" : ""}`}>{stats.lowStockItems}</div>
                        <p className="text-xs text-muted-foreground">Itens abaixo do mínimo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas (Hoje)</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+{stats.entriesToday}</div>
                        <p className="text-xs text-muted-foreground">Unidades recebidas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saídas (Hoje)</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">-{stats.exitsToday}</div>
                        <p className="text-xs text-muted-foreground">Unidades expedidas</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Bem-vindo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Bem-vindo ao sistema de Gestão de Almoxarifado. Utilize o menu lateral para gerenciar itens, fornecedores e registrar novas movimentações.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
