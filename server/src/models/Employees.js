module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Employees', {
    employee_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
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
