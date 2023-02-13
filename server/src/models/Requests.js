// Requests table
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Requests', {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    employee_id: {
      type: DataTypes.INTEGER,
      foreignKey: true
    },
    number_of_tickets: DataTypes.INTEGER,
    date_requested: DataTypes.DATE,
    game_date: DataTypes.DATE,
    entry_time: DataTypes.DATE,
    isApproved: DataTypes.STRING
  })
  return User
}
