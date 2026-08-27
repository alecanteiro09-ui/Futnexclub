"use client";

// Último recurso: captura erros que escapam de todo o resto da árvore (inclusive
// o layout raiz). Precisa ser autocontido — sem depender de providers do app.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#0b0b0f",
          color: "#f5f5f5",
        }}
      >
        <p style={{ fontSize: "18px", fontWeight: 700 }}>Algo deu errado.</p>
        <p style={{ fontSize: "14px", color: "#a1a1aa", maxWidth: "420px" }}>
          {error.message || "Ocorreu um erro inesperado. Tente novamente."}
        </p>
        <button
          onClick={() => reset()}
          style={{
            borderRadius: "10px",
            background: "#e11d48",
            color: "#fff",
            fontWeight: 600,
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
