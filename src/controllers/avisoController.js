import Aviso from "../models/avisoModel.js";
import User from "../models/User.js";
import mongoose from "mongoose";
//import { sendTemplateMessageAviso } from "../services/whatsappService.js";

export const criarAviso = async (req, res) => {
  try {
      const { titulo, menssagem, userId } = req.body;

      if (!titulo || !menssagem) {
          return res.status(400).json({ message: "Título e mensagem são obrigatórios" });
      }

      if (userId === "todos") {
          console.log("Criando um único aviso para todos os usuários...");

          // Criar um único aviso para todos
          const novoAviso = await Aviso.create({ titulo, menssagem, userId: "todos" });

          // Buscar todos os usuários que têm telefone para enviar WhatsApp
          const usuarios = await User.find({ telefone: { $exists: true, $ne: null } });

          // Essa função não está sendo utilizada no momento, mas pode ser utilizada para enviar mensagens de aviso
          /*
          // Enviar mensagem para cada usuário via WhatsApp
          await Promise.all(
              usuarios.map((usuario) => 
                  sendTemplateMessageAviso(usuario.telefone, usuario.nome, menssagem)
              )
          ); */

          console.log("Aviso criado e mensagens enviadas.");
          return res.status(201).json({ message: "Aviso criado para todos os usuários", aviso: novoAviso });
      } else {
          console.log(`Criando aviso para usuário específico: ${userId}`);

          // Buscar usuário específico
          const usuario = await User.findById(userId);
          if (!usuario) {
              return res.status(404).json({ message: "Usuário não encontrado" });
          }

          // Criar aviso para um usuário específico
          const novoAviso = await Aviso.create({ titulo, menssagem, userId });

          // Esse trecho de código não está sendo utilizado no momento, mas pode ser utilizado para enviar mensagens de aviso
          /*
          // Enviar WhatsApp apenas para esse usuário, se ele tiver telefone
          if (usuario.telefone) {
              await sendTemplateMessageAviso(usuario.telefone, usuario.nome, menssagem);
          } */


          return res.status(201).json({ message: "Aviso criado e enviado com sucesso", aviso: novoAviso });
      }
  } catch (error) {
      console.error("Erro ao criar aviso:", error);
      res.status(500).json({ message: "Erro ao criar aviso", error: error.message });
  }
};






export const criarAvisoParaTodos = async (req, res) => {
  try {
      const { titulo, menssagem } = req.body;

      if (!titulo || !menssagem) {
          return res.status(400).json({ message: "Título e mensagem são obrigatórios." });
      }

      // Criar um único aviso para todos os usuários
      const novoAviso = await Aviso.create({ titulo, menssagem, userId: "todos" });

      // Buscar todos os usuários para enviar mensagem no WhatsApp
      const usuarios = await User.find({ telefone: { $exists: true, $ne: null } });

      // Enviar mensagem no WhatsApp para cada usuário que tem telefone
      // Essa função não está sendo utilizada no momento, mas pode ser utilizada para enviar mensagens de aviso
      /*      
      await Promise.all(
          usuarios.map((usuario) => 
              sendTemplateMessageAviso(usuario.telefone, usuario.nome, menssagem)
          )
      );
      */


      res.status(201).json(novoAviso);
  } catch (error) {
      console.error("Erro ao criar aviso:", error);
      res.status(500).json({ message: "Erro ao criar aviso", error: error.message });
  }
};




//  Buscar todos os Avisos com informações do usuário
export const listarAvisos = async (req, res) => {
  try {
    const Avisos = await Aviso.find().populate("userId", "nome apartamento bloco telefone"); // Popula os dados do usuário
    res.status(200).json(Avisos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar Avisos", error });
  }
};


//  Buscar Avisos por usuário
export const listarAvisosPorUsuario = async (req, res) => {
  try {
    const Avisos = await Avisos.find().populate("userId", "nome apartamento bloco telefone");
    res.status(200).json(Avisoss);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar Avisoss", error });
  }
};

// 🔹 Atualizar dados de um Avisos
export const atualizarAviso = async (req, res) => {
  try {
    const { id } = req.params;
    let { titulo, menssagem, userId } = req.body;

    // Se userId for "todos", removemos ele da atualização
    if (userId === "todos") {
      console.warn("userId recebido como 'todos', removendo da atualização.");
      userId = undefined;
    }

    // Se userId for passado, validamos se é um ObjectId válido
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido" });
    }

    const avisoAtualizado = await Aviso.findByIdAndUpdate(
      id,
      { titulo, menssagem, ...(userId && { userId }) },
      { new: true }
    );

    if (!avisoAtualizado) {
      return res.status(404).json({ message: "Aviso não encontrado" });
    }

    res.status(200).json(avisoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar aviso:", error);
    res.status(500).json({ message: "Erro ao atualizar aviso", error });
  }
};


// 🔹 Deletar um Aviso
export const deletarAviso = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Recebida solicitação para deletar ID: ${id}`);

    // Se o ID for "todos", deletar todos os avisos globais
    if (id === "todos") {
      const avisosDeletados = await Aviso.deleteMany({ userId: "todos" });

      if (avisosDeletados.deletedCount === 0) {
        console.log("Nenhum aviso global encontrado para deletar.");
        return res.status(404).json({ message: "Nenhum aviso global encontrado." });
      }

      console.log(`Avisos globais deletados: ${avisosDeletados.deletedCount}`);
      return res.status(200).json({ message: `${avisosDeletados.deletedCount} avisos removidos com sucesso!` });
    }

    // Se não for "todos", validar como ObjectId normal
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("ID inválido");
      return res.status(400).json({ message: "ID inválido" });
    }

    const aviso = await Aviso.findById(id);
    if (!aviso) {
      console.log("Aviso não encontrado");
      return res.status(404).json({ message: "Aviso não encontrado" });
    }

    console.log("Aviso encontrado, deletando...");
    await Aviso.findByIdAndDelete(id);
    console.log("Aviso deletado com sucesso!");

    res.status(200).json({ message: "Aviso removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover aviso:", error);
    res.status(500).json({ message: "Erro ao remover aviso", error: error.message });
  }
};
