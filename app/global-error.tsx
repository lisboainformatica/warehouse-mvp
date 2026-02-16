'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
          <h2 className="text-2xl font-bold">Algo deu errado!</h2>
          <p className="text-muted-foreground">{error.message || "Erro desconhecido"}</p>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
      </body>
    </html>
  );
}
