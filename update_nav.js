import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studentDir = path.join(__dirname, 'frontend/src/views/student');

const files = [
    'BookingConfirmation.vue', 'ChangePassword.vue', 'Dashboard.vue',
    'GownCollection.vue', 'Help.vue', 'Notifications.vue',
    'NotificationSettings.vue', 'Payment.vue', 'PrivacySettings.vue',
    'Profile.vue', 'Registration.vue', 'SeatBooking.vue', 'Settings.vue'
];

const newItem = `,\n  { path: '/student/chat', icon: 'support_agent', label: 'Support Chat' }`;

files.forEach(file => {
    const filePath = path.join(studentDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Find the "const navigation = [" block and inject the item before the closing "];"
        const navStartRegex = /const navigation = \[\s*([\s\S]*?)\s*\];/;
        const match = content.match(navStartRegex);

        if (match) {
            // Check if it already has support chat to avoid duplicates
            if (!match[0].includes("path: '/student/chat'")) {
                const replacedBlock = `const navigation = [\n  ${match[1].trim()}${newItem}\n];`;
                content = content.replace(navStartRegex, replacedBlock);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${file}`);
            } else {
                console.log(`Already updated ${file}`);
            }
        } else {
            console.log(`Could not find navigation in ${file}`);
        }
    }
});
