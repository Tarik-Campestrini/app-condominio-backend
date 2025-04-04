import Entrega from "../models/entregaModel.js";
import User from "../models/User.js"; //
import { sendTemplateMessageEntrega } from "../services/whatsappService.js";



//  Criar Entrega
// Criar Entrega
export const criarEntrega = async (req, res) => {
  try {
      // Verifica se a data foi enviada, senão usa a data atual
      const dataEntrega = req.body.dataEntrega 
          ? new Date(req.body.dataEntrega) 
          : new Date();

      // Formata a data para salvar corretamente no banco
      const dataEntregaFormatada = dataEntrega.toISOString(); // Mantém padrão UTC no banco

      // Criar a nova entrega com a data formatada
      const novaEntrega = await Entrega.create({
          ...req.body,
          dataEntrega: dataEntregaFormatada
      });

      console.log(JSON.stringify(novaEntrega, null, 2));

      // Verificar se novaEntrega possui userId
      if (!novaEntrega.userId) {
          return res.status(400).json({ message: "Usuário associado não informado" });
      }

      // Buscar os dados do usuário associado à entrega
      const usuario = await User.findById(novaEntrega.userId);
      if (!usuario) {
          return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Formatar a data para exibição no WhatsApp
      const dataEntregaParaWhatsApp = new Intl.DateTimeFormat("pt-BR").format(dataEntrega);

      try {
          // Enviar notificação via WhatsApp
          await sendTemplateMessageEntrega(usuario.telefone, usuario.nome, novaEntrega.descricao, dataEntregaParaWhatsApp);
          console.log(`Notificação enviada para: ${usuario.telefone}`);
      } catch (whatsappError) {
          console.error("Erro ao enviar notificação pelo WhatsApp:", whatsappError);
      }

      res.status(201).json(novaEntrega);
  } catch (error) {
      console.error("Erro ao cadastrar entrega:", error);
      res.status(500).json({ message: "Erro ao cadastrar entrega", error });
  }
};





//  Buscar todas as entregas
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
    const { descricao, status, dataEntrega, userId } = req.body;

    // Atualizar os dados da entrega
    const entregaAtualizada = await Entrega.findByIdAndUpdate(
      id,
      { descricao, status, dataEntrega, userId },
      { new: true }
    );

    if (!entregaAtualizada) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }

    // 🔹 Buscar dados do usuário para enviar WhatsApp
    const usuario = await Usuario.findById(userId);
    if (usuario) {
      const phoneNumber = `55${usuario.telefone}`;
      const nome = usuario.nome;
      const entrega = descricao;
      const data = dataEntrega || new Date().toLocaleDateString("pt-BR");

      // 🔹 Enviar mensagem via WhatsApp
      await sendTemplateHelloWorld(phoneNumber, nome, entrega, data);
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
