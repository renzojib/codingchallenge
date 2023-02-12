const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

// Initialize sequelize
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

// Use fs to read all model files for import
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return file !== 'index.js'
  })
  .forEach((file) => {
    /*
      original code from Cody Seibert
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    */
    // sequelize.import is depreciated so return user in User.js and use require()
    // Import all tables
    const User = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[User.name] = User
  })

// Contains all the models
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
