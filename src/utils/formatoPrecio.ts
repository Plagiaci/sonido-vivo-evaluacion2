export const formatearPrecio = (precio: number) =>
  `$${precio.toLocaleString("es-CL")}`;
