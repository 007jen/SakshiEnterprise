import { Resend } from 'resend';

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new Resend(apiKey);
};

export const sendNotificationEmail = async (subject: string, html: string) => {
    console.log(`[Mailer] Attempting to send email via Resend: "${subject}"...`);

    const resend = getResend();
    if (!resend) {
        console.error("[Mailer] Missing RESEND_API_KEY in environment. Email not sent.");
        return;
    }

    try {
        const adminEmails = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'jajoshi2005@gmail.com';

        const { data, error } = await resend.emails.send({
            from: 'Nishyash Studio <soulfulcreations@nishyash.com>',
            to: adminEmails.split(',').map(e => e.trim()),
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("[Mailer] Resend API error:", error);
            throw error;
        }

        console.log(`[Mailer] Email sent successfully via Resend. ID: ${data?.id}`);
    } catch (error) {
        console.error("[Mailer] Critical error sending email:", error);
        throw error;
    }
};