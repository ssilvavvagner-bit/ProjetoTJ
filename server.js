// server.js
const express = require("express");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Rota que busca as notícias em destaque no TJRS
app.get("/api/noticias-destaque", async (req, res) => {
  try {
    const response = await fetch("https://www.tjrs.jus.br/novo/");
    const html = await response.text();

    const $ = cheerio.load(html);

    // Pega todos os <li> que têm onclick="showSlide(...)"
    const noticias = [];
    $('li[onclick^="showSlide"]').each((i, el) => {
      const titulo = $(el).text().trim();
      if (titulo) {
        noticias.push({
          ordem: i,
          titulo,
        });
      }
    });

    res.json({
      atualizadoEm: new Date().toISOString(),
      quantidade: noticias.length,
      noticias,
    });
  } catch (err) {
    console.error("Erro ao buscar TJRS:", err);
    res.status(500).json({ error: "Erro ao buscar dados do TJRS" });
  }
});

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
