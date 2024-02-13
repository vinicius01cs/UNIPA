const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('automatizacpa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado com sucesso')
} catch (err) {
    console.log(' nao foi possivel conectar: ', err)
}

module.exports = sequelize