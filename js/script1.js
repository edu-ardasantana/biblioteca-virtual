class Livros {

    constructor(){
        this.id = 1;
        this.arrayLivros =[];
        this.editId = null;



    }
    salvar(){
        let livro = this.lerDados();


        if(this.validaCampos(livro)){
            if(this.editId == null){
                this.adicionar(livro);
            }else{
                this.atualizar(this.editId,livro);
            }
           
        }

        this.listaTabela();
        this.cancelar();
    }
    listaTabela(){
        let tbody = document.getElementById("tbody");
        tbody.innerText = " ";
        for(let i = 0 ; i < this.arrayLivros.length; i++){
            let tr = tbody.insertRow();

            let td_id = tr.insertCell();
            let td_nome= tr.insertCell();
            let td_acoes = tr.insertCell();

            td_id.innerText = this.arrayLivros[i].id;
            td_nome.innerText = this.arrayLivros[i].nomeLivro;     
            
            td_id.classList.add("center");

            let imgEdit = document.createElement("img");
            imgEdit.src= "img/edit.png";
            imgEdit.setAttribute('onclick','livros.preparaEditacao('+ JSON.stringify( this.arrayLivros[i] ) +')');

            let imgDelete = document.createElement("img");
            imgDelete.src= "img/excluir.png";
            imgDelete.setAttribute('onclick','livros.deletar('+ this.arrayLivros[i].id +')');

            td_acoes.appendChild(imgEdit);
            td_acoes.appendChild(imgDelete);

        }
    }
    adicionar(livro){
        this.arrayLivros.push(livro);
        this.id ++;

    }
    atualizar(id,livro){
        for (let i = 0; i < this.arrayLivros.length ; i++){
            if(this.arrayLivros[i].id == id){
                this.arrayLivros[i].nomeLivro = livro.nomeLivro;
            }
        }
    }
    preparaEditacao(dados){
        this.editId = dados.id;

       document.getElementById("livro").value = dados.nomeLivro;
        document.getElementById("btn1").innerText ="Atualizar";

    }
    lerDados(){
        let livro={}

        livro.id = this.id;
        livro.nomeLivro = document.getElementById('livro').value;

        return livro;

    }
    validaCampos(livro){
        let msg = " ";

        if(livro.nomeLivro == ''){
            msg += " - Informe o nome do livro \n ";

        }
        if(msg !=" "){
            alert(msg);
            return false
        }
        return true;
    }
    cancelar(){
        document.getElementById("livro").value = " ";
        document.getElementById("btn1").innerText ="Salvar";
        this.editId = null;

    }

    deletar(id){
        if(confirm("Deseja realmente deletar o livro de ID  " + id )){
        let tbody = document.getElementById("tbody");

        for (let i = 0 ; i < this.arrayLivros.length; i++){
            if (this.arrayLivros[i].id == id){
                this.arrayLivros.splice(i, 1);
                tbody.deleteRow(i);
            }
        }

    } 
    }
    

}

var livros= new Livros()