import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Aplicacion from "./App";
import "../css/style.css";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró el elemento raíz de React.");

createRoot(root).render(
  <StrictMode>
    <Aplicacion />
  </StrictMode>,
);
