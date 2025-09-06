import express from "express";
import bodyParser from "body-parser";
import cors from "cors";          // <-- import cors
import userRoutes from "./routes/userRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

const app = express();

app.use(cors());                // <-- enable CORS for all routes
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/loans", loanRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Micro-Lending API!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Micro-lending API running on http://localhost:${PORT}`);
});
