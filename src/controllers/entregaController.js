import Entrega from "../models/entregaModel.js";

//  Criar uma nova entrega
export const criarEntrega = async (req, res) => {
  try {
    const { userId, descricao, status } = req.body;

    if (!userId || !descricao) {
      return res.status(400).json({ message: "Usuário e descrição são obrigatórios" });
    }

    const novaEntrega = new Entrega({ userId, descricao, status });
    await novaEntrega.save();

    res.status(201).json({ message: "Entrega cadastrada com sucesso!", entrega: novaEntrega });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar entrega", error });
  }
};

//  Buscar todas as entregas
// 🔹 Buscar todas as entregas com informações do usuário
export const listarEntregas = async (req, res) => {
  try {
    const entregas = await Entrega.find().populate("userId", "nome apartamento bloco telefone"); // Popula os dados do usuário
    res.status(200).json(entregas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar entregas", error });
  }
};


//  Buscar entregas por usuário
//  Buscar entregas por usuário com informações do usuário
export const listarEntregasPorUsuario = async (req, res) => {
  try {
    const entregas = await Entrega.find().populate("userId", "nome apartamento bloco telefone");
    res.status(200).json(entregas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar entregas", error });
  }
};

// 🔹 Atualizar dados de uma entrega
export const atualizarEntrega = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, status, dataEntrega, userId } = req.body; // Pegando todos os campos do corpo da requisição

    // Atualizando todos os campos informados
    const entregaAtualizada = await Entrega.findByIdAndUpdate(
      id,
      { descricao, status, dataEntrega, userId },
      { new: true }
    );

    if (!entregaAtualizada) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }

    res.status(200).json({ message: "Entrega atualizada com sucesso!", entrega: entregaAtualizada });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar entrega", error });
  }
};


// 🔹 Deletar uma entrega
export const deletarEntrega = async (req, res) => {
  try {
    const { id } = req.params;
    const entregaRemovida = await Entrega.findByIdAndDelete(id);

    if (!entregaRemovida) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }

    res.status(200).json({ message: "Entrega removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover entrega", error });
  }
};
