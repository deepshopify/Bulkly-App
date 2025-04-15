import { Sequelize } from 'sequelize';
import envC from 'dotenv';
envC.config();

// Setup Sequelize with dynamic config
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false,
});

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('#### Database connection established successfully. ####');
    await sequelize.sync({ alter: false });
    console.log('#### Database synchronized successfully. ####');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

syncDatabase();

export default sequelize;