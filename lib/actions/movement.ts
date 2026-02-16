"use server";

import dbConnect from "@/lib/db";
import Movement from "@/models/Movement";
import Item from "@/models/Item";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getMovements() {
    await dbConnect();
    // Populate related fields for display
    const movements = await Movement.find()
        .populate("item")
        .populate("user", "name")
        .populate("supplier", "name")
        .sort({ date: -1 })
        .limit(100); // Limit to recent 100 for performance in MVP
    return JSON.parse(JSON.stringify(movements));
}

export async function createMovement(prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { message: "Não autorizado", error: true };
        }

        await dbConnect();

        // Parse form data
        const type = formData.get("type") as string;
        const itemId = formData.get("item") as string;
        const quantity = Number(formData.get("quantity"));
        const supplierId = formData.get("supplier") as string;
        const destination = formData.get("destination") as string;
        const notes = formData.get("notes") as string;

        // Validation
        if (!type || !itemId || !quantity || quantity <= 0) {
            return { message: "Dados inválidos", error: true };
        }

        if (type === "IN" && !supplierId) {
            return { message: "Fornecedor é obrigatório para entrada", error: true };
        }

        if (type === "OUT" && !destination) {
            return { message: "Destino é obrigatório para saída", error: true };
        }

        // Check stock for OUT
        const item = await Item.findById(itemId);
        if (!item) {
            return { message: "Item não encontrado", error: true };
        }

        if (type === "OUT" && item.quantity < quantity) {
            return { message: `Estoque insuficiente. Disponível: ${item.quantity}`, error: true };
        }

        // Create Movement
        const movement = await Movement.create({
            type,
            item: itemId,
            user: session.user.id,
            quantity,
            supplier: type === "IN" ? supplierId : undefined,
            destination: type === "OUT" ? destination : undefined,
            notes,
            date: new Date()
        });

        // Update Item Stock
        const newQuantity = type === "IN"
            ? item.quantity + quantity
            : item.quantity - quantity;

        await Item.findByIdAndUpdate(itemId, { quantity: newQuantity });

        revalidatePath("/movements");
        revalidatePath("/items");
        revalidatePath("/"); // Dashboard stats

        return { message: "Movimentação registrada com sucesso", error: false };

    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function deleteMovement(id: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { message: "Apenas administradores podem excluir movimentações", error: true };
        }

        await dbConnect();

        // Find movement to get details for reversion
        const movement = await Movement.findById(id);
        if (!movement) {
            return { message: "Movimentação não encontrada", error: true };
        }

        const item = await Item.findById(movement.item);
        if (!item) {
            // Even if item is gone, we delete the movement record? 
            // Ideally yes, but let's warn. For MVP, just delete.
            await Movement.findByIdAndDelete(id);
            revalidatePath("/movements");
            return { message: "Movimentação excluída (Item não existe mais)", error: false };
        }

        // Reverse Stock Logic
        // If it was IN, we added stock. To reverse, we MUST SUBTRACT.
        // If it was OUT, we removed stock. To reverse, we MUST ADD.

        let newQuantity = item.quantity;
        if (movement.type === "IN") {
            newQuantity = item.quantity - movement.quantity;
            if (newQuantity < 0) {
                return { message: "Impossível excluir: Estoque ficaria negativo", error: true };
            }
        } else { // OUT
            newQuantity = item.quantity + movement.quantity;
        }

        // Update Item and Delete Movement
        await Item.findByIdAndUpdate(item._id, { quantity: newQuantity });
        await Movement.findByIdAndDelete(id);

        revalidatePath("/movements");
        revalidatePath("/items");
        revalidatePath("/");

        return { message: "Movimentação excluída e estoque revertido", error: false };
    } catch (e: any) {
        return { message: e.message, error: true };
    }
}

export async function updateMovement(id: string, prevState: any, formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { message: "Apenas administradores podem editar movimentações", error: true };
        }

        await dbConnect();

        const movement = await Movement.findById(id);
        if (!movement) return { message: "Movimentação não encontrada", error: true };

        // We only allow editing: Date (maybe?), Notes, and... 
        // Changing Quantity/Item/Type is complex because of stock replay. 
        // For MVP, usually deleting and recreating is safer, OR we only allow editing metadata (Notes).
        // BUT user asked to "Edit". Let's assume they might want to fix a typo in quantity or notes.
        // If they change Item or Type, it's a mess. 
        // Let's SUPPORT editing Notes, Destination/Supplier, and Quantity. 
        // Changing Item or Type -> Block for now or complex logic? 
        // Let's keep it simple: Revert old movement, apply new movement (same as delete + create).

        const itemId = formData.get("item") as string;
        const type = formData.get("type") as string;
        const quantity = Number(formData.get("quantity"));

        // If item or type changed, validation logic is needed.
        // Simplest robust way: 
        // 1. Revert 'movement' effect on 'movement.item'
        // 2. Validate new parameters
        // 3. Apply new effect
        // 4. Save

        const oldItem = await Item.findById(movement.item);
        if (!oldItem) return { message: "Item original não encontrado", error: true };

        // 1. Revert
        let tempQuantity = oldItem.quantity;
        if (movement.type === "IN") {
            tempQuantity -= movement.quantity;
        } else {
            tempQuantity += movement.quantity;
        }

        if (tempQuantity < 0) return { message: "Edição inviável: Estoque ficaria negativo ao reverter", error: true };

        // 2. Prepare new data
        const newItemId = itemId || movement.item.toString();
        const newType = type || movement.type;
        const newQty = quantity || movement.quantity;

        const newItem = newItemId === oldItem._id.toString() ? oldItem : await Item.findById(newItemId);
        if (!newItem) return { message: "Novo item não encontrado", error: true };

        // Note: if item changed, 'tempQuantity' applies to 'oldItem'. 'newItem' has its own quantity.
        // This is getting complex. Let's simplify:
        // Update old item stock (Revert)
        await Item.findByIdAndUpdate(oldItem._id, { quantity: tempQuantity });

        // Now 'oldItem' is as if movement never happened.
        // Refetch newItem to get fresh stock (in case oldItem == newItem, it was just updated)
        const freshNewItem = await Item.findById(newItemId);

        // 3. Apply New Effect
        if (newType === "OUT" && freshNewItem.quantity < newQty) {
            // Re-apply original to prevent data corruption? 
            // Yes, rollback the Revert is hard. transaction needed? 
            // MongoDB supports transactions but setup varies.
            // MVP: Try to avoid rollback need. 
            // We just updated oldItem. If fail, we must restore oldItem.
            await Item.findByIdAndUpdate(oldItem._id, { quantity: oldItem.quantity }); // Restore original state
            return { message: `Estoque insuficiente para nova quantidade. Disp: ${freshNewItem.quantity}`, error: true };
        }

        const finalQuantity = newType === "IN"
            ? freshNewItem.quantity + newQty
            : freshNewItem.quantity - newQty;

        await Item.findByIdAndUpdate(newItemId, { quantity: finalQuantity });

        // 4. Update Movement Record
        const supplierId = formData.get("supplier") as string;
        const destination = formData.get("destination") as string;
        const notes = formData.get("notes") as string;

        await Movement.findByIdAndUpdate(id, {
            item: newItemId,
            type: newType,
            quantity: newQty,
            supplier: newType === "IN" ? supplierId : undefined,
            destination: newType === "OUT" ? destination : undefined,
            notes,
            // date: maintain original date? or update? let's keep original date unless passed
        });

        revalidatePath("/movements");
        revalidatePath("/items");
        revalidatePath("/");

        return { message: "Movimentação atualizada", error: false };

    } catch (e: any) {
        return { message: e.message, error: true };
    }
}
