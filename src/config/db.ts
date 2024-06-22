import { exit } from "node:process";
import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URL);
    const url = `${connection.host}:${connection.port}`;

    console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.log(
      colors.bgRed(`Error al conectar a la base de datos: ${error.message}`)
    );
    exit(1);
  }
};
