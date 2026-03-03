import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const logos = {
        'Zandu': 'https://zanducare.com/cdn/shop/files/Zandu_Care_Logo_300x.png',
        'Baidyanath': 'https://www.baidyanath.com/images/logo.png',
        'Sandu': 'https://sandu.in/wp-content/uploads/2021/08/sandu-logo-1.png',
        'Hamdard': 'https://www.hamdard.in/wp-content/uploads/2021/09/Hamdard-Logo.png',
        'Jinvar': 'https://placeholder.com/150/1b4332/white?text=Jinvar', // Needs real logo
        'Rivayu': 'https://placeholder.com/150/1b4332/white?text=Rivayu', // Needs real logo
    };

    console.log('Start updating category logos...');

    for (const [name, logo] of Object.entries(logos)) {
        try {
            const updated = await prisma.category.update({
                where: { name: name },
                data: { logo: logo },
            });
            console.log(`Updated logo for: ${updated.name}`);
        } catch (e) {
            console.log(`Could not find or update: ${name}`);
        }
    }

    console.log('Logo update finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
