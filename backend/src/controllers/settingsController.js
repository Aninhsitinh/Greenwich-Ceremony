import prisma from '../prisma.js';

// Get current system settings
export const getSettings = async (req, res) => {
    try {
        let settings = await prisma.systemSettings.findFirst();

        // If no settings exist, create default ones
        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    ceremonyDate: new Date('2026-03-13T09:00:00'),
                    registrationDeadline: new Date('2026-02-20T17:00:00'),
                    gownCollectionStartDate: new Date('2026-02-20T09:00:00'),
                    gownCollectionEndDate: new Date('2026-02-20T17:00:00'),
                }
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system settings'
        });
    }
};

// Update system settings
export const updateSettings = async (req, res) => {
    try {
        const payload = req.body;

        // Prepare Prisma-compatible data payload
        const updates = {};

        // Helper to parse dates correctly for Prisma (ISO-8601)
        const parseDate = (dateStr) => {
            if (!dateStr) return undefined;
            // Append :00.000Z if it's just YYYY-MM-DDTHH:mm
            if (dateStr.length === 16) return new Date(`${dateStr}:00.000Z`);
            return new Date(dateStr);
        };

        if (payload.ceremonyDate) updates.ceremonyDate = parseDate(payload.ceremonyDate);
        if (payload.registrationDeadline) updates.registrationDeadline = parseDate(payload.registrationDeadline);
        if (payload.gownCollectionStartDate) updates.gownCollectionStartDate = parseDate(payload.gownCollectionStartDate);
        if (payload.gownCollectionEndDate) updates.gownCollectionEndDate = parseDate(payload.gownCollectionEndDate);
        if (payload.rehearsalDate) updates.rehearsalDate = parseDate(payload.rehearsalDate);

        if (payload.maxGuestPerStudent !== undefined) updates.maxGuestPerStudent = parseInt(payload.maxGuestPerStudent);
        if (payload.venueCapacity !== undefined) updates.venueCapacity = parseInt(payload.venueCapacity);
        if (payload.isRegistrationOpen !== undefined) updates.isRegistrationOpen = Boolean(payload.isRegistrationOpen);

        const stringFields = [
            'ceremonyLocation', 'ceremonyMapLink', 'rehearsalLocation',
            'rehearsalMapLink', 'gownCollectionLocation', 'gownCollectionMapLink'
        ];

        stringFields.forEach(field => {
            if (payload[field] !== undefined) {
                updates[field] = String(payload[field]);
            }
        });

        let settings = await prisma.systemSettings.findFirst();

        if (settings) {
            settings = await prisma.systemSettings.update({
                where: { id: settings.id },
                data: updates
            });
        } else {
            settings = await prisma.systemSettings.create({
                data: updates
            });
        }

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating system settings',
            error: error.message
        });
    }
};
