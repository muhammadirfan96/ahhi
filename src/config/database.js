import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let uri;
process.env.NODE_ENV === 'production'
    ? (uri = 'mongodb://127.0.0.1:27017/express-server')
    : (uri = process.env.DB_URI);

const database = async () => {
    await mongoose.connect(uri);
};

export default database;
export { uri };
