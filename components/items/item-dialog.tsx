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
import { createItem, updateItem } from "@/lib/actions/item";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    error: false
}

export function ItemDialog({ categories, item }: { categories: any[], item?: any }) {
    const [open, setOpen] = useState(false);
    const action = item ? updateItem.bind(null, item._id) : createItem;
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
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {item ? (
                    <span className="cursor-pointer w-full">Editar</span>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Item
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{item ? "Editar Item" : "Novo Item"}</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" name="name" defaultValue={item?.name} required />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select name="category" defaultValue={item?.category?._id || item?.category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" defaultValue={item?.description} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Estoque Inicial</Label>
                            <Input id="quantity" name="quantity" type="number" defaultValue={item?.quantity || 0} min="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minStock">Estoque Mínimo</Label>
                            <Input id="minStock" name="minStock" type="number" defaultValue={item?.minStock || 0} min="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unidade (g, kg, un)</Label>
                            <Input id="unit" name="unit" defaultValue={item?.unit || "un"} placeholder="un" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {item ? "Salvar Alterações" : "Criar Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
