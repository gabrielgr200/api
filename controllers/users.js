const express = require('express');
const router = express.Router();
const db = require('./../db/models');


router.post("/register", async (req, res) => {
  var dados = req.body;
  console.log(dados);

  try {
    const dadosUsuario = await db.cadastro.create(dados);

    return res.json({
      mensagem: "Usuario cadastrado com sucesso",
      dadosUsuario,
    });
  } catch (err) {
    return res.json({
      mensagem: "Usuario não foi cadastrado"
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await db.cadastro.findAll({
      attributes: ['id', 'name', 'email', 'password']
    });

    return res.json({
      users
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuários"
    });
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  let user;

  if (identifier.includes('@')) {
    user = await db.cadastro.findOne({ where: { email: identifier } });
  } else {
    user = await db.cadastro.findOne({ where: { name: identifier } });
  }

  if (!user) {
    return res.status(401).json({
      mensagem: "Credenciais inválidas"
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      mensagem: "Credenciais inválidas"
    });
  }

  return res.json({
    mensagem: "Login bem-sucedido",
  });
});

module.exports = router;
