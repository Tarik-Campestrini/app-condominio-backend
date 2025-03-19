import mongoose from "mongoose";

const entregaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  descricao: { type: String, required: true },
  status: { type: String, enum: ["pendente", "entregue"], default: "pendente" },
  dataEntrega: { type: Date, default: Date.now }
}, { timestamps: true });

const Entrega = mongoose.model("Entrega", entregaSchema);

export default Entrega;
