import { getMovements } from "@/lib/actions/movement";
import { getItems } from "@/lib/actions/item";
import { getSuppliers } from "@/lib/actions/supplier";
import { MovementDialog } from "@/components/movements/movement-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MovementActions } from "@/components/movements/movement-actions";

export default async function MovementsPage() {
    const movements = await getMovements();
    const items = await getItems();
    const suppliers = await getSuppliers();
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Movimentações</h2>
                <div className="flex space-x-2">
                    <MovementDialog type="IN" items={items} suppliers={suppliers} />
                    <MovementDialog type="OUT" items={items} suppliers={suppliers} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Qtd</TableHead>
                                <TableHead>Origem/Dest</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Obs.</TableHead>
                                {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 8 : 7} className="text-center">
                                        Nenhuma movimentação registrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                movements.map((mov: any) => (
                                    <TableRow key={mov._id}>
                                        <TableCell>
                                            {mov.type === "IN" ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <ArrowDownLeft className="w-3 h-3 mr-1" /> ENTRADA
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-orange-500 hover:bg-orange-600">
                                                    <ArrowUpRight className="w-3 h-3 mr-1" /> SAÍDA
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(mov.date), "dd/MM/yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {mov.item?.name || "Item Excluído"}
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {mov.quantity} {mov.item?.unit}
                                        </TableCell>
                                        <TableCell>
                                            {mov.type === "IN"
                                                ? mov.supplier?.name || "Fornecedor Desc."
                                                : mov.destination || "Destino Desc."}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {mov.user?.name}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                            {mov.notes}
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell className="text-right">
                                                <MovementActions movement={mov} items={items} suppliers={suppliers} />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
