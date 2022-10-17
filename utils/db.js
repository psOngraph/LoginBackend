const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sql6527169", "sql6527169", "RAFfLrauZ5", {
  host: "sql6.freemysqlhosting.net",
  dialect: "mysql",
  port: 3306,
});

const sync = async () => {
  await sequelize.sync();
};
module.exports = { sequelize, sync };
