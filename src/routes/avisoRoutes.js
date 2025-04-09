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

router.post("/avisos/para-todos", criarAvisoParaTodos);

// Rota para criar um aviso (para um usuário ou para todos)
router.post("/", criarAviso);

// Rota para listar todos os avisos
router.get("/", listarAvisos);

// Rota para listar avisos de um usuário específico
router.get("/:userId", listarAvisosPorUsuario);

// Rota para atualizar um aviso
router.put("/:id", atualizarAviso);

// Rota para deletar um aviso
router.delete("/:id", deletarAviso);

export default router;
