"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "ADMIN";

    const routes = [
        {
            href: "/",
            label: "Dashboard",
            active: pathname === "/",
        },
        {
            href: "/movements",
            label: "Movimentações",
            active: pathname === "/movements",
        },
        {
            href: "/items",
            label: "Itens",
            active: pathname === "/items",
        },
        {
            href: "/suppliers",
            label: "Fornecedores",
            active: pathname === "/suppliers",
        },
        {
            href: "/categories",
            label: "Categorias",
            active: pathname === "/categories",
        },
        {
            href: "/reports",
            label: "Relatórios",
            active: pathname === "/reports",
        },
    ];

    if (isAdmin) {
        routes.push({
            href: "/users",
            label: "Usuários",
            active: pathname === "/users",
        });
    }

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active
                            ? "text-black dark:text-white"
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    );
}
