import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { sendNotificationEmail } from './utils/mailer';
import { rateLimit } from 'express-rate-limit';
import DOMPurify from 'isomorphic-dompurify';
import cloudinary, { storage as cloudinaryStorage } from './utils/cloudinary';
import helmet from 'helmet';


const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// --- RATE LIMITERS ---

// General limiter: Apply to all requests
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100, // Limit each IP to 100 requests per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Strict limiter: Apply to form submissions to prevent spam
const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // Reverted to a safe production value (was 100 for testing)
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Submission limit reached. Please wait an hour before trying again.' }
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // CRITICAL: Allow cross-origin requests
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://*.clerk.accounts.dev", "https://clerk.sakshienterprise.com"],
            connectSrc: ["'self'", "https://*.clerk.accounts.dev", "https://clerk.sakshienterprise.com", "https://api.cloudinary.com"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.clerk.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameAncestors: ["'none'"],
        },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
}));

const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const sanitizedFrontendUrl = rawFrontendUrl.endsWith('/') ? rawFrontendUrl.slice(0, -1) : rawFrontendUrl;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    sanitizedFrontendUrl,
    'https://sakshi-enterprise.vercel.app' // Explicitly add specific vercel URL as fallback
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(generalLimiter);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '50kb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configure Multer for Cloudinary
const upload = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Clerk Authentication Middleware
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const sessionClaims = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });

        if (!sessionClaims) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        // Fetch user to get current email address
        const user = await clerkClient.users.getUser(sessionClaims.sub as string);
        const userEmail = user.primaryEmailAddress?.emailAddress;

        if (!userEmail) {
            return res.status(403).json({ error: 'Forbidden: Identification required' });
        }

        const adminEmails = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());

        // Enforce strict admin access
        if (!adminEmails.includes(userEmail.toLowerCase())) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        next();
    } catch (error) {
        console.error('Auth check failed:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- PUBLIC ROUTES ---

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sakshi Enterprise API is running' });
});

// Submit Lead (Contact Form)
app.post('/api/leads', submissionLimiter, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sanitizedFirstName = DOMPurify.sanitize(firstName, { ALLOWED_TAGS: [] });
        const sanitizedLastName = DOMPurify.sanitize(lastName, { ALLOWED_TAGS: [] });
        const sanitizedSubject = DOMPurify.sanitize(subject, { ALLOWED_TAGS: [] });
        const sanitizedMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] });

        console.log(`[Lead] Creating lead for ${email}...`);
        const lead = await prisma.lead.create({
            data: {
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
                email, // Email usually doesn't need HTML sanitization, just validation
                phone,
                subject: sanitizedSubject,
                message: sanitizedMessage,
            },
        });
        console.log(`[Lead] Saved to DB (ID: ${lead.id}).`);

        const whatsappNumber = phone.replace(/[^\d]/g, '');
        const whatsappLink = `https://wa.me/91${whatsappNumber}`; // Assuming +91 for India as seen in contact info

        // Send email in background (don't await)
        sendNotificationEmail(
            `New Lead: ${sanitizedSubject}`,
            `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2D6A4F;">New Lead Received</h2>
                <p><strong>Name:</strong> ${sanitizedFirstName} ${sanitizedLastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${sanitizedSubject}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2D6A4F; white-space: pre-wrap;">
                    ${sanitizedMessage}
                </div>
                <div style="margin-top: 20px;">
                    <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reply via WhatsApp</a>
                    <a href="mailto:${email}" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-left: 10px;">Reply via Email</a>
                </div>
            </div>`
        ).catch(err => console.error("[Lead] Email error:", err));

        res.status(201).json({ message: 'Lead submitted successfully', id: lead.id });
    } catch (error) {
        console.error('Error submitting lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit Quote Request (requireAuth commented out for public access per client request)
app.post('/api/quotes', /* requireAuth, */ submissionLimiter, async (req, res) => {
    try {
        const { fullName, companyName, email, phone, additionalNotes, items } = req.body;

        if (!fullName || !companyName || !email || !phone || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Missing required fields or invalid items' });
        }

        const sanitizedFullName = DOMPurify.sanitize(fullName, { ALLOWED_TAGS: [] });
        const sanitizedCompanyName = DOMPurify.sanitize(companyName, { ALLOWED_TAGS: [] });
        const sanitizedNotes = additionalNotes ? DOMPurify.sanitize(additionalNotes, { ALLOWED_TAGS: [] }) : null;

        // Fetch products from DB to verify they exist and get their REAL names
        const productIds = items.map((item: any) => item.id);
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        // Check if all requested products actually exist in our DB
        if (dbProducts.length !== items.length) {
            return res.status(400).json({ error: 'One or more products in your cart are invalid or no longer available.' });
        }

        console.log(`[Quote] Creating quote for ${email}...`);
        const quoteRequest = await prisma.quoteRequest.create({
            data: {
                fullName: sanitizedFullName,
                companyName: sanitizedCompanyName,
                email,
                phone,
                additionalNotes: sanitizedNotes,
                items: {
                    create: items.map((item: any) => {
                        const realProduct = dbProducts.find(p => p.id === item.id);
                        return {
                            productId: item.id,
                            productName: realProduct!.name, // Use the real name from DB, NOT the one from the client
                            quantity: item.quantity,
                        };
                    }),
                },
            },
            include: {
                items: true,
            },
        });
        console.log(`[Quote] Saved to DB (ID: ${quoteRequest.id}).`);

        // ... inside app.post('/api/quotes') after quoteRequest is created
        // Generate item list for email
        const itemListHtml = quoteRequest.items.map((item: any) =>
            `<li><strong>${item.productName}</strong> x ${item.quantity}</li>`
        ).join('');

        const whatsappNumber = phone.replace(/[^\d]/g, '');
        const whatsappLink = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi ${sanitizedFullName}, thank you for your quote request at Sakshi Enterprise. Regarding your request for ${items.length} items...`)}`;

        // Send email in background (don't await)
        sendNotificationEmail(
            `New Quote Request from ${sanitizedFullName}`,
            `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2D6A4F;">New Quote Request</h2>
                <p><strong>Customer:</strong> ${sanitizedFullName}</p>
                <p><strong>Company:</strong> ${sanitizedCompanyName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <h3 style="color: #2D6A4F;">Items Requested:</h3>
                <ul>
                    ${itemListHtml}
                </ul>
                <p><strong>Additional Notes:</strong></p>
                <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2D6A4F; white-space: pre-wrap;">
                    ${sanitizedNotes || 'None'}
                </div>
                <div style="margin-top: 20px;">
                    <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Chat on WhatsApp</a>
                    <a href="mailto:${email}?subject=Quote Request Follow-up - Sakshi Enterprise" style="background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-left: 10px;">Reply via Email</a>
                </div>
            </div>`
        ).catch(err => console.error("[Quote] Admin Email error:", err));

        // Send order confirmation email to the customer
        sendNotificationEmail(
            `Order Received - Sakshi Enterprise`,
            `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2D6A4F; border-bottom: 2px solid #2D6A4F; padding-bottom: 10px;">Order Confirmation</h2>
                <p>Hello <strong>${sanitizedFullName}</strong>,</p>
                <p>Thank you for placing your order with Sakshi Enterprise. We have received your order and it is currently awaiting payment confirmation.</p>
                <h3 style="color: #2D6A4F; margin-top: 20px;">Your Order Details:</h3>
                <ul style="background: #f9f9f9; padding: 15px 15px 15px 35px; border-radius: 5px;">
                    ${itemListHtml}
                </ul>
                <p><strong>Total Items:</strong> ${items.length}</p>
                <div style="margin-top: 30px; padding: 20px; text-align: center; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 5px;">
                    <h4 style="margin: 0 0 10px 0; color: #166534;">Payment Pending</h4>
                    <p style="margin: 0; font-size: 14px;">If you haven't completed your bank transfer or UPI payment yet, please do so using the details on the payment page.</p>
                </div>
                <p style="margin-top: 30px; font-size: 14px; color: #666;">If you have any questions, simply reply to this email or contact us on WhatsApp at <a href="https://wa.me/919326347507">+91 9326347507</a>.</p>
                <p style="margin-top: 20px;">Best regards,<br>The Sakshi Enterprise Team</p>
            </div>`,
            email
        ).catch(err => console.error("[Quote] Customer Email error:", err));

        res.status(201).json({ message: 'Quote request submitted successfully', id: quoteRequest.id });
    } catch (error) {
        console.error('Error submitting quote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- PROTECTED ADMIN ROUTES ---

// Category Management
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { products: true },
        });
        res.json(categories);
    } catch (error) {
        console.error('Fetch categories error:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.post('/api/admin/categories', requireAuth, async (req, res) => {
    try {
        const { id, name, description, icon } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        // Use name to derive ID if ID not provided (slugify simple version)
        const slug = id || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const category = await prisma.category.create({
            data: {
                id: slug,
                name,
                description,
                icon
            }
        });
        res.status(201).json(category);
    } catch (error: any) {
        console.error('Create category error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A category with this name or ID already exists.' });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
});

app.patch('/api/admin/categories/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon } = req.body;
        const category = await prisma.category.update({
            where: { id: id as string },
            data: { name, description, icon }
        });
        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

app.delete('/api/admin/categories/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id: id as string } });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Product Management
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/admin/products', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, categoryId, inStock } = req.body;
        const imageUrl = req.file ? req.file.path : null;


        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number.parseFloat(price),
                image: imageUrl,
                category: { connect: { id: categoryId } },
                inStock: inStock === 'true' || inStock === true,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.patch('/api/admin/products/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, inStock } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number.parseFloat(price);
        if (categoryId) updateData.categoryId = categoryId;
        if (inStock !== undefined) updateData.inStock = inStock === 'true' || inStock === true;
        if (req.file) updateData.image = req.file.path;


        const product = await prisma.product.update({
            where: { id: id as string },
            data: updateData,
        });
        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

app.get('/api/products/:id/related', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: id as string },
            select: { categoryId: true }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                NOT: { id: id as string },
            },
            take: 4,
        });

        res.json(relatedProducts);
    } catch (error) {
        console.error('Fetch related products error:', error);
        res.status(500).json({ error: 'Failed to fetch related products' });
    }
});

app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id: id as string } });
        if (product?.image) {
            if (product.image.includes('cloudinary.com')) {
                // Extract public_id from Cloudinary URL
                // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.jpg
                const parts = product.image.split('/');
                const filenameWithExtension = parts[parts.length - 1];
                const publicId = `sakshi_products/${filenameWithExtension.split('.')[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } else {
                // Legacy local file deletion
                const filePath = path.join(__dirname, '..', product.image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }
        await prisma.product.delete({ where: { id: id as string } });
        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Get all Leads
app.get('/api/admin/leads', requireAuth, async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all Quote Requests
app.get('/api/admin/quotes', requireAuth, async (req, res) => {
    try {
        const quotes = await prisma.quoteRequest.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.json([]);
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { category: { name: { contains: q, mode: 'insensitive' } } }
                ]
            },
            include: { category: true },
            take: 10
        });
        res.json(products);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
