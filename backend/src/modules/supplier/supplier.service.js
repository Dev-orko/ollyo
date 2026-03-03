const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { paginate, paginatedResponse } = require('../../utils/pagination');

class SupplierService {
  static async getAll(query) {
    const { skip, take, page, limit } = paginate(query);

    const where = { isDeleted: false };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: { _count: { select: { products: true, certifications: true } } },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supplier.count({ where }),
    ]);

    return paginatedResponse(suppliers, total, page, limit);
  }

  static async getById(id) {
    const supplier = await prisma.supplier.findFirst({
      where: { id, isDeleted: false },
      include: {
        products: { where: { isDeleted: false }, orderBy: { createdAt: 'desc' } },
        certifications: { where: { isDeleted: false }, orderBy: { expiryDate: 'asc' } },
      },
    });

    if (!supplier) {
      throw AppError.notFound('Supplier not found');
    }

    return supplier;
  }

  static async create(data) {
    return prisma.supplier.create({ data });
  }

  static async update(id, data) {
    const existing = await prisma.supplier.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Supplier not found');
    }

    return prisma.supplier.update({ where: { id }, data });
  }

  static async delete(id) {
    const existing = await prisma.supplier.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      throw AppError.notFound('Supplier not found');
    }

    await prisma.supplier.update({ where: { id }, data: { isDeleted: true } });
    return { message: 'Supplier deleted successfully' };
  }
}

module.exports = SupplierService;
