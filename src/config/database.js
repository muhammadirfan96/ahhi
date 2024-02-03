import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DB_URI;
const database = async () => {
	await mongoose.connect(uri);
};

export default database;
export { uri };
