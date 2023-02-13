const AuthenticationController = require('./controllers/AuthenticationController')

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

module.exports = (app) => {
  app.post('/register', AuthenticationControllerPolicy.register, AuthenticationController.register)
  app.post('/login', AuthenticationController.login)
  // app.get('/getemp/:id', AuthenticationController.getEmp) No longer needed
  app.get('/notadmin/:id', AuthenticationController.empRequests)
  app.get('/isadmin', AuthenticationController.allRequests)
}
