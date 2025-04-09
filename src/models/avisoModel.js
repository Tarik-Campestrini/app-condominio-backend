import mongoose from "mongoose";

const avisosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  titulo: { type: String, required: true },
  mensagem: { type: String, required: true },
  dataAviso: { type: Date, default: Date.now }
}, { timestamps: true });

const Avisos = mongoose.model("Avisos", avisosSchema);

export default Avisos;

