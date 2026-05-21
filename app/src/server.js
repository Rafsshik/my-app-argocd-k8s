const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Aplicação rfthz-app rodando com Kubernetes / Argo CD",
    environment: process.env.ENVIRONMENT || "local"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
