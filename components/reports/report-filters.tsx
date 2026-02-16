"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function ReportFilters({
    users,
    categories,
    onSearch
}: {
    users: any[],
    categories: any[],
    onSearch: (filters: any) => Promise<void>
}) {
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState<"movements" | "stock">("movements");

    // States for filters
    const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [userId, setUserId] = useState("ALL");
    const [categoryId, setCategoryId] = useState("ALL");
    const [movementType, setMovementType] = useState("ALL");
    const [stockFilter, setStockFilter] = useState("ALL");

    const handleSearch = async () => {
        setLoading(true);

        if (reportType === "movements" && (!startDate || !endDate)) {
            toast.error("Selecione o período inicial e final.");
            setLoading(false);
            return;
        }

        await onSearch({
            type: reportType,
            startDate,
            endDate,
            userId,
            categoryId,
            movementType,
            stockFilter
        });

        setLoading(false);
    };

    const handlePrint = () => {
        window.print();
    }

    return (
        <Card className="mb-6 print:hidden">
            <CardHeader>
                <CardTitle>Filtros do Relatório</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="space-y-2">
                        <Label>Tipo de Relatório</Label>
                        <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="movements">Histórico de Movimentações</SelectItem>
                                <SelectItem value="stock">Posição de Estoque</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {reportType === "movements" && (
                        <>
                            <div className="space-y-2">
                                <Label>Data Inicial *</Label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Data Final *</Label>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Usuário</Label>
                                <Select value={userId} onValueChange={setUserId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Todos os Usuários</SelectItem>
                                        {users.map((u) => (
                                            <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Operação</Label>
                                <Select value={movementType} onValueChange={setMovementType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Todas</SelectItem>
                                        <SelectItem value="IN">Entrada</SelectItem>
                                        <SelectItem value="OUT">Saída</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todas as Categorias</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {reportType === "stock" && (
                        <div className="space-y-2">
                            <Label>Filtro de Estoque</Label>
                            <Select value={stockFilter} onValueChange={setStockFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Geral" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Total (Geral)</SelectItem>
                                    <SelectItem value="LOW">Baixo Estoque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="lg:col-span-4 flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Imprimir / PDF
                        </Button>
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Gerar Relatório
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}