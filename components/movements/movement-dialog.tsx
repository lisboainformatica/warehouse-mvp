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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createMovement, updateMovement } from "@/lib/actions/movement";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    error: false
}

interface MovementDialogProps {
    type?: "IN" | "OUT";
    items: any[];
    suppliers: any[];
    movement?: any; // For edit mode
    open?: boolean; // Controlled
    onOpenChange?: (open: boolean) => void;
}

export function MovementDialog({ type: typeProp, items, suppliers, movement, open: openProp, onOpenChange: onOpenChangeProp }: MovementDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : internalOpen;
    const setOpen = isControlled ? onOpenChangeProp! : setInternalOpen;

    const action = movement ? updateMovement.bind(null, movement._id) : createMovement;
    // @ts-ignore
    const [state, formAction] = useActionState(action, initialState);

    // Determine type: prop overwrite (create) > movement.type (edit) > fallback
    const type = typeProp || movement?.type || "IN";

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
                    <Button variant={type === "IN" ? "default" : "secondary"} className={type === "IN" ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600 text-white"}>
                        {type === "IN" ? <ArrowDownLeft className="mr-2 h-4 w-4" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
                        {type === "IN" ? "Nova Entrada" : "Nova Saída"}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {movement ? "Editar Movimentação" : (type === "IN" ? "Registrar Entrada" : "Registrar Saída")}
                    </DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    {/* Allow changing type in Edit? Logic supports it. Let's show select only if editing, or lock it? 
                        Locking is safer for UX. changing type is huge. Let's hidden input it.
                    */}
                    <input type="hidden" name="type" value={type} />

                    <div className="space-y-2">
                        <Label htmlFor="item">Item</Label>
                        <Select name="item" defaultValue={movement?.item?._id || movement?.item} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o item..." />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>
                                        {item.name} (Atual: {item.quantity} {item.unit})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input id="quantity" name="quantity" type="number" min="1" defaultValue={movement?.quantity} required />
                    </div>

                    {type === "IN" ? (
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Fornecedor</Label>
                            <Select name="supplier" defaultValue={movement?.supplier?._id || movement?.supplier} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o fornecedor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((sup) => (
                                        <SelectItem key={sup._id} value={sup._id}>
                                            {sup.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="destination">Destino/Solicitante</Label>
                            <Input id="destination" name="destination" defaultValue={movement?.destination} placeholder="Ex: Produção, Cliente X" required />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações (Opcional)</Label>
                        <Textarea id="notes" name="notes" defaultValue={movement?.notes} placeholder="Detalhes adicionais..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full">
                            {movement ? "Salvar Alterações" : (type === "IN" ? "Confirmar Entrada" : "Confirmar Saída")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
