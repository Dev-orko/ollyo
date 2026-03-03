const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@business.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@business.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create a default staff user
  const staffPassword = await bcrypt.hash('Staff@123', 12);

  const staff = await prisma.user.upsert({
    where: { email: 'staff@business.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'staff@business.com',
      password: staffPassword,
      role: 'STAFF',
      isActive: true,
    },
  });

  console.log(`✅ Staff user created: ${staff.email}`);

  // Create sample suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Global Foods Ltd',
      email: 'info@globalfoods.com',
      phone: '+44 20 1234 5678',
      address: '123 Trade Street, London, UK',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Quality Ingredients Inc',
      email: 'contact@qualityingredients.com',
      phone: '+1 555 987 6543',
      address: '456 Industry Ave, New York, USA',
    },
  });

  console.log('✅ Sample suppliers created');

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Fresh Mart Supermarket',
      email: 'purchasing@freshmart.com',
      phone: '+44 20 5555 0001',
      address: '789 Retail Road, Manchester, UK',
      notes: 'Preferred customer - weekly orders',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Gourmet Kitchen Co',
      email: 'orders@gourmetkitchen.com',
      phone: '+44 20 5555 0002',
      address: '321 Chef Lane, Birmingham, UK',
    },
  });

  console.log('✅ Sample customers created');

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: 'Organic Olive Oil',
      sku: 'OOL-001',
      description: 'Premium cold-pressed organic olive oil, 1L bottle',
      supplierId: supplier1.id,
      status: 'ACTIVE',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Wholegrain Flour',
      sku: 'WGF-002',
      description: 'Stone-ground wholegrain flour, 25kg sack',
      supplierId: supplier2.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Sample products created');

  // Create sample certifications
  const now = new Date();
  await prisma.certification.create({
    data: {
      supplierId: supplier1.id,
      type: 'HALAL',
      issueDate: new Date(now.getFullYear() - 1, now.getMonth(), 1),
      expiryDate: new Date(now.getFullYear(), now.getMonth() + 1, 1), // Expires in ~30 days
      documentUrl: null,
    },
  });

  await prisma.certification.create({
    data: {
      supplierId: supplier2.id,
      type: 'ISO',
      issueDate: new Date(now.getFullYear() - 2, 0, 15),
      expiryDate: new Date(now.getFullYear() + 1, 0, 15),
      documentUrl: null,
    },
  });

  console.log('✅ Sample certifications created');

  // Create a sample order
  await prisma.order.create({
    data: {
      customerId: customer1.id,
      orderDate: new Date(),
      status: 'PENDING',
      totalAmount: 350.0,
      items: {
        create: [
          { productId: product1.id, quantity: 10, price: 15.0 },
          { productId: product2.id, quantity: 5, price: 40.0 },
        ],
      },
    },
  });

  console.log('✅ Sample order created');

  // Create a sample opportunity
  await prisma.opportunity.create({
    data: {
      customerId: customer2.id,
      stage: 'NEGOTIATION',
      value: 5000.0,
      notes: 'Potential bulk order for catering business',
    },
  });

  console.log('✅ Sample opportunity created');

  // Create sample compliance log
  await prisma.complianceLog.create({
    data: {
      type: 'AUDIT',
      relatedEntityType: 'Supplier',
      relatedEntityId: supplier1.id,
      description: 'Annual supplier audit completed - all standards met',
      createdById: admin.id,
    },
  });

  console.log('✅ Sample compliance log created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin login: admin@business.com / Admin@123');
  console.log('Staff login: staff@business.com / Staff@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
