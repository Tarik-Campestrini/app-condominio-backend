import Aviso from "../models/avisoModel.js";
import User from "../models/User.js";

export const criarAviso = async (req, res) => {
  try {
      const { titulo, menssagem, userId } = req.body;

      if (!titulo || !menssagem) {
          return res.status(400).json({ message: "Título e mensagem são obrigatórios" });
      }

      if (userId === "todos") {
          console.log("Criando aviso para todos os usuários...");

          // Busca todos os usuários
          const usuarios = await User.find();
          if (!usuarios.length) {
              return res.status(400).json({ message: "Nenhum usuário encontrado" });
          }

          console.log(`Usuários encontrados: ${usuarios.length}`);

          // Cria um aviso para cada usuário
          const avisosCriados = await Promise.all(
              usuarios.map(async (usuarios) => {
                  return await Aviso.create({ titulo, menssagem, userId: usuarios._id });
              })
          );

          console.log("Avisos criados:", avisosCriados.length);

          return res.status(201).json({ message: "Avisos criados para todos os usuários", avisos: avisosCriados });
      } else {
          console.log(`Criando aviso para usuário específico: ${userId}`);

          // Criar aviso para um único usuário
          const novoAviso = await Aviso.create({ titulo, menssagem, userId });

          return res.status(201).json({ message: "Aviso criado com sucesso", aviso: novoAviso });
      }
  } catch (error) {
      console.error("Erro ao criar aviso:", error);
      res.status(500).json({ message: "Erro ao criar aviso", error });
  }
};





export const criarAvisoParaTodos = async (req, res) => {
  try {
    
    const { titulo, menssagem } = req.body;

    if (!titulo || !menssagem) {
      return res.status(400).json({ message: "Título e mensagem são obrigatórios." });
    }

    // Buscar todos os usuários
    const usuarios = await User.find();  

    if (usuarios.length === 0) {
      return res.status(400).json({ message: "Nenhum usuário encontrado." });
    }

    // Criar um aviso para cada usuário
    const avisos = usuarios.map(user => ({
      userId: user._id,
      titulo,
      menssagem
    }));

    // Salvar todos os avisos de uma vez
    await Aviso.insertMany(avisos);

    res.status(201).json({ message: "Avisos enviados para todos os usuários!" });

  } catch (error) {
    console.error("Erro ao cadastrar avisos:", error);  // Mostra o erro no console do backend
    res.status(500).json({ message: "Erro ao cadastrar avisos", error: error.message });
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

    // Pegando todos os campos do corpo da requisição
    const { id } = req.params;
    const { titulo, menssagem, dataAviso, userId } = req.body; 

    // Atualizando todos os campos informados
    const AvisoAtualizado = await Aviso.findByIdAndUpdate(
      id,
      { titulo, menssagem, dataAviso, userId },
      { new: true }
    );

    if (!AvisoAtualizado) {
      return res.status(404).json({ message: "Aviso não encontrada" });
    }

    res.status(200).json({ message: "Aviso atualizado com sucesso!", Avisos: AvisoAtualizado });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar Aviso", error });
  }
};


// 🔹 Deletar um Aviso
export const deletarAviso = async (req, res) => {
  try {
    const { id } = req.params;
    const AvisoRemovido = await Avisos.findByIdAndDelete(id);

    if (!AvisoRemovido) {
      return res.status(404).json({ message: "Aviso não encontrado" });
    }

    res.status(200).json({ message: "Aviso removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover Aviso", error });
  }
};
