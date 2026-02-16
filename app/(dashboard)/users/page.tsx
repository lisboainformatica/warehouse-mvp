import { getUsers } from "@/lib/actions/user";
import { UserDialog } from "@/components/users/user-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "@/components/users/user-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UsersPage() {
    const users = await getUsers();
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
                {isAdmin && <UserDialog />}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Nível</TableHead>
                                {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u: any) => (
                                <TableRow key={u._id}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        {u.role === "ADMIN" ? (
                                            <Badge variant="default">Administrador</Badge>
                                        ) : (
                                            <Badge variant="secondary">Usuário</Badge>
                                        )}
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <UserActions id={u._id} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {!isAdmin && (
                <p className="text-sm text-muted-foreground text-center">
                    Apenas administradores podem gerenciar usuários.
                </p>
            )}
        </div>
    );
}
