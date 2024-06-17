import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://nourantareqmohamed:HHvw8soG2oa2mok7@nouranscluster0.4zfzjbg.mongodb.net/company');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

export default connectDB;
