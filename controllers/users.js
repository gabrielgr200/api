const express = require('express');
const router = express.Router();
const db = require('./../db/models');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'U3#2w$Gs9aBv^67z8Nl!Tq1m5Op&*JkR';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
};

router.post("/register", async (req, res) => {
  var dados = req.body;
  console.log(dados);

  try {
    const dadosUsuario = await db.cadastro.create(dados);
    return res.json({
      mensagem: "Usuario cadastrado com sucesso",
      dadosUsuario
    });
  } catch (err) {
    return res.json({
      mensagem: "Usuario não foi cadastrado"
    });
  }
});

router.get("/users/:id", verifyToken, async (req, res) => {
    const { id } = req.user; // Get the user ID from the token payload
  
    try {
      const user = await db.cadastro.findByPk(id, {
        attributes: ['name', 'email', 'password']
      });
  
      if (user) {
        return res.json({
          user
        });
      } else {
        return res.status(404).json({
          mensagem: "Usuário não encontrado"
        });
      }
    } catch (err) {
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
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    SECRET_KEY,
    { expiresIn: '7d' }
  );

  return res.json({
    mensagem: "Login bem-sucedido",
    token
  });
});

module.exports = router;
