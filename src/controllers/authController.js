// Faz a importação das bibliotecas
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendTemplateMessageCadastrar } from "../services/whatsappService.js"; // ✅ Importação do serviço WhatsApp

// Função para registrar um novo usuário no banco de dados
export const register = async (req, res) => {
  try {
    const { nome, email, password, bloco, apartamento, telefone } = req.body;

    // Verifica se o e-mail já existe no banco de dados
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "E-mail já cadastrado!" });
    }

    // Criptografa a senha antes de armazená-la no banco de dados
    const hashedPassword = await bcrypt.hash(password, 5);

    // Cria um novo usuário com os dados fornecidos no banco de dados
    const newUser = new User({ nome, email, password: hashedPassword, bloco, apartamento, telefone });

    await newUser.save(); // Salva o usuário no banco de dados

    // ✅ Envia notificação via WhatsApp
    try {
      await sendTemplateMessageCadastrar(telefone, nome, email, password);
      console.log(`✅ Mensagem de boas-vindas enviada para: ${telefone}`);
    } catch (whatsErr) {
      console.error("❌ Erro ao enviar WhatsApp:", whatsErr?.response?.data || whatsErr.message);
    }

    // Retorna sucesso
    return res.status(201).json({ message: "Usuário criado com sucesso!" });

  } catch (error) {
    console.error("Erro no cadastro:", error);
    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
};

// Função para realizar o login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário no banco
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // **🔹 Gerar token JWT**
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Retorna dados do usuário + token
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,  // ✅ Agora retornamos o token
      user: {
        nome: user.nome,
        email: user.email,
        bloco: user.bloco,
        apartamento: user.apartamento,
        telefone: user.telefone,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
};