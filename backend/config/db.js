import mongoose from "mongoose";
import dns from "dns";

// Fix Node.js 17+ DNS resolution SRV bugs for MongoDB Atlas shard lists
if (dns && typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

export const connectDB = async () => {
  await mongoose
    .connect(
      process.env.MONGO_URL
    )
    .then(() => console.log("DB Connected"));
};
