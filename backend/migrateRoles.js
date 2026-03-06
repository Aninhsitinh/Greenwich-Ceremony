/**
 * Migration script: Update user roles using Prisma (PostgreSQL)
 * This replaces the old Mongoose-based migrateRoles.js
 * 
 * Usage: node migrateRoles.js
 */

import prisma from './src/prisma.js';

const migrateRoles = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Connected to PostgreSQL via Prisma');

        // Example: update all users with role 'staff' to role 'staff' (adjust as needed)
        const result = await prisma.user.updateMany({
            where: { role: 'staff' },
            data: { role: 'staff' } // change target role here if needed
        });

        console.log(`✅ Migration complete. Updated ${result.count} users.`);

        // Verification
        const staffCount = await prisma.user.count({ where: { role: 'staff' } });
        console.log(`📊 Stats: Staff users: ${staffCount}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

migrateRoles();
