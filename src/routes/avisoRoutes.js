import express from "express";
import {
  criarAviso,
  criarAvisoParaTodos,
  listarAvisos,
  listarAvisosPorUsuario,
  atualizarAviso,
  deletarAviso,
} from "../controllers/avisoController.js";

const router = express.Router();

// Rota para criar uma Aviso
router.post("/", criarAviso);

// Rota para enviar aviso a todos os usuários
router.post("/todos", criarAvisoParaTodos);

// Rota para listar todas as Avisos
router.get("/", listarAvisos);

// Rota para listar Avisos de um usuário específico
router.get("/:userId", listarAvisosPorUsuario);

// Rota para atualizar o status de uma Aviso
router.put("/:id", atualizarAviso);

// Rota para deletar uma Aviso
router.delete("/:id", deletarAviso);

export default router;