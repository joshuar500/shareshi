import { Sequelize } from "sequelize";

// TODO: use dotenv to load db values from .env file
const sqlize = new Sequelize("shareshi", "postgres", "", {
  dialect: "postgres"
});

export default sqlize;
