import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import entregaRoutes from "./src/routes/entregaRoutes.js";
import avisoRoutes from "./src/routes/avisoRoutes.js"
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/entregas", entregaRoutes);
app.use("/api/avisos", avisoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Conectado na Port", PORT);
  
});
