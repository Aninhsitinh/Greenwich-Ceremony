import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Helper to get value from row irrespective of case or spaces in keys
 */
const getVal = (row, fieldName) => {
    const normalizedTarget = fieldName.toLowerCase().replace(/\s/g, '');
    const key = Object.keys(row).find(k => k.toLowerCase().replace(/\s/g, '') === normalizedTarget);
    return key ? row[key] : null;
};

/**
 * Import Student Registrations from Excel
 * Expected columns: Student ID, Name, Major, Class Of, Email
 */
export const importStudents = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const row of data) {
            try {
                // Flexible header matching
                const studentId = getVal(row, 'Student ID')?.toString().trim();
                const fullName = getVal(row, 'Name')?.toString().trim();
                const major = getVal(row, 'Major')?.toString().trim();
                const classOfRaw = getVal(row, 'Class Of');
                const classOf = parseInt(classOfRaw);
                const email = getVal(row, 'Email')?.toString().trim();

                if (!studentId || !fullName || !major || isNaN(classOf) || !email) {
                    const missing = [];
                    if (!studentId) missing.push('Student ID');
                    if (!fullName) missing.push('Name');
                    if (!major) missing.push('Major');
                    if (isNaN(classOf)) missing.push('Class Of');
                    if (!email) missing.push('Email');

                    results.failed++;
                    results.errors.push(`Row missing or invalid columns (${missing.join(', ')}): ${JSON.stringify(row)}`);
                    continue;
                }

                // 1. Find or create user
                let user = await prisma.user.findUnique({ where: { studentId } });

                const userData = {
                    studentId,
                    fullName,
                    email,
                    major,
                    classOf,
                    journeyRegistrationCompleted: true
                };

                if (!user) {
                    // Check if email already exists for another user
                    const existingEmail = await prisma.user.findUnique({ where: { email } });
                    if (existingEmail) {
                        results.failed++;
                        results.errors.push(`Email ${email} is already used by student ${existingEmail.studentId}`);
                        continue;
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash('123456', salt);

                    user = await prisma.user.create({
                        data: {
                            ...userData,
                            password: hashedPassword,
                            role: 'student'
                        }
                    });
                } else {
                    // Update user
                    try {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: userData
                        });
                    } catch (err) {
                        if (err.code === 'P2002') {
                            results.failed++;
                            results.errors.push(`Could not update student ${studentId}: Email ${email} is already taken by another account.`);
                            continue;
                        }
                        throw err;
                    }
                }

                // 2. Create or update registration
                const existingReg = await prisma.registration.findFirst({
                    where: { userId: user.id }
                });

                const cDate = existingReg?.ceremonyDate || new Date();
                // Strip time for unique constraint if necessary, but here we use the exact date found or now

                await prisma.registration.upsert({
                    where: { userId_ceremonyDate: { userId: user.id, ceremonyDate: cDate } },
                    update: {
                        registrationStatus: 'confirmed',
                        attendanceConfirmed: true
                    },
                    create: {
                        userId: user.id,
                        ceremonyDate: cDate,
                        registrationStatus: 'confirmed',
                        attendanceConfirmed: true,
                        guestCount: 1
                    }
                });

                results.success++;
            } catch (error) {
                console.error('Error importing student row:', error);
                results.failed++;
                results.errors.push(`Error on row: ${error.message}`);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Import completed'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Import Deposit Payments from Excel
 * Expected columns: Student ID, Name, Major, Class Of, Email, Transaction ID, Payment Amount
 */
export const importPayments = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const row of data) {
            try {
                // 1. Extract and validate all fields
                const studentId = getVal(row, 'Student ID')?.toString().trim();
                const fullName = getVal(row, 'Name')?.toString().trim();
                const major = getVal(row, 'Major')?.toString().trim();
                const classOfRaw = getVal(row, 'Class Of');
                const classOf = parseInt(classOfRaw);
                const email = getVal(row, 'Email')?.toString().trim();
                const transactionId = getVal(row, 'Transaction ID')?.toString().trim();
                const amountRaw = getVal(row, 'Payment Amount');
                const amount = parseInt(amountRaw);

                if (!studentId || !fullName || !major || isNaN(classOf) || !email || !transactionId || isNaN(amount)) {
                    const missing = [];
                    if (!studentId) missing.push('Student ID');
                    if (!fullName) missing.push('Name');
                    if (!major) missing.push('Major');
                    if (isNaN(classOf)) missing.push('Class Of');
                    if (!email) missing.push('Email');
                    if (!transactionId) missing.push('Transaction ID');
                    if (isNaN(amount)) missing.push('Payment Amount');

                    results.failed++;
                    results.errors.push(`Row missing or invalid columns (${missing.join(', ')}): ${JSON.stringify(row)}`);
                    continue;
                }

                // 2. Find or create/update User
                let user = await prisma.user.findUnique({ where: { studentId } });

                const userData = {
                    studentId,
                    fullName,
                    email,
                    major,
                    classOf,
                    journeyRegistrationCompleted: true
                };

                if (!user) {
                    // Check if email already exists for another user
                    const existingEmail = await prisma.user.findUnique({ where: { email } });
                    if (existingEmail) {
                        results.failed++;
                        results.errors.push(`Email ${email} is already used by student ${existingEmail.studentId}`);
                        continue;
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash('123456', salt);

                    user = await prisma.user.create({
                        data: {
                            ...userData,
                            password: hashedPassword,
                            role: 'student'
                        }
                    });
                } else {
                    // Update user info from the payment Excel
                    try {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: userData
                        });
                    } catch (err) {
                        if (err.code === 'P2002') {
                            results.failed++;
                            results.errors.push(`Could not update student ${studentId}: Email ${email} is already taken.`);
                            continue;
                        }
                        throw err;
                    }
                }

                // 3. Ensure a confirmed registration exists for this user
                const existingReg = await prisma.registration.findFirst({
                    where: { userId: user.id }
                });

                const cDate = existingReg?.ceremonyDate || new Date();

                await prisma.registration.upsert({
                    where: { userId_ceremonyDate: { userId: user.id, ceremonyDate: cDate } },
                    update: {
                        registrationStatus: 'confirmed',
                        attendanceConfirmed: true
                    },
                    create: {
                        userId: user.id,
                        ceremonyDate: cDate,
                        registrationStatus: 'confirmed',
                        attendanceConfirmed: true,
                        guestCount: 1
                    }
                });

                // 4. Create payment record
                await prisma.payment.create({
                    data: {
                        userId: user.id,
                        amount,
                        transactionId,
                        status: 'completed',
                        paymentMethod: 'bank_transfer',
                        paymentType: 'graduation_package',
                        notes: 'Deposit payment imported from Excel',
                        items: { description: 'Graduation Deposit' }
                    }
                });

                // 5. Update user journey status
                await prisma.user.update({
                    where: { id: user.id },
                    data: { journeyPaymentCompleted: true }
                });

                results.success++;
            } catch (error) {
                console.error('Error importing payment row:', error);
                results.failed++;
                results.errors.push(`Error on row: ${error.message}`);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Import completed'
        });
    } catch (error) {
        next(error);
    }
};
