require('dotenv').config()
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado com sucesso')
} catch (err) {
    console.log(' nao foi possivel conectar: ', err)
}

module.exports = sequelize