const conexaoBD = require("../conexaoBD");

const Livro = conexaoBD.sequelize.define('livro', {
    titulo: {
        type: conexaoBD.Sequelize.STRING
    },
    ano: {
        type: conexaoBD.Sequelize.INTEGER
    },
    genero: {
        type: conexaoBD.Sequelize.STRING
    }
});

module.exports = Livro;