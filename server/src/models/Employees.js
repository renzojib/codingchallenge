module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Employees', {
    employee_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    department: DataTypes.STRING,
    isAdmin: DataTypes.STRING
  })
  return User
}
