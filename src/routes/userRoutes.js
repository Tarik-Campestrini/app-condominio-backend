import express from "express";
import { getUsers, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Rota para listar usuários
router.get("/", getUsers);

// Rota para atualizar usuário
router.put("/:id", updateUser);

// Rota para deletar usuário
router.delete("/:id", deleteUser);

export default router;
