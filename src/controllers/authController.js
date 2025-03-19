// Faz a importação das bibliotecas
import User from "../models/User.js";
import bcrypt from "bcryptjs";

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

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
};

// Função para realizar o login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário no banco pelo e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!"});
    }

    // Compara a senha digitada com a senha salva no banco de dados
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    // Se a senha estiver correta, retorna os dados do usuário (sem a senha)
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        userId: user.userId,
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
