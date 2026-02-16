import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Boxes, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
                <div className="container flex h-14 items-center">
                    {/* Mobile Nav */}
                    <div className="md:hidden mr-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetTitle className="mb-4 flex items-center gap-2 font-bold text-lg">
                                    <Boxes className="w-6 h-6" /> Almoxarifado
                                </SheetTitle>
                                <MainNav className="flex-col items-start space-x-0 space-y-4" />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="mr-4 hidden md:flex">
                        <a className="mr-6 flex items-center space-x-2" href="/">
                            <Boxes className="h-6 w-6" />
                            <span className="hidden font-bold sm:inline-block">
                                Almoxarifado
                            </span>
                        </a>
                        <MainNav />
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </main>
            <footer className="border-t py-4 print:hidden">
                <div className="container flex flex-col items-center justify-between gap-2 md:h-14 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Lisboa Informática e Sistemas 2026 - <a href="https://lisboainformatica.github.io/lisboainfo/" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">https://lisboainformatica.github.io/lisboainfo/</a>
                    </p>
                    <div className="flex items-center gap-1">
                        <a href="https://wa.me/5573981667518" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-green-600 flex items-center gap-2">
                            Abertura de Chamado (WhatsApp)
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
