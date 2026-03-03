/**
 * CSV Import Script
 *
 * Usage: node scripts/csvImport.js <entity> <filepath>
 * Example: node scripts/csvImport.js customers ./data/customers.csv
 *
 * Supported entities: customers, suppliers, products
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseCSV(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row');
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || null;
    });
    rows.push(row);
  }

  return rows;
}

const importers = {
  customers: async (rows) => {
    let count = 0;
    for (const row of rows) {
      await prisma.customer.create({
        data: {
          name: row.name,
          email: row.email || null,
          phone: row.phone || null,
          address: row.address || null,
          notes: row.notes || null,
        },
      });
      count++;
    }
    return count;
  },

  suppliers: async (rows) => {
    let count = 0;
    for (const row of rows) {
      await prisma.supplier.create({
        data: {
          name: row.name,
          email: row.email || null,
          phone: row.phone || null,
          address: row.address || null,
        },
      });
      count++;
    }
    return count;
  },

  products: async (rows) => {
    let count = 0;
    for (const row of rows) {
      // Look up supplier by name
      let supplier = null;
      if (row.supplierName) {
        supplier = await prisma.supplier.findFirst({
          where: { name: { contains: row.supplierName, mode: 'insensitive' } },
        });
      }

      if (!supplier && row.supplierId) {
        supplier = await prisma.supplier.findUnique({ where: { id: row.supplierId } });
      }

      if (!supplier) {
        console.warn(`⚠️  Skipping product "${row.name}": supplier not found`);
        continue;
      }

      await prisma.product.create({
        data: {
          name: row.name,
          sku: row.sku,
          description: row.description || null,
          supplierId: supplier.id,
          status: row.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        },
      });
      count++;
    }
    return count;
  },
};

async function main() {
  const [, , entity, filePath] = process.argv;

  if (!entity || !filePath) {
    console.log('Usage: node scripts/csvImport.js <entity> <filepath>');
    console.log('Supported entities: customers, suppliers, products');
    process.exit(1);
  }

  if (!importers[entity]) {
    console.error(`❌ Unknown entity: ${entity}`);
    console.log('Supported: customers, suppliers, products');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📄 Parsing CSV: ${filePath}`);
  const rows = parseCSV(filePath);
  console.log(`   Found ${rows.length} rows`);

  console.log(`📥 Importing ${entity}...`);
  const count = await importers[entity](rows);
  console.log(`✅ Successfully imported ${count} ${entity}`);
}

main()
  .catch((e) => {
    console.error('❌ Import error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
