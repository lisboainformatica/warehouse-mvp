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
import { createCategory, updateCategory } from "@/lib/actions/category";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    error: false
}

export function CategoryDialog({ category }: { category?: any }) {
    const [open, setOpen] = useState(false);
    const action = category ? updateCategory.bind(null, category._id) : createCategory;
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
                {category ? (
                    <span className="cursor-pointer w-full">Editar</span>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{category ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome da Categoria</Label>
                        <Input id="name" name="name" defaultValue={category?.name} required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {category ? "Salvar Alterações" : "Criar Categoria"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
