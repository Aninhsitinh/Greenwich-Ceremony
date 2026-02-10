import QRCode from 'qrcode';

/**
 * Generate QR code as base64 string
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} Base64 encoded QR code
 */
export const generateQRCode = async (data) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 300,
        });
        return qrCodeDataURL;
    } catch (error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
    }
};

/**
 * Generate unique ticket number
 * @param {string} prefix - Prefix for ticket number (e.g., 'GRAD')
 * @returns {string} Unique ticket number
 */
export const generateTicketNumber = (prefix = 'GRAD') => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${timestamp}-${random}`;
};
