"use client";

import { useState } from "react";
import { ReportFilters } from "./report-filters";
import { getReportData } from "@/lib/actions/report";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function ReportsClient({ users, categories }: { users: any[], categories: any[] }) {
    const [results, setResults] = useState<{ data: any[], type: string } | null>(null);

    const handleSearch = async (filters: any) => {
        const response = await getReportData(filters);
        if (response.error) {
            // Handle error logic if needed, filters component already toasts
        } else {
            setResults(response as any);
        }
    };

    return (
        <div>
            <ReportFilters users={users} categories={categories} onSearch={handleSearch} />

            {results && (
                <>
                    <div className="hidden print:block mb-6">
                        <h1 className="text-2xl font-bold">Relatório do Sistema de Almoxarifado</h1>
                        <p className="text-sm text-muted-foreground">Gerado em: {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
                    </div>
                    <Card className="print:shadow-none print:border-none">
                        <CardHeader>
                            <CardTitle>Resultados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {results.type === "movements" && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Ctg</TableHead>
                                            <TableHead>Qtd</TableHead>
                                            <TableHead>Resp.</TableHead>
                                            <TableHead>Detalhe</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.data.length === 0 ? (
                                            <TableRow><TableCell colSpan={7} className="text-center">Nenhum registro encontrado no período.</TableCell></TableRow>
                                        ) : (
                                            results.data.map((row: any) => (
                                                <TableRow key={row._id}>
                                                    <TableCell>{format(new Date(row.date), "dd/MM/yyyy HH:mm")}</TableCell>
                                                    <TableCell>
                                                        {row.type === "IN" ? (
                                                            <span className="text-green-600 font-bold flex items-center"><ArrowDownLeft className="w-3 h-3 mr-1" />Entrada</span>
                                                        ) : (
                                                            <span className="text-orange-500 font-bold flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" />Saída</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{row.item?.name}</TableCell>
                                                    <TableCell>{row.item?.category?.name || "-"}</TableCell>
                                                    <TableCell>{row.quantity} {row.item?.unit}</TableCell>
                                                    <TableCell>{row.user?.name}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                        {row.type === "IN" ? `Forn: ${row.supplier?.name || "?"}` : `Dest: ${row.destination}`}
                                                        {row.notes && ` - Obs: ${row.notes}`}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}

                            {results.type === "stock" && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Estoque Atual</TableHead>
                                            <TableHead>Mínimo</TableHead>
                                            <TableHead>Situação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.data.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center">Nenhum item encontrado.</TableCell></TableRow>
                                        ) : (
                                            results.data.map((row: any) => (
                                                <TableRow key={row._id}>
                                                    <TableCell className="font-medium">{row.name}</TableCell>
                                                    <TableCell>{row.category?.name}</TableCell>
                                                    <TableCell className={row.quantity <= row.minStock ? "text-red-600 font-bold" : ""}>
                                                        {row.quantity} {row.unit}
                                                    </TableCell>
                                                    <TableCell>{row.minStock}</TableCell>
                                                    <TableCell>
                                                        {row.quantity <= row.minStock ? (
                                                            <Badge variant="destructive">BAIXO</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-green-600 border-green-600">NORMAL</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
