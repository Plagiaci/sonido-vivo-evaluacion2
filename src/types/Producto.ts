export interface Producto {
  id: string;
  categoria: string;
  nombre: string;
  marca: string;
  modelo: string;
  stock: number;
  precio: number;
  descripcion: string;
}

export type Productos = Producto;