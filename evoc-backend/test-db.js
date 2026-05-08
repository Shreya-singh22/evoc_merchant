// evoc-backend/test-db.js
const { prisma } = require('./config/db');

async function seed() {
  console.log('🚀 Starting to seed test data...');
  const storeId = 'mystore123';

  try {
    // 1. Create/Update Store Settings
    await prisma.storeSettings.upsert({
      where: { storeId },
      update: { storeName: 'My Awesome Store', brandColor: '#6C63FF' },
      create: { storeId, storeName: 'My Awesome Store', brandColor: '#6C63FF' }
    });
    console.log('✅ Store Settings created/updated');

    // 2. Create/Update Store Contact
    await prisma.storeContact.upsert({
      where: { storeId },
      update: { email: 'support@example.com', phone: '+1234567890' },
      create: { storeId, email: 'support@example.com', phone: '+1234567890' }
    });
    console.log('✅ Store Contact created/updated');

    // 3. Create/Update Store Policy
    await prisma.storePolicy.upsert({
      where: { storeId },
      update: { shippingPolicy: 'Standard shipping: 3-5 days.' },
      create: { storeId, shippingPolicy: 'Standard shipping: 3-5 days.' }
    });
    console.log('✅ Store Policies created/updated');

    // 4. Create/Update a Category
    const category = await prisma.category.upsert({
      where: { storeId_slug: { storeId, slug: 'shoes' } },
      update: { name: 'Shoes' },
      create: { storeId, name: 'Shoes', slug: 'shoes' }
    });
    console.log('✅ Category created/updated');

    // 5. Create/Update a Product
    await prisma.product.upsert({
      where: { storeId_slug: { storeId, slug: 'red-shoes' } },
      update: { 
        name: 'Red Running Shoes', 
        price: 99.99, 
        metaTitle: 'Buy Red Shoes Online',
        metaDescription: 'High quality red running shoes for athletes.'
      },
      create: { 
        storeId, 
        name: 'Red Running Shoes', 
        slug: 'red-shoes', 
        price: 99.99,
        categoryId: category.id,
        metaTitle: 'Buy Red Shoes Online',
        metaDescription: 'High quality red running shoes for athletes.'
      }
    });
    console.log('✅ Product created/updated');

    console.log('\n✨ ALL TEST DATA IS READY!');
    console.log('You can now test your APIs in Postman with x-store-id: mystore123');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
