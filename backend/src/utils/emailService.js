import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Send contact form email
export const sendContactEmail = async ({ name, email, subject, message }) => {
    try {
        const transporter = createTransporter();

        // Email to admin
        const adminMailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: 'greenwichvietnamgraduation@gmail.com',
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Message:</strong></p>
                        <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from the Greenwich Vietnam Graduation Portal contact form.
                    </p>
                </div>
            `
        };

        // Email confirmation to sender
        const senderMailOptions = {
            from: `"Greenwich Vietnam" <greenwichvietnamgraduation@gmail.com>`,
            to: email,
            subject: 'Thank you for contacting us - Greenwich Vietnam',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        Thank You for Contacting Us
                    </h2>
                    <p style="margin: 20px 0;">Dear ${name},</p>
                    <p style="margin: 20px 0;">
                        Thank you for reaching out to Greenwich Vietnam. We have received your message and will get back to you as soon as possible.
                    </p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Your message:</strong></p>
                        <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="margin: 20px 0;">
                        If you have any urgent concerns, please feel free to call us at (028) 7300 6789.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        <strong>Greenwich Vietnam</strong><br>
                        20 Cộng Hòa, Phường Bảy Hiền, Quận Tân Bình, TP.HCM<br>
                        Email: graduation@greenwich.edu.vn<br>
                        Phone: (028) 7300 6789
                    </p>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(senderMailOptions);

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send email');
    }
};

// Send OTP email
export const sendOTPEmail = async ({ email, otp }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Greenwich Vietnam Graduation" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset OTP - Greenwich Vietnam Graduation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                        Password Reset
                    </h2>
                    <p style="margin: 20px 0;">
                        You requested a password reset for your Greenwich Vietnam Graduation Portal account.
                    </p>
                    <p style="margin: 20px 0;">
                        Please use the following OTP code to reset your password. This code will expire in 10 minutes.
                    </p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5;">${otp}</span>
                    </div>
                    <p style="margin: 20px 0;">
                        If you did not request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        <strong>Greenwich Vietnam Graduation Portal</strong>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        if (process.env.NODE_ENV === 'development') {
            return { success: true, message: 'OTP logged to console (Dev Mode)' };
        }
        throw new Error('Failed to send OTP email');
    }
};

// Send Payment OTP email
export const sendPaymentOTP = async ({ email, otp, amount, provider }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Greenwich Payment Gateway" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Payment Verification Code - Greenwich Vietnam',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #005ba3; padding-bottom: 10px;">
                        Payment Verification
                    </h2>
                    <p style="margin: 20px 0;">
                        You are initiating a payment of <strong>${amount}</strong> via <strong>${provider}</strong>.
                    </p>
                    <p style="margin: 20px 0;">
                        Please use the following OTP code to complete your transaction. Do not share this code with anyone.
                    </p>
                    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; text-align: center; margin: 30px 0; border: 1px solid #bae6fd;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0284c7;">${otp}</span>
                    </div>
                    <p style="margin: 20px 0; font-size: 12px; color: #666;">
                        If you did not initiate this transaction, please contact support immediately.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        <strong>Greenwich Vietnam Payment Gateway</strong>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        // Fallback for development
        if (process.env.NODE_ENV === 'development') {
            console.log('----------------------------------------');
            console.log('⚠️  DEV MODE: Payment Email failed to send.');
            console.log(`🔑  Payment OTP for ${email}: ${otp}`);
            console.log('----------------------------------------');
            return { success: true, message: 'OTP logged to console (Dev Mode)' };
        }
        throw new Error('Failed to send OTP email');
    }
};
