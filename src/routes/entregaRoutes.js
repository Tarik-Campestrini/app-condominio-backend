import express from "express";
import {
  criarEntrega,
  listarEntregas,
  listarEntregasPorUsuario,
  atualizarEntrega,
  deletarEntrega,
} from "../controllers/entregaController.js";

const router = express.Router();

// Rota para criar uma entrega
router.post("/", criarEntrega);

// Rota para listar todas as entregas
router.get("/", listarEntregas);

// Rota para listar entregas de um usuário específico
router.get("/:userId", listarEntregasPorUsuario);

// Rota para atualizar o status de uma entrega
router.put("/:id", atualizarEntrega);

// Rota para deletar uma entrega
router.delete("/:id", deletarEntrega);

export default router;
