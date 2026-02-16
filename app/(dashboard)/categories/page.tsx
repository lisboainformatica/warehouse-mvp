import { getCategories } from "@/lib/actions/category";
import { CategoryDialog } from "@/components/categories/category-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryActions } from "@/components/categories/category-actions";

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
                <CategoryDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Classificação de Itens</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        Nenhuma categoria encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat: any) => (
                                    <TableRow key={cat._id}>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{cat._id}</TableCell>
                                        <TableCell className="text-right">
                                            <CategoryActions category={cat} />
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
