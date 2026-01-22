import 'dotenv/config';
import mongoose from 'mongoose';

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI! || '');
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    connection.on('error', (err) => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);

      process.exit();
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    // console.error("Error connecting to MongoDB:", error);
    console.log('Something goes wrong');
    console.log(error);
  }
}
