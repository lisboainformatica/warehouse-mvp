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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/lib/actions/user";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
    message: "",
    error: false
}

export function UserDialog() {
    const [open, setOpen] = useState(false);
    // @ts-ignore
    const [state, formAction] = useActionState(createUser, initialState);

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
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Usuário</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required minLength={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Nível de Acesso</Label>
                        <Select name="role" defaultValue="USER">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USER">Usuário (Padrão)</SelectItem>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Criar Usuário</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
