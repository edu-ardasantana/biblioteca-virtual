const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');
const bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));

// Página home
// acessar localhost:8080
app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/' + 'public/home.html')
});

// Pesquisa de livros
app.get('/procurarLivro', urlEncodedParser,(req,res) =>{
	
    var nome = req.query.nome;
    var genero = req.query.genero;
    var ano = req.query.ano;

    fs.readFile('meuBD.json','utf8', (erro, texto) =>{
        if (erro) 
            throw "Deu algum erro " + erro;
        var meuBD = JSON.parse(texto);
        var livros = meuBD.livros;
        var encontrado = ''


        if (nome == "" && genero == "" && ano.length > 0){
            encontrado = livros.filter(p => parseInt(p.ano) == ano);
        }else if (nome == "" && genero.length > 0 && ano == ""){
            encontrado = livros.filter(p => p.genero.toLowerCase().includes(genero.toLowerCase()));
        }else if (nome.length > 0 && genero == "" && ano == ""){
            encontrado = livros.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
        }else if (nome == "" && genero.length > 0 && ano.length > 0){
            encontrado = livros.filter(p => p.genero.toLowerCase().includes(genero.toLowerCase()) && parseInt(p.ano) == ano);
        }else if (nome.length > 0 && genero.length > 0 && ano == ""){
            encontrado = livros.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()) && p.genero.toLowerCase().includes(genero.toLowerCase()));
        }else if (nome.length > 0 && genero == "" && ano.length > 0){
            encontrado = livros.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()) && parseInt(p.ano) == ano);
        }else if (nome.length > 0 && genero.length > 0 && ano.length > 0){
            encontrado = livros.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()) && p.genero.toLowerCase().includes(genero.toLowerCase()) && parseInt(p.ano) == ano);
        }
        

        var exibicao = "";

        if (encontrado != ''){
            for (var i = 0; i < encontrado.length; i++){
                exibicao+= "<div><b>Título do Livro:</b> " + encontrado[i].nome + " ";
                exibicao+= "<b>Gênero: </b>" + encontrado[i].genero;
                exibicao+= "<b> Ano de Lançamento</b>: "+ encontrado[i].ano + "<br>";
                exibicao+= "</div><br><br>"
            }
        }else{
            exibicao = "<br><br><p style='text-align: center;'><b>0 resultados encontrados</b><p>"
        }

        

        var header = "<header style= 'background-color: blueviolet; padding 10px; color: #fff; text-align: center;'><h1>BIBLIOTECA VIRTUAL</h1></header>";
        var h2 = "<h2 style='text-align: center;'>Resultados da busca</h2>";
        res.send(header + h2 + exibicao);
    });
    
}); 

// Página de cadastro
app.get('/livro', (req,res) =>{
    res.sendFile(__dirname + '/' + 'public/cadastro.html');
});

app.post('/livro', urlEncodedParser, (req,res) =>{

    var nome = req.body.nome;
    var genero = req.body.genero;
    var ano = req.body.ano;
    var codigo = 0;

    var novoLivro = {codigo: codigo, nome: nome, genero:genero, ano:ano};

    fs.readFile('meuBD.json', 'utf8', (erro,texto) =>{
        if (erro)
            throw "Deu algum erro: " + erro;
        
        var meuBD = JSON.parse(texto);
        novoLivro.codigo = parseInt(meuBD.livros.length) + 1;

        meuBD.livros.push(novoLivro);

        var meuBDString = JSON.stringify(meuBD);

        fs.writeFile('meuBD.json', meuBDString, (erro) =>{
            if (erro)
                throw "Deu algum erro " + erro;
            else
                var header = "<header style= 'background-color: blueviolet; padding 10px; color: #fff; text-align: center;'><h1>BIBLIOTECA VIRTUAL</h1></header>"
                var h2 = "<h2 style='text-align: center;'>Livros Cadastrados</h2>";
                var exibicao = ""
                console.log(meuBD.livros)
                for (var i = 0; i < meuBD.livros.length; i++){
                    exibicao+= "<div><b>Título do Livro:</b> " + meuBD.livros[i].nome + " ";
                    exibicao+= "<b>Gênero: </b>" + meuBD.livros[i].genero;
                    exibicao+= "<b> Ano de Lançamento</b>: "+ meuBD.livros[i].ano + "<br>";
                    exibicao+= "</div><br><br>"
                }
                res.send(header + h2 + exibicao);
        });
    });

});

app.listen(port, () => {
    console.log(`Esta aplicação está escutando a porta ${port}`);
});