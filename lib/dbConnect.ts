import mongoose from "mongoose";

type ConnectionObj = {
  isConnected?: number | null;
};

const connection: ConnectionObj = {};

const dbConnect = async () => {
  // If already connected, skip the connection process
  if (connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  // Ensure MONGO_DB_URI is defined
  const mongoURI = process.env.MONGO_DB_URI;

  if (!mongoURI) {
    console.error("MongoDB URI is not defined in environment variables");
    return;
  }

  try {
    // Attempt to connect to MongoDB
    const db = await mongoose.connect(mongoURI , {
      dbName: "FilesManager",
      // Optional performance flags
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");

  } catch (error) {
    // Log any connection errors
    console.error("Failed to connect to MongoDB", error);
  }
};

export default dbConnect;