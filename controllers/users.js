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

router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.cadastro.findOne({
      where: { id },
      attributes: ['id', 'name', 'email', 'password'] 
    });

    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    return res.json({
      user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuário"
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

router.delete("/users/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const user = await db.cadastro.findOne({ where: { name } });

    if (!user) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado"
      });
    }

    
    await user.destroy();

    return res.json({
      mensagem: "Conta do usuário excluída com sucesso"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      mensagem: "Erro ao excluir a conta do usuário"
    });
  }
});

module.exports = router;
