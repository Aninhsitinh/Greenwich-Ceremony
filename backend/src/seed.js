import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import SystemSettings from './models/SystemSettings.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Seeding database...\n');

        // Clear existing data
        await User.deleteMany();
        await SystemSettings.deleteMany();

        console.log('✅ Cleared existing data\n');

        // Create admin user
        const admin = await User.create({
            studentId: 'ADMIN001',
            email: 'admin@greenwich.edu.vn',
            password: 'admin123',
            fullName: 'System Administrator',
            role: 'admin',
            phone: '0901234567',
            major: 'Computer Science',
            classOf: 2024,
        });

        console.log('✅ Created admin user:', admin.email);

        // Create staff user
        const staff = await User.create({
            studentId: 'STAFF001',
            email: 'staff@greenwich.edu.vn',
            password: 'staff123',
            fullName: 'Staff Member',
            role: 'staff',
            phone: '0901234568',
            major: 'Administration',
            classOf: 2024,
        });

        console.log('✅ Created staff user:', staff.email);

        // Create MC user
        const mc = await User.create({
            studentId: 'MC001',
            email: 'mc@greenwich.edu.vn',
            password: 'mc123',
            fullName: 'Master of Ceremony',
            role: 'mc',
            phone: '0901234569',
            major: 'Event Management',
            classOf: 2024,
        });

        console.log('✅ Created MC user:', mc.email);

        // Create sample students
        const students = await User.create([
            {
                studentId: 'GCS220001',
                email: 'student1@greenwich.edu.vn',
                password: 'student123',
                fullName: 'Nguyễn Văn A',
                role: 'student',
                phone: '0901234570',
                major: 'Computer Science',
                classOf: 2024,
            },
            {
                studentId: 'GCS220002',
                email: 'student2@greenwich.edu.vn',
                password: 'student123',
                fullName: 'Trần Thị B',
                role: 'student',
                phone: '0901234571',
                major: 'Business Administration',
                classOf: 2024,
            },
            {
                studentId: 'GCS220003',
                email: 'student3@greenwich.edu.vn',
                password: 'student123',
                fullName: 'Lê Văn C',
                role: 'student',
                phone: '0901234572',
                major: 'Information Technology',
                classOf: 2024,
            },
        ]);

        console.log(`✅ Created ${students.length} student users\n`);

        // Create system settings
        const settings = await SystemSettings.create({
            ceremonyDate: new Date('2024-06-20'),
            registrationDeadline: new Date('2024-06-15'),
            maxGuestPerStudent: 2,
            gownCollectionStartDate: new Date('2024-06-10'),
            gownCollectionEndDate: new Date('2024-06-19'),
            venueCapacity: 500,
            isRegistrationOpen: true,
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
