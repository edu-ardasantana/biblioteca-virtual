const conexaoBD = require("../conexaoBD")

const Usuario = conexaoBD.sequelize.define('usuario',{
    login: {
          type: conexaoBD.Sequelize.STRING,
          unique: true,
          allowNull: false
      },
     senha: {
      type: conexaoBD.Sequelize.STRING,
      allowNull: false
    },
  },{ timestamps: false,})
  
  Usuario.sync()
  
  module.exports = Usuario;