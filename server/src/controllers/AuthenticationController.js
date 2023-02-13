const { User, Employees, Requests } = require('../models')

module.exports = {
  async register (req, res) {
    try {
      console.log(req.body)
      await User.create(req.body)
      res.send({
        msg: 'Registration was successful! Log in'
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'This email account is already in use.'
      })
    }
  },
  async login (req, res) {
    try {
      console.log(req.body)
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email
        }
      })
      const isEmployee = await Employees.findOne({
        where: {
          email
        }
      })
      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const { fname, lname } = user
      if (isEmployee) {
        const employee = isEmployee.employee_id
        const isAdmin = isEmployee.isAdmin
        res.send({
          fname,
          lname,
          email,
          isAdmin,
          isEmployee: employee
        })
      } else {
        res.send({
          fname,
          lname,
          email,
          isEmployee: false
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to login'
      })
    }
  },
  async empRequests (req, res) {
    try {
      const id = req.params.id
      const allReqs = await Requests.findAll({
        where: {
          employee_id: id
        }
      })
      const allReqsJson = JSON.parse(JSON.stringify(allReqs))
      res.send({
        requests: allReqsJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured while fetching all requests'
      })
    }
  },
  async allRequests (req, res) {
    try {
      const allReqs = await Requests.findAll({
        include: Employees
      })
      const allReqsJson = JSON.parse(JSON.stringify(allReqs))
      res.send({
        requests: allReqsJson
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured while fetching all requests'
      })
    }
  }
}
