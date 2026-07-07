import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js 17+ DNS resolution SRV bugs for MongoDB Atlas shard lists
if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Do not crash the process; allow the server to run and return errors to client
  }
};
