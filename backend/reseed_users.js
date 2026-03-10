import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting to reseed specific users...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('123456', salt);

        // 1. Staff: Lê Thị Thu Hà
        const staff = await prisma.user.upsert({
            where: { email: 'aninhsitinh2005@gmail.com' },
            update: {},
            create: {
                email: 'aninhsitinh2005@gmail.com',
                password: passwordHash,
                fullName: 'Lê Thị Thu Hà',
                role: 'staff',
                studentId: 'STAFF_HA',
                status: 'active'
            }
        });
        console.log(`✅ Staff account created/verified: ${staff.email}`);

        // 2. MC: duykhuong011205@gmail.com
        const mc = await prisma.user.upsert({
            where: { email: 'duykhuong011205@gmail.com' },
            update: {},
            create: {
                email: 'duykhuong011205@gmail.com',
                password: passwordHash,
                fullName: 'MC Duy Khương',
                role: 'mc',
                studentId: 'MC_KHUONG',
                status: 'active'
            }
        });
        console.log(`✅ MC account created/verified: ${mc.email}`);

        // 3. Admin: admin@greenwich.edu.vn
        const admin = await prisma.user.upsert({
            where: { email: 'admin@greenwich.edu.vn' },
            update: {},
            create: {
                email: 'admin@greenwich.edu.vn',
                password: passwordHash,
                fullName: 'System Administrator',
                role: 'admin',
                studentId: 'ADMIN_ROOT',
                status: 'active'
            }
        });
        console.log(`✅ Admin account created/verified: ${admin.email}`);

        console.log('\n✨ All accounts have been added successfully!');
    } catch (error) {
        console.error('❌ Error during reseeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
