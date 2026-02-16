import { getSuppliers } from "@/lib/actions/supplier";
import { SupplierDialog } from "@/components/suppliers/supplier-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupplierActions } from "@/components/suppliers/supplier-actions";

export default async function SuppliersPage() {
    const suppliers = await getSuppliers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Fornecedores</h2>
                <SupplierDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Fornecedores</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Empresa</TableHead>
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Responsável</TableHead>
                                <TableHead>Contato</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Nenhum fornecedor encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((sup: any) => (
                                    <TableRow key={sup._id}>
                                        <TableCell className="font-medium">
                                            <div>{sup.name}</div>
                                            <div className="text-xs text-muted-foreground">{sup.corporateName}</div>
                                        </TableCell>
                                        <TableCell>{sup.cnpj}</TableCell>
                                        <TableCell>{sup.contactPerson || "-"}</TableCell>
                                        <TableCell>{sup.contactInfo || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <SupplierActions supplier={sup} />
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
