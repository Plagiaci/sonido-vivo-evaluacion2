export function Mensaje({
  texto,
  tipo = "danger",
}: {
  texto: string;
  tipo?: "danger" | "success";
}) {
  if (!texto) return null;
  return (
    <div className={`alert alert-${tipo} mt-4`} role="status">
      {texto}
    </div>
  );
}
