import dotenv from 'dotenv';
import prisma from './prisma.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database...\n');

        // Clear existing data
        await prisma.user.deleteMany();
        await prisma.systemSettings.deleteMany();

        console.log('✅ Cleared existing data\n');

        // Note: Password hashing is usually done in a pre-save hook in Mongoose. 
        // In Prisma, we either hash it before inserting or handle it in the service layer.
        // For seeds, let's hash passwords manually here.
        const salt = await bcrypt.genSalt(10);
        const adminHashed = await bcrypt.hash('admin123', salt);
        const staffHashed = await bcrypt.hash('staff123', salt);
        const mcHashed = await bcrypt.hash('mc123', salt);
        const studentHashed = await bcrypt.hash('student123', salt);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                studentId: 'ADMIN001',
                email: 'admin@greenwich.edu.vn',
                password: adminHashed,
                fullName: 'System Administrator',
                role: 'admin',
                phone: '0901234567',
                major: 'Computer Science',
                classOf: 2026,
            }
        });

        console.log('✅ Created admin user:', admin.email);

        // Create staff user
        const staff = await prisma.user.create({
            data: {
                studentId: 'STAFF001',
                email: 'staff@greenwich.edu.vn',
                password: staffHashed,
                fullName: 'Staff Member',
                role: 'staff',
                phone: '0901234568',
                major: 'Administration',
                classOf: 2026,
            }
        });

        console.log('✅ Created staff user:', staff.email);

        // Create MC user
        const mc = await prisma.user.create({
            data: {
                studentId: 'MC001',
                email: 'mc@greenwich.edu.vn',
                password: mcHashed,
                fullName: 'Master of Ceremony',
                role: 'mc',
                phone: '0901234569',
                major: 'Event Management',
                classOf: 2026,
            }
        });

        console.log('✅ Created MC user:', mc.email);

        // Create sample students
        const students = await prisma.user.createMany({
            data: [
                {
                    studentId: 'GCS220001',
                    email: 'student1@greenwich.edu.vn',
                    password: studentHashed,
                    fullName: 'Nguyễn Văn A',
                    role: 'student',
                    phone: '0901234570',
                    major: 'Computer Science',
                    classOf: 2026,
                },
                {
                    studentId: 'GCS220002',
                    email: 'student2@greenwich.edu.vn',
                    password: studentHashed,
                    fullName: 'Trần Thị B',
                    role: 'student',
                    phone: '0901234571',
                    major: 'Business Administration',
                    classOf: 2026,
                },
                {
                    studentId: 'GCS220003',
                    email: 'student3@greenwich.edu.vn',
                    password: studentHashed,
                    fullName: 'Lê Văn C',
                    role: 'student',
                    phone: '0901234572',
                    major: 'Information Technology',
                    classOf: 2026,
                },
            ]
        });

        console.log(`✅ Created ${students.count} student users\n`);

        // Create system settings
        const settings = await prisma.systemSettings.create({
            data: {
                ceremonyDate: new Date('2026-06-20'),
                registrationDeadline: new Date('2026-06-15'),
                maxGuestPerStudent: 2,
                gownCollectionStartDate: new Date('2026-06-10'),
                gownCollectionEndDate: new Date('2026-06-19'),
                venueCapacity: 500,
                isRegistrationOpen: true,
            }
        });

        console.log('✅ Created system settings\n');

        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 Database seeded successfully!\n');
        console.log('Default Accounts:');
        console.log('─────────────────────────────────────────────────────');
        console.log('👤 Admin:');
        console.log('   Email: admin@greenwich.edu.vn');
        console.log('   Password: admin123\n');
        console.log('👤 Staff:');
        console.log('   Email: staff@greenwich.edu.vn');
        console.log('   Password: staff123\n');
        console.log('👤 MC:');
        console.log('   Email: mc@greenwich.edu.vn');
        console.log('   Password: mc123\n');
        console.log('👤 Student:');
        console.log('   Email: student1@greenwich.edu.vn');
        console.log('   Password: student123');
        console.log('═══════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
