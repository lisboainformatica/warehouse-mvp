'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-center h-full">
      <h2 className="text-2xl font-bold">Erro no Dashboard</h2>
      <p className="text-muted-foreground">{error.message || "Ocorreu um erro ao carregar o painel."}</p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
