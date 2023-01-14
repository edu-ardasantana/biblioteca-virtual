const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
const { Op } = require("sequelize");
const path = require('path');

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

conexaoBD.sequelize.authenticate().then(function(){
    console.log("Conectado!!");
}).catch(function(erro){
    console.log("Erro ao conectar " + erro);
});

// conexaoBD.sequelize.sync({alter:true}); 

// Rotas
app.get('/', (req,res) => {
    res.render('index');
});

app.get('/cadastraLivro', (req,res) =>{
    res.render('cadastraLivro')
});

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
        res.send("Livro removido com sucesso!");
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
app.post('/livro', urlEncodedParser, (req,res) =>{
    var titulo = req.body.titulo;
    var ano = req.body.ano;
    var genero = req.body.genero;

    var novoLivro = {titulo:titulo, ano:ano, genero:genero};

    var livro =  Livro.create(novoLivro).then(function(){
        console.log("Livro inserido com sucesso!");
        res.send("Livro inserido com sucesso!");
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
        tabela = ""
        for(var i=0; i < livros.length; i++){
            tabela += "<div>Resultado da busca:</div>"
			tabela+= "<a href='/atualizaLivro?id="+livros[i].id+"'>Atualizar Livro</a><br>";
			tabela+= "<a href='/deleteLivro?id="+livros[i].id+"'>Remover Livro</a><br>";
			tabela+= "<b>Título</b>: "+livros[i].titulo+"<br>";
			tabela+= "<b>Ano</b>: "+livros[i].ano+"<br>";
			tabela+= "<b>Gênero</b>: "+livros[i].genero+"<br>";
		}

        res.send(tabela);
    }).catch(function(erro){
        console.log("Erro na consulta: " + erro);
        res.send("Ocorreu algum problema na consulta.");
    });
});

app.put('/livro', urlEncodedParser, (req,res) =>{
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
        res.send("Livro atualizado com sucesso!");
    }).catch(function(erro){
        console.log("Erro ao atualizar livro: " + erro);
        res.send("Houve um problema na atualização.");
    });
});

app.listen(port, () => {
    console.log(`Esta aplicação está escutando a porta ${port}`);
});