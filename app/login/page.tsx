import { LoginForm } from "./login-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Boxes } from "lucide-react";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Boxes className="mr-2 h-6 w-6" />
                    Almoxarifado Lisboa
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Gerenciamento de estoque simplificado e eficiente para o seu negócio.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Acesso ao Sistema Lisboa
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entre com seu email e senha para acessar o painel
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
