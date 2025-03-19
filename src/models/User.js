import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloco: { type: String, required: true },
  apartamento: { type: String, required: true },
  telefone: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
