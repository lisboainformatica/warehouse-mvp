"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupplier, updateSupplier } from "@/lib/actions/supplier";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    error: false
}

interface SupplierDialogProps {
    supplier?: any;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SupplierDialog({ supplier, open: openProp, onOpenChange: onOpenChangeProp }: SupplierDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const setOpen = isControlled ? onOpenChangeProp! : setInternalOpen;

    const action = supplier ? updateSupplier.bind(null, supplier._id) : createSupplier;
    // @ts-ignore
    const [state, formAction] = useActionState(action, initialState);

    useEffect(() => {
        if (state.message) {
            if (!state.error) {
                toast.success(state.message);
                setOpen(false);
            } else {
                toast.error(state.message);
            }
        }
    }, [state, setOpen])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    {supplier ? (
                        <span className="cursor-pointer w-full">Editar</span>
                    ) : (
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{supplier ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="corporateName">Razão Social *</Label>
                        <Input id="corporateName" name="corporateName" defaultValue={supplier?.corporateName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Fantasia *</Label>
                        <Input id="name" name="name" defaultValue={supplier?.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ *</Label>
                        <Input id="cnpj" name="cnpj" defaultValue={supplier?.cnpj} required placeholder="00.000.000/0000-00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactPerson">Responsável (Nome)</Label>
                        <Input id="contactPerson" name="contactPerson" defaultValue={supplier?.contactPerson} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactInfo">Contato (Email/Tel)</Label>
                        <Input id="contactInfo" name="contactInfo" defaultValue={supplier?.contactInfo} placeholder="email@exemplo.com / (11) 99999-9999" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {supplier ? "Salvar Alterações" : "Criar Fornecedor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
