"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { SupplierDialog } from "./supplier-dialog";
import { deleteSupplier } from "@/lib/actions/supplier";
import { toast } from "sonner";
import { useState } from "react";

export function SupplierActions({ supplier }: { supplier: any }) {
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja remover este fornecedor?")) {
            const res = await deleteSupplier(supplier._id);
            if (!res.error) {
                toast.success("Fornecedor removido");
            } else {
                toast.error(res.message);
            }
        }
    }

    return (
        <>
            <SupplierDialog
                supplier={supplier}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
