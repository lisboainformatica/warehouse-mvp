import { getItems } from "@/lib/actions/item";
import { getCategories } from "@/lib/actions/category";
import { ItemDialog } from "@/components/items/item-dialog";
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
import { ItemActions } from "@/components/items/item-actions";

export default async function ItemsPage() {
    const items = await getItems();
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Itens</h2>
                <ItemDialog categories={categories} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inventário</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        Nenhum item encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item: any) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-medium">
                                            <div>{item.name}</div>
                                            <div className="text-xs text-muted-foreground hidden md:block max-w-[200px] truncate">
                                                {item.description}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.category?.name || "Sem categoria"}</Badge>
                                        </TableCell>
                                        <TableCell className={item.quantity <= item.minStock ? "text-red-600 font-bold" : ""}>
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell>
                                            {item.quantity <= item.minStock ? (
                                                <Badge variant="destructive">Baixo Estoque</Badge>
                                            ) : (
                                                <Badge variant="secondary">OK</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ItemActions item={item} categories={categories} />
                                        </TableCell>
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
