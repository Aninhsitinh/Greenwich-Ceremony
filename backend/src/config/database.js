import prisma from '../prisma.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Prisma PostgreSQL Connected Successfully!`);
  } catch (error) {
    console.error(`❌ Prisma Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
