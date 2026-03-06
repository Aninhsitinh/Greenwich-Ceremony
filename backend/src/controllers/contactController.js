import { sendContactEmail } from '../utils/emailService.js';

// @desc    Send contact form email
// @route   POST /api/contact
// @access  Public
export const sendContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Send email
        await sendContactEmail({ name, email, subject, message });

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later or contact us directly.'
        });
    }
};
