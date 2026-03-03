import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'Zandu', description: 'Authentic Ayurvedic products from Zandu.', icon: 'Leaf', logo: 'https://placeholder.com/150' },
        { name: 'Baidyanath', description: 'Trusted ancient Ayurvedic wisdom.', icon: 'Stethoscope', logo: 'https://placeholder.com/150' },
        { name: 'Sandu', description: 'Pioneers in Ayurvedic manufacturing across India.', icon: 'HeartPulse', logo: 'https://placeholder.com/150' },
        { name: 'Hamdard', description: 'Unani and Ayurvedic health wellness products.', icon: 'Droplet', logo: 'https://placeholder.com/150' },
        { name: 'Jinvar', description: 'Specialized Ayurvedic medicines and supplements.', icon: 'Pill', logo: 'https://placeholder.com/150' },
        { name: 'Rivayu', description: 'Modern Ayurvedic solutions for daily wellness.', icon: 'Activity', logo: 'https://placeholder.com/150' },
    ];

    console.log('Start seeding categories...');
    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { name: cat.name },
            update: { description: cat.description, icon: cat.icon, logo: cat.logo },
            create: {
                id: cat.name.toLowerCase().replace(/ /g, '-'),
                name: cat.name,
                description: cat.description,
                icon: cat.icon,
                logo: cat.logo
            },
        });
        console.log(`Upserted category: ${created.name}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
