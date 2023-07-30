const express = require('express');
const router = express.Router();
const db = require('./../db/models');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) =>{

    var dados = req.body;
    console.log(dados);

    await db.cadastro.create(dados).then((dadosUsuario) =>{
        return res.json({
            mensagem: "Usuario cadastrado com sucesso",
            dadosUsuario
        });
    }).catch(() =>{
        return res.json({
            mensagem: "Usuario não foi cadastrado"
        });
    });

      
});

router.get("/users", async (req, res) =>{
    const users = await db.cadastro.findAll({

        attributes: ['name', 'email', 'password'],

        order: [['id', 'DESC']]
    });
     
    if(users){
        return res.json({
            users
        });
    }else{
        return res.status(400).json({
            mensagem: "Usuario não foi cadastrado"
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
        'U3#2w$Gs9aBv^67z8Nl!Tq1m5Op&*JkR', 
        { expiresIn: '7d' } 
      );

    return res.json({
        mensagem: "Login bem-sucedido"
    });
});


router.get("/users", async (req, res) => {
  
    const users = await db.cadastro.findAll({
        attributes: ['name', 'email', 'password', 'token'],
        order: [['id', 'DESC']]
    });

    if (users) {
        return res.json({
            users
        });
    } else {
        return res.status(400).json({
            mensagem: "Nenhum usuário encontrado"
        });
    }
});

module.exports = router;