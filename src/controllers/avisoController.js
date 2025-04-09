import Aviso from "../models/avisoModel.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendTemplateMessageAviso } from "../services/whatsappService.js";


export const criarAviso = async (req, res) => {
  try {
    const { titulo, mensagem, userId } = req.body;

    if (!titulo || !mensagem) {
      return res.status(400).json({ mensagem: "Título e mensagem são obrigatórios" });
    }

    // Aviso para todos os usuários
    if (userId === "todos") {
      console.log("Criando aviso para todos os usuários...");

      const usuarios = await User.find({ telefone: { $exists: true, $ne: "" } });

      const promessas = usuarios.map(async (user) => {
        await Aviso.create({
          titulo,
          mensagem,
          userId: user._id,
          dataAviso: new Date(),
        });

        await sendTemplateMessageAviso(user.telefone, user.nome, mensagem);
      });

      await Promise.all(promessas);

      return res.status(201).json({ mensagem: "Avisos criados e enviados para todos os usuários!" });
    }

    // Aviso individual
    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const novoAviso = await Aviso.create({
      titulo,
      mensagem,
      userId,
      dataAviso: new Date(),
    });

    if (usuario.telefone) {
      await sendTemplateMessageAviso(usuario.telefone, usuario.nome, mensagem);
    }

    return res.status(201).json({ mensagem: "Aviso criado com sucesso", aviso: novoAviso });

  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    res.status(500).json({ mensagem: "Erro ao criar aviso", error: error.message });
  }
};


export const criarAvisoParaTodos = async (req, res) => {
  try {
    const { titulo, mensagem, dataAviso } = req.body;

    const usuarios = await User.find();

    const promessas = usuarios.map(async (user) => {
      const novoAviso = new Aviso({
        titulo,
        mensagem,
        dataAviso,
        userId: user._id,
      });

      await novoAviso.save();

      if (user.telefone) {
        await enviarWhatsApp({
          numero: user.telefone,
          mensagem: `📢 *${titulo}*\n\n${mensagem}`,
        });
      }
    });

    await Promise.all(promessas);

    res
      .status(201)
      .json({ mensagem: "Avisos criados e enviados com sucesso para todos!" });
  } catch (error) {
    console.error("Erro ao criar avisos para todos:", error);
    res.status(500).json({ erro: "Erro ao criar avisos para todos os usuários" });
  }
};


//  Buscar todos os Avisos com informações do usuário
export const listarAvisos = async (req, res) => {
  try {
    let avisos = await Aviso.find().populate("userId", "nome apartamento bloco telefone");

    // Inserir nome fictício quando userId for "todos"
    avisos = avisos.map((aviso) => {
      if (aviso.userId === "todos" || aviso.userId === null) {
        return {
          ...aviso.toObject(),
          userId: {
            nome: "Todos os usuários",
            apartamento: "-",
            bloco: "-",
            telefone: "-"
          }
        };
      }
      return aviso;
    });

    res.status(200).json(avisos);
  } catch (error) {
    console.error("Erro ao buscar Avisos:", error);
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
    let { titulo, mensagem, userId } = req.body;

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
      { titulo, mensagem, ...(userId && { userId }) },
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
