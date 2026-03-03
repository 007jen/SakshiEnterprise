import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // Clear existing data
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Ayurvedic Range',
                description: 'Traditional Ayurvedic medicines and herbal formulations for natural healing.',
                icon: 'Leaf',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Healthcare Essentials',
                description: 'Vital medical supplies, diagnostics, and daily healthcare necessities.',
                icon: 'Stethoscope',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Immunity Boosters',
                description: 'Vitamins, supplements, and herbal products designed to strengthen your immune system.',
                icon: 'Shield',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Personal Care',
                description: 'Premium healthcare products for personal hygiene and daily wellness rituals.',
                icon: 'Heart',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Wellness Supplements',
                description: 'Nutritional supplements and wellness products for balanced living.',
                icon: 'Activity',
            },
        }),
    ]);

    console.log(`Created ${categories.length} categories.`);

    // Sample Products for Ayurvedic Range
    await prisma.product.createMany({
        data: [
            {
                name: 'Pure Ashwagandha Capsules',
                description: 'Premium grade Ashwagandha extract for stress relief and energy.',
                price: 450,
                categoryId: categories[0].id,
                image: 'https://images.unsplash.com/photo-1521146250551-a5578dcc2e64?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                inStock: true,
            },
            {
                name: 'Triphala Churna',
                description: 'Traditional herbal blend for digestive health and detoxification.',
                price: 180,
                categoryId: categories[0].id,
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Brahmi Vitality Syrup',
                description: 'Cognitive enhancement and memory support herbal syrup.',
                price: 320,
                categoryId: categories[0].id,
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
        ],
    });

    // Sample Products for Healthcare Essentials
    await prisma.product.createMany({
        data: [
            {
                name: 'Digital Blood Pressure Monitor',
                description: 'Accurate and easy-to-use upper arm BP monitor with memory.',
                price: 1850,
                categoryId: categories[1].id,
                image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Contactless Infrared Thermometer',
                description: 'Rapid temperature reading for safe and hygienic monitoring.',
                price: 1200,
                categoryId: categories[1].id,
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Pulse Oximeter',
                description: 'Portable blood oxygen and pulse rate monitor with OLED display.',
                price: 950,
                categoryId: categories[1].id,
                image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
        ],
    });

    // Sample Products for Immunity Boosters
    await prisma.product.createMany({
        data: [
            {
                name: 'Giloy Tulsi Juice',
                description: 'Natural immunity boosting juice with potent antioxidant properties.',
                price: 350,
                categoryId: categories[2].id,
                image: 'https://images.unsplash.com/photo-1616671285442-70966f076644?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Chyawanprash Special',
                description: 'Traditional Ayurvedic immunity booster enriched with Amla and herbs.',
                price: 550,
                categoryId: categories[2].id,
                image: 'https://images.unsplash.com/photo-1512428559083-a400a42d447a?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Vitamin C + Zinc Tablets',
                description: 'Essential nutrients for daily immune support and vitality.',
                price: 280,
                categoryId: categories[2].id,
                image: 'https://images.unsplash.com/photo-1550573105-df2dc6630f6e?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
        ],
    });

    // Sample Products for Personal Care
    await prisma.product.createMany({
        data: [
            {
                name: 'Herbal Hand Sanitizer',
                description: 'Effective germ protection with Aloe Vera and Neem extracts.',
                price: 150,
                categoryId: categories[3].id,
                image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
            {
                name: 'Medical Grade Face Masks',
                description: 'Pack of 50 high-quality 3-ply surgical masks for protection.',
                price: 250,
                categoryId: categories[3].id,
                image: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?auto=format&fit=crop&q=80&w=800',
                inStock: true,
            },
        ],
    });

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
