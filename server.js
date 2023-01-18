const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
const { Op } = require("sequelize");
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const jwtConfig = require("./config/jwt")

const validaToken= require('./auth')


// Visualizações
app.use(express.static(path.join(__dirname, '/public')));

const exphbs = require('express-handlebars');
app.use(express.static(path.join(__dirname, '/views')));
app.set('views', path.join(__dirname, '/views'));
app.engine('hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: path.join(__dirname, 'views/layouts')
    })
);
app.set('view engine', 'hbs');

// Conexão banco de dados
const conexaoBD = require("./conexaoBD.js");

const Livro = require("./models/Livro");
const Usuario = require("./models/Usuario")
const { parse } = require('path');

conexaoBD.sequelize.authenticate().then(function(){
    console.log("Conectado!!");
}).catch(function(erro){
    console.log("Erro ao conectar " + erro);
});

// conexaoBD.sequelize.sync({alter:true}); 

// Rotas

app.post("/login", urlEncodedParser, async (req, res, next) => {
    const usuario = await Usuario.findOne({
        where: {
            login: req.body.login
        }
    })

    console.log(req.body.Senha)
    // console.log(usuario.senha)


    if (usuario) {
        const senha_valida = await bcrypt.compare(req.body.Senha, usuario.senha)

        if (senha_valida) {
            token = jwt.sign({ "id": usuario.id, "login": usuario.login },
                jwtConfig.secret)
            res.status(200).json({ token: token });
        } else {
            res.status(400).json({ error: "Senha Incorreta!" });
        }
    } else {
        res.status(404).json({ error: "Usuário não cadastrado!" });
    }
});

app.post('/usuario', urlEncodedParser, async (req, res) => {

    const isExist = await Usuario.findOne({  
        where:{
            login:req.body.login
        }
    })

    if(isExist){
        return res.status(400).json({error:"Usuário já cadastrado!"})
    }

    const salt = await bcrypt.genSalt(10)

    const hashed_password = await bcrypt.hash(req.body.senha, salt);



    var login = req.body.login;
    var senha = hashed_password;

    var novoUsuario = { login: login, senha: senha };

    console.log(novoUsuario)

    var usuario = Usuario.create(novoUsuario).then(function () {

        token = jwt.sign({"id":usuario.id,"login":usuario.login},
        jwtConfig.secret)
         res.status(200).json({ token : token });


        console.log("Usuário inserido com sucesso!");
        // res.render('index');
    }).catch(function (erro) {
        console.log("Erro ao inserir. "+ erro);
        res.send("Houve um problema.");
    })
})

// app.use("*",validaToken)

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/home', (req,res)=>{
    res.render('home');
});

app.get('/cadastraLivro', (req,res) =>{
    res.render('cadastraLivro')
});

app.get('/cadUsuario', (req, res) => {
    res.render('cadUsuario')
});

app.get('/consultaUsuario', (req, res)=>{
    res.render('consultaUsuario')
})

app.get('/buscaLivro', (req,res) =>{
    res.render('buscaLivro');
});

app.get('/deleteLivro', (req,res) =>{
    var id = req.query.id;

    Livro.destroy({
        where:{
            id:id
        }
    }).then(function(livros){
        console.log("Livro removido com sucesso");
        res.render('respDelete');
    }).catch(function(erro){
        console.log("Erro na remoção: " + erro);
        res.send("Ocorreu algum problema na remoção");
    });
})

app.get('/atualizaLivro', (req,res) =>{
    var id = req.query.id;

    Livro.findOne({
        where: {
            id:id
        }
    }).then(function(livro){
        res.render('atualizaLivro', {livro,livro})
    }).catch(function(erro){
        console.log("Erro na consulta: " + erro);
        res.send("Ocorreu um erro.")
    });
});




// Verbos HTTP

app.get('/usuario', (req, res) => {
    var login = req.query.login;

    Usuario.findAll({
        where: {
            login: {
                [Op.substring]:login
            }
        }
    }).then(function (usuarios) {
        res.render('resultado2',{listaUsuario:usuarios})
    })
})

app.post('/livro', urlEncodedParser, (req,res) =>{
    var titulo = req.body.titulo;
    var ano = req.body.ano;
    var genero = req.body.genero;

    var novoLivro = {titulo:titulo, ano:ano, genero:genero};

    var livro =  Livro.create(novoLivro).then(function(){
        console.log("Livro inserido com sucesso!");
        res.render('respCadastro');
    }).catch(function(erro){
        console.log("Erro ao inserir livro: " + erro);
        res.send("Houve um problema no cadastro do livro.");
    });
});



app.get('/livro', (req,res) =>{
    var titulo = req.query.titulo;
    var ano = req.query.ano;
    var genero = req.query.genero;

    Livro.findAll({
        where:{
            titulo: {
                [Op.substring]:titulo
            },
            ano: {
                [Op.substring]:ano
            },
            genero: {
                [Op.substring]: genero
            }
        }
    }).then(function(livros){
        // console.log(livros);
        res.render('resultadoBusca', {lista:livros});
    }).catch(function(erro){
        console.log("Erro na consulta: " + erro);
        res.send("Ocorreu algum problema na consulta.");
    });
});


app.post('/upLivro', urlEncodedParser, (req,res) =>{
    var id = req.body.id;

    var titulo = req.body.titulo;
    var ano = req.body.ano;
    var genero = req.body.genero;

    var livroAtualizado = {id:id, titulo:titulo, ano:ano, genero:genero};

    var livro = Livro.update(livroAtualizado,{
        where: {
            id:id
        }
    }).then(function(){
        console.log("Livro atualizado com sucesso!");
        res.render('respAtualiza');
    }).catch(function(erro){
        console.log("Erro ao atualizar livro: " + erro);
        res.send("Houve um problema na atualização.");
    });
});


app.listen(port, () => {
    console.log(`Esta aplicação está escutando a porta ${port}`);
});