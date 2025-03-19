// Faz a importação 
import User from "../models/User.js";

// Função Buscar todos os usuários do Banco de Dados
export const getUsers = async (req, res) => {
  try {
    // Busca apenas os campos necessários
    const users = await User.find({}, "nome email bloco apartamento telefone");
    res.json(users);
  } catch (error) {

    // Retorna um erro 500 caso falha
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};

// Função para atualizar um usuário pelo ID
import mongoose from "mongoose";

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se o ID é válido antes de tentar atualizar
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário atualizado com sucesso", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
};



// Função para deletar um usuário
export const deleteUser = async (req, res) => {
  try {
      const { id } = req.params;

      // Verifica se o ID fornecido é válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "ID inválido" });
      }

      const user = await User.findByIdAndDelete(id);

      if (!user) {
          return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir usuário" });
  }
};
