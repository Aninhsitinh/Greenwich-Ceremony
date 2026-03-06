import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const pass = await bcrypt.hash('123456', 10);
        const user = await prisma.user.upsert({
            where: { email: 'duykhuong011205@gmail.com' },
            update: {
                role: 'mc',
                password: pass,
                fullName: 'MC Khương',
                status: 'active'
            },
            create: {
                email: 'duykhuong011205@gmail.com',
                password: pass,
                fullName: 'MC Khương',
                role: 'mc',
                status: 'active'
            }
        });
        console.log('MC User Created:', user.email);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}
main();
