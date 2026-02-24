import { connect } from "mongoose";
import { DB_URL_LOCAL } from "../../config/config.service.js";

async function testDbConnection() {
  try {
    await connect(DB_URL_LOCAL);
    console.log("DB Connected.");
  } catch (error) {
    console.log("DB Connection Failed.", error);
  }
}

export default testDbConnection;