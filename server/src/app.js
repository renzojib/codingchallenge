// const fs = require('fs')
// const { Employees, Requests } = require('./models')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize } = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

// Sync sequelize and mysql
sequelize.sync() // { force: true } to drop all tables
  .then(() => {
    app.listen(process.env.PORT || 8081)
    console.log(`Server started on port ${config.port}`)
  })

// Importing JSON files into the database

// async function importData () {
//   const rawdata = fs.readFileSync('../json/Employees.json')
//   const rawdata2 = fs.readFileSync('../json/Requests.json')
//   const employeeData = JSON.parse(rawdata)
//   const requestData = JSON.parse(rawdata2)

//   for (const employee of employeeData) {
//     await Employees.create(employee)
//   }
//   for (const request of requestData) {
//     await Requests.create(request)
//   }
// }
// importData()
