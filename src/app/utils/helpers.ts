const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * Formats a product image URL, handling both Cloudinary URLs and local uploads.
 */
export const formatProductImageUrl = (image: string | null | undefined): string => {
    if (!image) return 'https://placehold.co/600x400?text=No+Image';
    if (image.startsWith('/uploads')) return `${apiBaseUrl}${image}`;
    return image;
};

/**
 * Generates a WhatsApp link with standardized Indian country code (91)
 * and properly encoded message.
 */
export const getWhatsAppLink = (rawNumber: string, message: string): string => {
    // Strip any non-digit characters using modern replaceAll for safety
    const phoneNumber = rawNumber.replace(/\D/g, '');

    // Ensure it starts with 91
    const formattedNumber = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;

    const encodedMessage = encodeURIComponent(message);

    if (formattedNumber.length > 2) {
        return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    }
    return '';
};
