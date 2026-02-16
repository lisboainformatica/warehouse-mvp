"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteUser } from "@/lib/actions/user";
import { toast } from "sonner";

export function UserActions({ id }: { id: string }) {
    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja remover este usuário?")) {
            const res = await deleteUser(id);
            if (!res.error) {
                toast.success("Usuário removido");
            } else {
                toast.error(res.message);
            }
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash className="h-4 w-4" />
        </Button>
    );
}
